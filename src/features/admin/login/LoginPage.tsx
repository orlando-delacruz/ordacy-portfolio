import {
  ArrowLeft,
  CircleAlert,
  Loader2,
  LockKeyhole,
  LogIn,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { usePageMeta } from '@/hooks/usePageMeta'
import { getSupabase } from '@/services/supabase'
import * as S from './styles/login.styled'

type Step =
  | { kind: 'password' }
  | {
      kind: 'enroll'
      factorId: string
      qr: string
      secret: string
      email: string
    }
  | { kind: 'verify'; factorId: string; email: string }

const errorMessage = (error: unknown) =>
  error instanceof Error && error.message
    ? error.message
    : 'Something went wrong. Try again.'

/**
 * Decides the next step for a password-authenticated session: verify an
 * existing TOTP factor, or enroll the first one. Abandoned unverified factors
 * are removed so the QR shown is always the active one.
 */
async function resolveStep(email: string): Promise<Step> {
  const supabase = await getSupabase()
  const factors = await supabase.auth.mfa.listFactors()
  if (factors.error) throw factors.error

  const verified = factors.data.all.find(
    (factor) =>
      factor.factor_type === 'totp' && factor.status === 'verified',
  )
  if (verified) return { kind: 'verify', factorId: verified.id, email }

  for (const factor of factors.data.all) {
    if (factor.status === 'unverified') {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: factor.id,
      })
      if (error) throw error
    }
  }

  const enrollment = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Ordacy Admin',
  })
  if (enrollment.error) throw enrollment.error

  const qr = enrollment.data.totp.qr_code
  return {
    kind: 'enroll',
    factorId: enrollment.data.id,
    // Current auth-js returns the SVG markup; older responses return a data
    // URI. Accept both so the image always renders.
    qr: qr.startsWith('data:')
      ? qr
      : qr.trimStart().startsWith('<svg')
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr)}`
        : `data:image/svg+xml;utf-8,${qr}`,
    secret: enrollment.data.totp.secret,
    email,
  }
}

export function LoginPage() {
  const [step, setStep] = useState<Step>({ kind: 'password' })
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  usePageMeta({
    path: '*',
    title: 'Admin sign in · Ordacy Admin',
    description: 'Sign in to manage the Ordacy website.',
    noindex: true,
  })

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      let supabase
      try {
        supabase = await getSupabase()
      } catch (loadError) {
        if (!active) return
        setError(errorMessage(loadError))
        setChecking(false)
        return
      }
      // Verify against the auth server so a revoked or expired token does not
      // bounce this page straight back to the admin shell.
      const { data, error: userError } = await supabase.auth.getUser()
      if (!active) return
      if (userError || !data.user) {
        await supabase.auth.signOut({ scope: 'local' })
        if (active) setChecking(false)
        return
      }

      const level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!active) return
      if (level.error) {
        setError(errorMessage(level.error))
        setChecking(false)
        return
      }
      if (level.data?.currentLevel === 'aal2') {
        navigate('/admin', { replace: true })
        return
      }

      try {
        const next = await resolveStep(data.user.email ?? '')
        if (active) setStep(next)
      } catch (nextError) {
        if (active) setError(errorMessage(nextError))
      } finally {
        if (active) setChecking(false)
      }
    }

    void bootstrap()
    return () => {
      active = false
    }
  }, [navigate])

  useEffect(() => {
    if (step.kind !== 'password' && !checking) codeRef.current?.focus()
  }, [step.kind, checking])

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }

    setBusy(true)
    let supabase
    try {
      supabase = await getSupabase()
    } catch (loadError) {
      setBusy(false)
      setError(errorMessage(loadError))
      return
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      setBusy(false)
      setError(
        signInError.status === 400
          ? 'Email or password is incorrect.'
          : errorMessage(signInError),
      )
      return
    }

    try {
      setStep(await resolveStep(email))
    } catch (nextError) {
      setError(errorMessage(nextError))
    } finally {
      setBusy(false)
    }
  }

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step.kind === 'password') return

    setError(null)
    const data = new FormData(event.currentTarget)
    const code = String(data.get('code') ?? '').replace(/\s/g, '')
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the six-digit code from your authenticator app.')
      return
    }

    setBusy(true)
    let supabase
    try {
      supabase = await getSupabase()
    } catch (loadError) {
      setBusy(false)
      setError(errorMessage(loadError))
      return
    }
    const challenge = await supabase.auth.mfa.challenge({
      factorId: step.factorId,
    })
    if (challenge.error) {
      setBusy(false)
      setError(errorMessage(challenge.error))
      return
    }

    const verify = await supabase.auth.mfa.verify({
      factorId: step.factorId,
      challengeId: challenge.data.id,
      code,
    })
    if (verify.error) {
      setBusy(false)
      setError(
        verify.error.message.toLowerCase().includes('invalid')
          ? 'That code is not valid. Check your authenticator and try again.'
          : errorMessage(verify.error),
      )
      return
    }

    navigate('/admin', { replace: true })
  }

  const useAnotherAccount = async () => {
    setBusy(true)
    setError(null)
    try {
      const supabase = await getSupabase()
      await supabase.auth.signOut()
      setStep({ kind: 'password' })
    } catch (loadError) {
      setError(errorMessage(loadError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <S.Page>
      <S.TopBar>
        <S.Brand to="/" aria-label="Ordacy home">
          <BrandLogo />
          <Wordmark />
        </S.Brand>
        <S.Tag>Admin</S.Tag>
      </S.TopBar>

      <S.Main>
        <S.Card aria-labelledby="login-title">
          <S.CardHeader>
            <h1 id="login-title">Admin sign in</h1>
            <p>
              Owner access only. Your account uses a password and an
              authenticator app.
            </p>
          </S.CardHeader>

          {checking && (
            <S.Checking role="status">
              <Loader2 size={20} strokeWidth={2} aria-hidden="true" data-spin />
              Checking your session…
            </S.Checking>
          )}

          {!checking && step.kind === 'password' && (
            <S.Form onSubmit={submitPassword} noValidate>
              <S.Field>
                <S.Label htmlFor="login-email">Email</S.Label>
                <S.Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  autoFocus
                  required
                  aria-invalid={Boolean(error)}
                />
              </S.Field>
              <S.Field>
                <S.Label htmlFor="login-password">Password</S.Label>
                <S.Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  aria-invalid={Boolean(error)}
                />
              </S.Field>
              {error && (
                <S.Alert id="login-error" role="alert">
                  <CircleAlert size={16} strokeWidth={2} aria-hidden="true" />
                  {error}
                </S.Alert>
              )}
              <S.Submit type="submit" disabled={busy}>
                <LogIn size={16} strokeWidth={2} aria-hidden="true" />
                {busy ? 'Signing in…' : 'Continue'}
              </S.Submit>
            </S.Form>
          )}

          {!checking && step.kind === 'enroll' && (
            <S.Form onSubmit={submitCode} noValidate>
              <S.StepHeader>
                <h2>Set up two-factor authentication</h2>
                <p>
                  Scan this code with your authenticator app, then enter the
                  six-digit code it shows.
                </p>
              </S.StepHeader>
              <S.QrWrap>
                <img
                  src={step.qr}
                  alt="QR code for the Ordacy Admin authenticator entry"
                />
              </S.QrWrap>
              <S.SecretBlock>
                <span>Can’t scan it? Enter this setup key:</span>
                <code>{step.secret}</code>
              </S.SecretBlock>
              <S.Field>
                <S.Label htmlFor="login-code">Authentication code</S.Label>
                <S.Input
                  ref={codeRef}
                  id="login-code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  required
                  $code
                  $invalid={Boolean(error)}
                  aria-describedby={
                    error ? 'login-code-hint login-error' : 'login-code-hint'
                  }
                />
                <S.Hint id="login-code-hint">
                  Six digits from your authenticator app.
                </S.Hint>
              </S.Field>
              {error && (
                <S.Alert id="login-error" role="alert">
                  <CircleAlert size={16} strokeWidth={2} aria-hidden="true" />
                  {error}
                </S.Alert>
              )}
              <S.Submit type="submit" disabled={busy}>
                <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
                {busy ? 'Verifying…' : 'Verify and sign in'}
              </S.Submit>
              <S.Secondary
                type="button"
                onClick={useAnotherAccount}
                disabled={busy}
              >
                <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                Use a different account
              </S.Secondary>
            </S.Form>
          )}

          {!checking && step.kind === 'verify' && (
            <S.Form onSubmit={submitCode} noValidate>
              <S.StepHeader>
                <h2>Enter your authenticator code</h2>
                <p>Finish signing in as {step.email}.</p>
              </S.StepHeader>
              <S.Field>
                <S.Label htmlFor="login-code">Authentication code</S.Label>
                <S.Input
                  ref={codeRef}
                  id="login-code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  required
                  $code
                  $invalid={Boolean(error)}
                  aria-describedby={
                    error ? 'login-code-hint login-error' : 'login-code-hint'
                  }
                />
                <S.Hint id="login-code-hint">
                  Six digits from your authenticator app.
                </S.Hint>
              </S.Field>
              {error && (
                <S.Alert id="login-error" role="alert">
                  <CircleAlert size={16} strokeWidth={2} aria-hidden="true" />
                  {error}
                </S.Alert>
              )}
              <S.Submit type="submit" disabled={busy}>
                <LockKeyhole size={16} strokeWidth={2} aria-hidden="true" />
                {busy ? 'Verifying…' : 'Verify and sign in'}
              </S.Submit>
              <S.Secondary
                type="button"
                onClick={useAnotherAccount}
                disabled={busy}
              >
                <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                Use a different account
              </S.Secondary>
            </S.Form>
          )}
        </S.Card>

        <S.BackLink to="/">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to public site
        </S.BackLink>
      </S.Main>
    </S.Page>
  )
}
