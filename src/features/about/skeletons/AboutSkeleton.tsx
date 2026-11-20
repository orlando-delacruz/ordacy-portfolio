import { useTheme } from 'styled-components'
import {
  SkeletonBlock,
  SkeletonButton,
  SkeletonCircle,
  SkeletonLine,
  SkeletonPage,
} from '@/components/skeletons/SkeletonPrimitives'
import {
  SkeletonCta,
  SkeletonPageHero,
  SkeletonSectionHead,
} from '@/components/skeletons/SkeletonSections'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import * as About from '../styles/about.styled'
import * as AboutSections from '../styles/about-sections.styled'
import * as Address from '../styles/address-explorer.styled'
import * as MobileServices from '../styles/mobile-services.styled'
import * as MobileSystems from '../styles/mobile-systems.styled'
import * as Service from '../styles/service-explorer.styled'

const problems = ['one', 'two', 'three', 'four', 'five']
const services = ['one', 'two', 'three', 'four', 'five', 'six']
const principles = ['one', 'two', 'three', 'four', 'five']
const processSteps = ['one', 'two', 'three', 'four']
const audiences = ['one', 'two', 'three', 'four']
const expectations = ['one', 'two', 'three', 'four', 'five', 'six']
const purposeLines = ['100%', '92%', '70%', '100%', '88%', '52%']
const serviceDots = ['one', 'two', 'three', 'four', 'five', 'six']

/**
 * About page skeleton: hero, purpose, problem/service explorer, principles,
 * process, audience, expectations and closing CTA. It follows the page's
 * desktop/mobile composition switch so each width matches the real layout.
 */
export function AboutSkeleton() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`)

  return (
    <SkeletonPage label="Loading about page">
      <SkeletonPageHero />

      <About.Block>
        <SkeletonSectionHead />
        {isDesktop ? (
          <About.WhyCopy>
            {purposeLines.map((width, index) => (
              <SkeletonLine key={`${width}-${index}`} $w={width} />
            ))}
          </About.WhyCopy>
        ) : (
          <>
            <MobileSystems.Switcher>
              <SkeletonBlock $h="2.75rem" $r="0.5rem" />
              <SkeletonBlock $h="2.75rem" $r="0.5rem" />
            </MobileSystems.Switcher>
            <MobileSystems.List>
              {problems.map((problem) => (
                <MobileSystems.Row key={problem}>
                  <MobileSystems.RowButton as="div">
                    <MobileSystems.IconTile>
                      <SkeletonCircle $size="1.25rem" />
                    </MobileSystems.IconTile>
                    <MobileSystems.RowBody>
                      <SkeletonLine $w="60%" $h="0.875rem" />
                      <SkeletonLine $w="90%" $h="0.75rem" />
                    </MobileSystems.RowBody>
                    <SkeletonCircle $size="1.5rem" />
                  </MobileSystems.RowButton>
                </MobileSystems.Row>
              ))}
            </MobileSystems.List>
          </>
        )}
      </About.Block>

      {isDesktop && (
        <About.Block>
          <SkeletonSectionHead />
          <Address.Explorer>
            <Address.TabList>
              {problems.map((problem) => (
                <Address.Tab key={problem} as="div">
                  <Address.TabIcon>
                    <SkeletonCircle $size="1.25rem" />
                  </Address.TabIcon>
                  <Address.TabBody>
                    <SkeletonLine $w="65%" $h="0.875rem" />
                    <SkeletonLine $w="85%" $h="0.75rem" />
                  </Address.TabBody>
                  <SkeletonCircle $size="1rem" />
                </Address.Tab>
              ))}
            </Address.TabList>
            <Address.Panel>
              <Address.Intro>
                <Address.Rule />
                <SkeletonLine $w="50%" $h="1.5rem" />
              </Address.Intro>
              <Address.PanelHead>
                <Address.PanelIcon>
                  <SkeletonCircle $size="1.5rem" />
                </Address.PanelIcon>
                <div>
                  <SkeletonLine $w="60%" $h="1.25rem" />
                  <SkeletonLine $w="100%" $h="0.75rem" />
                  <SkeletonLine $w="85%" $h="0.75rem" />
                </div>
              </Address.PanelHead>
              <Address.Divider />
              <Address.Help>
                <SkeletonLine $w="5rem" $h="0.75rem" />
                <SkeletonLine $w="70%" $h="1rem" />
                <SkeletonLine $w="60%" $h="1rem" />
              </Address.Help>
              <SkeletonButton $w="12rem" />
            </Address.Panel>
          </Address.Explorer>
        </About.Block>
      )}

      <About.Block>
        <SkeletonSectionHead />
        {isDesktop ? (
          <Service.Explorer>
            <Service.TabList>
              {services.map((service) => (
                <SkeletonBlock key={service} $h="3rem" $r="0.75rem" />
              ))}
            </Service.TabList>
            <Service.Panel>
              <Service.PanelHead>
                <SkeletonBlock $w="3rem" $h="3rem" $r="0.75rem" />
                <div>
                  <SkeletonLine $w="60%" $h="1.5rem" />
                  <SkeletonLine $w="100%" $h="0.75rem" />
                  <SkeletonLine $w="80%" $h="0.75rem" />
                </div>
              </Service.PanelHead>
              <Service.Problem>
                <SkeletonLine $w="6rem" $h="0.75rem" />
                <SkeletonLine $w="100%" $h="0.75rem" />
                <SkeletonLine $w="75%" $h="0.75rem" />
              </Service.Problem>
              <Service.Columns>
                {[0, 1].map((column) => (
                  <div key={column}>
                    <SkeletonLine $w="40%" $h="0.75rem" />
                    <SkeletonBlock $h="5rem" />
                  </div>
                ))}
              </Service.Columns>
              <Service.Footer>
                <SkeletonLine $w="50%" $h="0.75rem" />
                <SkeletonButton $w="12rem" />
              </Service.Footer>
            </Service.Panel>
          </Service.Explorer>
        ) : (
          <MobileServices.Carousel>
            <MobileServices.Track>
              <MobileServices.Card as="div">
                <MobileServices.Copy>
                  <SkeletonBlock $w="2.25rem" $h="2.25rem" $r="0.5rem" />
                  <SkeletonLine $w="70%" $h="1.25rem" />
                  <SkeletonLine $w="100%" $h="0.75rem" />
                  <SkeletonLine $w="80%" $h="0.75rem" />
                </MobileServices.Copy>
                <SkeletonBlock $h="7rem" $r="0.75rem" />
              </MobileServices.Card>
            </MobileServices.Track>
            <MobileServices.Dots>
              {serviceDots.map((dot) => (
                <SkeletonCircle key={dot} $size="0.5rem" />
              ))}
            </MobileServices.Dots>
          </MobileServices.Carousel>
        )}
      </About.Block>

      <About.Block>
        <SkeletonSectionHead />
        <AboutSections.PrinciplesList>
          {principles.map((principle) => (
            <AboutSections.PrincipleCard key={principle}>
              <SkeletonBlock $w="2.5rem" $h="2.5rem" $r="0.5rem" />
              <SkeletonLine $w="80%" $h="1rem" />
              <SkeletonLine $w="100%" $h="0.75rem" />
              <SkeletonLine $w="70%" $h="0.75rem" />
            </AboutSections.PrincipleCard>
          ))}
        </AboutSections.PrinciplesList>
      </About.Block>

      <About.Block>
        <SkeletonSectionHead />
        <AboutSections.ProcessList>
          {processSteps.map((step) => (
            <AboutSections.ProcessStep key={step}>
              <SkeletonCircle $size="2.5rem" />
              <SkeletonLine $w="70%" $h="1rem" />
              <SkeletonLine $w="100%" $h="0.75rem" />
              <SkeletonLine $w="80%" $h="0.75rem" />
            </AboutSections.ProcessStep>
          ))}
        </AboutSections.ProcessList>
      </About.Block>

      <About.Block>
        <SkeletonSectionHead />
        <AboutSections.AudienceList>
          {audiences.map((audience) => (
            <AboutSections.AudienceCard key={audience}>
              <SkeletonCircle $size="2.5rem" />
              <AboutSections.AudienceBody>
                <SkeletonLine $w="60%" $h="1rem" />
                <SkeletonLine $w="90%" $h="0.75rem" />
              </AboutSections.AudienceBody>
            </AboutSections.AudienceCard>
          ))}
        </AboutSections.AudienceList>
      </About.Block>

      <About.Block>
        <SkeletonSectionHead />
        <AboutSections.ExpectationsList>
          {expectations.map((expectation) => (
            <AboutSections.Expectation key={expectation}>
              <SkeletonCircle $size="1.25rem" />
              <AboutSections.ExpectationBody>
                <SkeletonLine $w="60%" $h="0.875rem" />
                <SkeletonLine $w="95%" $h="0.75rem" />
              </AboutSections.ExpectationBody>
            </AboutSections.Expectation>
          ))}
        </AboutSections.ExpectationsList>
      </About.Block>

      <SkeletonCta />
    </SkeletonPage>
  )
}
