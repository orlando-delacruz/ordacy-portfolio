import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Languages,
  MessagesSquare,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { PrimaryButton, SecondaryButton } from '@/components/ui/styles/buttons.styled'
import { getSection } from '@/data'
import type { TeamMember } from '@/data'
import * as S from '../styles/team-resume.styled'

type TeamResumeProps = {
  member: TeamMember
}

type BlockHeadProps = {
  id: string
  title: string
  icon: LucideIcon
}

function BlockHead({ id, title, icon: Icon }: BlockHeadProps) {
  return (
    <S.BlockHead>
      <S.BlockIcon aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </S.BlockIcon>
      <S.BlockTitle id={`${id}-title`} tabIndex={-1}>
        {title}
      </S.BlockTitle>
      <S.BlockRule aria-hidden="true" />
    </S.BlockHead>
  )
}

/** "Cum Laude. Best Capstone Award." -> two separate lines. */
// shortcut: honors are plain sentences split on ". "; upgrade to structured
// education details if entries need multiple fields or abbreviations.
function detailLines(details: string) {
  return details
    .split('. ')
    .map((line) => line.replace(/\.$/, '').trim())
    .filter(Boolean)
}

export function TeamResume({ member }: TeamResumeProps) {
  const profile = getSection('team', 'profile')
  const experience = getSection('team', 'experience')
  const education = getSection('team', 'education')
  const skills = getSection('team', 'skills')
  const credentials = getSection('team', 'credentials')
  const contact = getSection('team', 'contact')
  const skillGroups = member.skillGroups ?? []
  const [skillsOpen, setSkillsOpen] = useState(false)
  const sectionId = (name: string) => `member-${member.slug}-${name}`
  const skillsListId = `${sectionId('skills')}-list`

  // Interleave groups so the two-row preview shows something from every stack.
  const previewSkills: string[] = []
  const longestGroup = skillGroups.reduce(
    (longest, group) => Math.max(longest, group.items.length),
    0,
  )
  for (let index = 0; index < longestGroup; index += 1) {
    for (const group of skillGroups) {
      const item = group.items[index]
      if (item) previewSkills.push(item)
    }
  }

  return (
    <>
      <S.Resume>
        <S.Main>
          <S.Block
            aria-labelledby={`${sectionId('profile')}-title`}
            data-reveal=""
          >
            <S.DotField aria-hidden="true" />
            <BlockHead
              id={sectionId('profile')}
              title={profile.title}
              icon={UserRound}
            />
            <S.Lead>{member.summary}</S.Lead>
          </S.Block>

          {member.experience.length > 0 && (
            <S.Block
              aria-labelledby={`${sectionId('experience')}-title`}
              data-reveal="1"
            >
              <BlockHead
                id={sectionId('experience')}
                title={experience.title}
                icon={Briefcase}
              />
              <S.Timeline>
                {member.experience.map((entry) => (
                  <S.TimelineItem
                    key={`${entry.role}-${entry.organization}`}
                  >
                    <S.TimelineMarker aria-hidden="true">
                      <Building2 size={16} strokeWidth={2} />
                    </S.TimelineMarker>
                    <S.EntryBody>
                      <S.EntryHead>
                        <S.EntryTitle>{entry.role}</S.EntryTitle>
                        <S.EntryPeriod>{entry.period}</S.EntryPeriod>
                      </S.EntryHead>
                      <S.EntryOrg>{entry.organization}</S.EntryOrg>
                      {entry.summary && (
                        <S.EntryText>{entry.summary}</S.EntryText>
                      )}
                    </S.EntryBody>
                  </S.TimelineItem>
                ))}
              </S.Timeline>
            </S.Block>
          )}

          {member.education.length > 0 && (
            <S.Block
              aria-labelledby={`${sectionId('education')}-title`}
              data-reveal="2"
            >
              <BlockHead
                id={sectionId('education')}
                title={education.title}
                icon={GraduationCap}
              />
              <S.Timeline>
                {member.education.map((entry) => {
                  const details = detailLines(entry.details)

                  return (
                    <S.TimelineItem
                      key={`${entry.credential}-${entry.school}`}
                    >
                      <S.TimelineMarker aria-hidden="true">
                        <BookOpen size={16} strokeWidth={2} />
                      </S.TimelineMarker>
                      <S.EntryBody>
                        <S.EntryHead>
                          <S.EntryTitle>{entry.credential}</S.EntryTitle>
                          <S.EntryPeriod>{entry.period}</S.EntryPeriod>
                        </S.EntryHead>
                        <S.EntryOrg>{entry.school}</S.EntryOrg>
                        {details.length > 0 && (
                          <S.EducationDetails>
                            {details.map((detail) => (
                              <li key={detail}>{detail}</li>
                            ))}
                          </S.EducationDetails>
                        )}
                      </S.EntryBody>
                    </S.TimelineItem>
                  )
                })}
              </S.Timeline>
            </S.Block>
          )}
        </S.Main>

        <S.Side>
          {skillGroups.length === 0 && member.skills.length > 0 && (
            <S.Block
              aria-labelledby={`${sectionId('skills')}-title`}
              data-reveal="1"
            >
              <BlockHead
                id={sectionId('skills')}
                title={skills.title}
                icon={Sparkles}
              />
              <S.Pills>
                {member.skills.map((skill) => (
                  <S.Pill key={skill}>{skill}</S.Pill>
                ))}
              </S.Pills>
            </S.Block>
          )}

          {(member.certifications.length > 0 ||
            member.languages.length > 0) && (
            <S.Block
              aria-labelledby={`${sectionId('credentials')}-title`}
              data-reveal="2"
            >
              <BlockHead
                id={sectionId('credentials')}
                title={credentials.title}
                icon={BadgeCheck}
              />
              {member.certifications.length > 0 && (
                <S.MetaList aria-label="Certifications">
                  {member.certifications.map((cert) => (
                    <S.MetaItem key={cert.name}>
                      <S.MetaIcon aria-hidden="true">
                        <Award size={16} strokeWidth={2} />
                      </S.MetaIcon>
                      <S.MetaBody>
                        <S.MetaName>{cert.name}</S.MetaName>
                        <S.MetaDetail>
                          {cert.issuer} · {cert.year}
                        </S.MetaDetail>
                      </S.MetaBody>
                    </S.MetaItem>
                  ))}
                </S.MetaList>
              )}
              {member.languages.length > 0 && (
                <S.MetaList aria-label="Languages">
                  <S.MetaItem>
                    <S.MetaIcon aria-hidden="true">
                      <Languages size={16} strokeWidth={2} />
                    </S.MetaIcon>
                    <S.MetaBody>
                      <S.MetaName>Languages</S.MetaName>
                      <S.MetaDetail>{member.languages.join(' · ')}</S.MetaDetail>
                    </S.MetaBody>
                  </S.MetaItem>
                </S.MetaList>
              )}
            </S.Block>
          )}

          <S.ContactCard
            aria-labelledby={sectionId('contact')}
            data-reveal="3"
          >
            <S.BlockHead>
              <S.BlockIcon aria-hidden="true">
                <MessagesSquare size={18} strokeWidth={2} />
              </S.BlockIcon>
              <S.ContactTitle id={sectionId('contact')}>
                {contact.title}
              </S.ContactTitle>
            </S.BlockHead>
            <S.ContactText>{contact.description}</S.ContactText>
            <S.ContactActions>
              <PrimaryButton to="/contact">
                <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
                Let's talk
              </PrimaryButton>
              <SecondaryButton to="/#team">
                <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
                Team
              </SecondaryButton>
            </S.ContactActions>
          </S.ContactCard>
        </S.Side>
      </S.Resume>

      {skillGroups.length > 0 && (
        <S.StackBand
          aria-labelledby={`${sectionId('skills')}-title`}
          data-reveal=""
        >
          <BlockHead
            id={sectionId('skills')}
            title={skills.title}
            icon={Sparkles}
          />
          {skillsOpen ? (
            <S.StackGrid id={skillsListId}>
              {skillGroups.map((group) => (
                <S.StackGroup key={group.label}>
                  <S.StackHead>
                    <S.StackLabel>{group.label}</S.StackLabel>
                    <S.StackCount aria-hidden="true">
                      {group.items.length}
                    </S.StackCount>
                  </S.StackHead>
                  <S.Pills>
                    {group.items.map((item) => (
                      <S.Pill key={item}>{item}</S.Pill>
                    ))}
                  </S.Pills>
                </S.StackGroup>
              ))}
            </S.StackGrid>
          ) : (
            <S.SkillsPreview id={skillsListId}>
              <S.Pills>
                {previewSkills.map((item) => (
                  <S.Pill key={item}>{item}</S.Pill>
                ))}
              </S.Pills>
            </S.SkillsPreview>
          )}
          <S.SkillsToggle
            type="button"
            aria-expanded={skillsOpen}
            aria-controls={skillsListId}
            onClick={() => setSkillsOpen((open) => !open)}
          >
            {skillsOpen ? (
              <ChevronUp size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            )}
            {skillsOpen ? 'Hide' : 'Show All'}
          </S.SkillsToggle>
        </S.StackBand>
      )}
    </>
  )
}
