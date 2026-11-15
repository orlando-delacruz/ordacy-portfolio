import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Languages,
  MessagesSquare,
  UserRound,
  Wrench,
} from 'lucide-react'
import { PrimaryButton, SecondaryButton } from '@/components/ui/styles/buttons.styled'
import { getSection } from '@/data'
import type { TeamMember } from '@/data'
import * as S from '../styles/team-resume.styled'

type TeamResumeProps = {
  member: TeamMember
}

export function TeamResume({ member }: TeamResumeProps) {
  const profile = getSection('team', 'profile')
  const experience = getSection('team', 'experience')
  const education = getSection('team', 'education')
  const skills = getSection('team', 'skills')
  const credentials = getSection('team', 'credentials')
  const contact = getSection('team', 'contact')

  return (
    <>
      <S.Resume>
        <S.Main>
          <S.Block aria-labelledby={`member-${member.slug}-profile`}>
            <S.BlockHeading>
              <S.IconBadgeCompact>
                <UserRound size={20} strokeWidth={2} aria-hidden="true" />
              </S.IconBadgeCompact>
              <S.BlockTitle id={`member-${member.slug}-profile`}>
                {profile.title}
              </S.BlockTitle>
            </S.BlockHeading>
            <S.Lead>{member.summary}</S.Lead>
          </S.Block>

          {member.experience.length > 0 && (
            <S.Block aria-labelledby={`member-${member.slug}-experience`}>
              <S.BlockHeading>
                <S.IconBadgeCompact>
                  <Briefcase size={20} strokeWidth={2} aria-hidden="true" />
                </S.IconBadgeCompact>
                <S.BlockTitle id={`member-${member.slug}-experience`}>
                  {experience.title}
                </S.BlockTitle>
              </S.BlockHeading>
              <S.Timeline>
                {member.experience.map((entry) => (
                  <S.TimelineItem key={`${entry.role}-${entry.organization}`}>
                    <S.EntryTitle>{entry.role}</S.EntryTitle>
                    <S.EntryMeta>
                      {entry.organization} · {entry.period}
                    </S.EntryMeta>
                    <S.EntryText>{entry.summary}</S.EntryText>
                  </S.TimelineItem>
                ))}
              </S.Timeline>
            </S.Block>
          )}

          {member.education.length > 0 && (
            <S.Block aria-labelledby={`member-${member.slug}-education`}>
              <S.BlockHeading>
                <S.IconBadgeCompact>
                  <GraduationCap size={20} strokeWidth={2} aria-hidden="true" />
                </S.IconBadgeCompact>
                <S.BlockTitle id={`member-${member.slug}-education`}>
                  {education.title}
                </S.BlockTitle>
              </S.BlockHeading>
              <S.Timeline>
                {member.education.map((entry) => (
                  <S.TimelineItem
                    key={`${entry.credential}-${entry.school}`}
                  >
                    <S.EntryTitle>{entry.credential}</S.EntryTitle>
                    <S.EntryMeta>
                      {entry.school} · {entry.period}
                    </S.EntryMeta>
                    <S.EntryText>{entry.details}</S.EntryText>
                  </S.TimelineItem>
                ))}
              </S.Timeline>
            </S.Block>
          )}
        </S.Main>

        <S.Side>
          {member.skills.length > 0 && (
            <S.Block aria-labelledby={`member-${member.slug}-skills`}>
              <S.BlockHeading>
                <S.IconBadgeCompact>
                  <Wrench size={20} strokeWidth={2} aria-hidden="true" />
                </S.IconBadgeCompact>
                <S.BlockTitle id={`member-${member.slug}-skills`}>
                  {skills.title}
                </S.BlockTitle>
              </S.BlockHeading>
              <S.Pills>
                {member.skills.map((skill) => (
                  <S.Pill key={skill}>{skill}</S.Pill>
                ))}
              </S.Pills>
            </S.Block>
          )}

          {(member.certifications.length > 0 ||
            member.languages.length > 0) && (
            <S.Block aria-labelledby={`member-${member.slug}-credentials`}>
              <S.BlockHeading>
                <S.IconBadgeCompact>
                  <BadgeCheck size={20} strokeWidth={2} aria-hidden="true" />
                </S.IconBadgeCompact>
                <S.BlockTitle id={`member-${member.slug}-credentials`}>
                  {credentials.title}
                </S.BlockTitle>
              </S.BlockHeading>
              {member.certifications.length > 0 && (
                <S.MetaList aria-label="Certifications">
                  {member.certifications.map((cert) => (
                    <S.MetaItem key={cert.name}>
                      <S.MetaName>{cert.name}</S.MetaName>
                      <S.MetaDetail>
                        {cert.issuer} · {cert.year}
                      </S.MetaDetail>
                    </S.MetaItem>
                  ))}
                </S.MetaList>
              )}
              {member.languages.length > 0 && (
                <S.MetaList aria-label="Languages">
                  <S.MetaItem>
                    <S.MetaName>
                      <Languages
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                        style={{ verticalAlign: 'text-bottom' }}
                      />{' '}
                      Languages
                    </S.MetaName>
                    <S.MetaDetail>{member.languages.join(' · ')}</S.MetaDetail>
                  </S.MetaItem>
                </S.MetaList>
              )}
            </S.Block>
          )}

          <S.ContactCard aria-labelledby={`member-${member.slug}-contact`}>
            <S.BlockHeading>
              <S.IconBadgeCompact>
                <MessagesSquare size={20} strokeWidth={2} aria-hidden="true" />
              </S.IconBadgeCompact>
              <S.ContactTitle id={`member-${member.slug}-contact`}>
                {contact.title}
              </S.ContactTitle>
            </S.BlockHeading>
            <S.ContactText>{contact.description}</S.ContactText>
            <PrimaryButton to="/contact">
              <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
              Start a conversation
            </PrimaryButton>
            <SecondaryButton to="/#team">
              <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
              Back to team
            </SecondaryButton>
          </S.ContactCard>
        </S.Side>
      </S.Resume>
    </>
  )
}
