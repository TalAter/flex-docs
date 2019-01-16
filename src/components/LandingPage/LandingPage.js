import React from 'react';
import styled from 'styled-components';

import {
  baselineSmall,
  baselineLarge,
  baselineBreakpoint,
  H5,
  H6,
  P,
  A,
  Ul,
} from '../../brand-components';
import { grid } from '../../config';
import { MainLayout, UiText } from '../../components';
import { IntroHeading, IntroDescription } from './Intro';
import Section, {
  SectionHeadingLink,
  SectionDescription,
  SectionLinks,
  SectionLink,
} from './Section';

const Content = styled.div`
  max-width: ${props =>
    props.theme.pageContentMaxWidth + 2 * grid.sideMargin}px;
  margin-left: auto;
  margin-right: auto;
`;

const HeadingBr = styled.br`
  display: none;

  @media (min-width: 470px) {
    display: block;
  }
  @media (min-width: ${baselineBreakpoint}px) {
    display: none;
  }
  @media (min-width: 900px) {
    display: block;
  }
`;

const IntroBr = styled.br`
  display: none;

  @media (min-width: 1070px) {
    display: block;
  }
`;

const Paragraph = styled(P)`
  margin-top: ${3 * baselineSmall}px;
  margin-bottom: ${11 * baselineSmall}px;
  margin-left: ${props => props.theme.contentPaddingSmall}px;
  margin-right: ${props => props.theme.contentPaddingSmall}px;

  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.08px;

  // Offset baseline
  top: 1px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${7 * baselineLarge}px;
    margin-bottom: ${13 * baselineLarge}px;
    margin-left: ${props =>
      props.theme.contentPaddingLarge + grid.sideMargin}px;
    margin-right: ${props =>
      props.theme.contentPaddingLarge + grid.sideMargin}px;

    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.09px;

    // Offset baseline
    top: -2px;
  }
`;

const CollectionsHeading = styled(H6)`
  color: #a2a6a9;

  margin-top: ${4 * baselineSmall}px;
  margin-left: ${props => props.theme.contentPaddingSmall}px;
  margin-right: ${props => props.theme.contentPaddingSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${12 * baselineLarge}px;
    margin-left: ${props =>
      props.theme.contentPaddingLarge + grid.sideMargin}px;
    margin-right: ${props =>
      props.theme.contentPaddingLarge + grid.sideMargin}px;
  }
`;

const GettingStartedSection = styled(Section)`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: ${2 * baselineSmall}px;

  margin-top: ${2 * baselineSmall}px;
  margin-left: ${grid.smallGap}px;
  margin-right: ${grid.smallGap}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${3 * baselineLarge}px;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 139px;
  }
`;

const CategoriesHeading = styled(H6)`
  color: #a2a6a9;

  margin-top: ${5 * baselineSmall}px;
  margin-left: ${props => props.theme.contentPaddingSmall}px;
  margin-right: ${props => props.theme.contentPaddingSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${10 * baselineLarge}px;
    margin-left: ${props =>
      props.theme.contentPaddingLarge + grid.sideMargin}px;
    margin-right: ${props =>
      props.theme.contentPaddingLarge + grid.sideMargin}px;
  }
`;

const Grid = styled.div`
  margin-top: ${2 * baselineSmall}px;
  margin-left: ${grid.smallGap}px;
  margin-right: ${grid.smallGap}px;
  display: grid;
  grid-row-gap: ${grid.smallGap}px;
  grid-column-gap: ${grid.smallGap}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${3 * baselineLarge}px;
    grid-row-gap: ${grid.largeGap}px;
    grid-column-gap: ${grid.largeGap}px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
`;

const LandingPage = props => {
  const { articleCounts } = props;
  const description = UiText.fn('LandingPage.meta.description');
  return (
    <MainLayout description={description}>
      <Content>
        <IntroHeading>
          <UiText id="LandingPage.headingLine1" />
          <HeadingBr />
          <UiText id="LandingPage.headingLine2" />
        </IntroHeading>
        <IntroDescription>
          <P>
            <UiText id="LandingPage.introParagraph1" />
            <IntroBr />
            <UiText id="LandingPage.introParagraph2" />{' '}
            <A href="https://www.sharetribe.com/flex/roadmap">
              <UiText id="LandingPage.introRoadmapLink" />
            </A>
            {'.'}
          </P>
        </IntroDescription>
        <CollectionsHeading as="h2">
          <UiText id="LandingPage.collectionsHeading" />
        </CollectionsHeading>
        <GettingStartedSection>
          <div>
            <H5 as="h3">
              <UiText id="LandingPage.gettingStarted.heading" />
            </H5>
            <SectionDescription>
              <UiText id="LandingPage.gettingStarted.description" />
            </SectionDescription>
          </div>
          <Ul>
            <SectionLink to="/background/overview/">
              <UiText id="LandingPage.gettingStarted.overview" />
            </SectionLink>
            <SectionLink to="/background/development-skills/">
              <UiText id="LandingPage.gettingStarted.devSkills" />
            </SectionLink>
            <SectionLink to="/tutorials/getting-started-with-ftw/">
              <UiText id="LandingPage.gettingStarted.ftwSetup" />
            </SectionLink>
          </Ul>
        </GettingStartedSection>
        <CategoriesHeading as="h2">
          <UiText id="LandingPage.categoriesHeading" />
        </CategoriesHeading>
        <Grid>
          {/* TUTORIALS */}
          <Section>
            <SectionHeadingLink to="/tutorials/">
              <UiText id="LandingPage.tutorials.title" />
            </SectionHeadingLink>
            <SectionDescription>
              <UiText id="LandingPage.tutorials.description" />
            </SectionDescription>
            <SectionLinks>
              <SectionLink to="/tutorials/getting-started-with-ftw/">
                <UiText id="LandingPage.tutorials.gettingStartedFtw" />
              </SectionLink>
              <SectionLink to="/tutorials/">
                <UiText id="LandingPage.tutorials.all" /> (
                {articleCounts.tutorials || 0})
              </SectionLink>
            </SectionLinks>
          </Section>

          {/* GUIDES */}
          <Section>
            <SectionHeadingLink to="/guides/">
              <UiText id="LandingPage.guides.title" />
            </SectionHeadingLink>
            <SectionDescription>
              <UiText id="LandingPage.guides.description" />
            </SectionDescription>
            <SectionLinks>
              <SectionLink to="/guides/">
                <UiText id="LandingPage.guides.all" /> (
                {articleCounts.guides || 0})
              </SectionLink>
            </SectionLinks>
          </Section>

          {/* REFERENCES */}
          <Section>
            <SectionHeadingLink to="/references/">
              <UiText id="LandingPage.references.title" />
            </SectionHeadingLink>
            <SectionDescription>
              <UiText id="LandingPage.references.description" />
            </SectionDescription>
            <SectionLinks>
              <SectionLink to="/references/api/">
                <UiText id="LandingPage.references.api" />
              </SectionLink>
              <SectionLink to="/references/js-sdk/">
                <UiText id="LandingPage.references.sdk" />
              </SectionLink>
              <SectionLink to="/references/ftw/">
                <UiText id="LandingPage.references.ftw" />
              </SectionLink>
              <SectionLink to="/references/">
                <UiText id="LandingPage.references.all" /> (
                {articleCounts.references || 0})
              </SectionLink>
            </SectionLinks>
          </Section>

          {/* BACKGROUND */}
          <Section>
            <SectionHeadingLink to="/background/">
              <UiText id="LandingPage.background.title" />
            </SectionHeadingLink>
            <SectionDescription>
              <UiText id="LandingPage.background.description" />
            </SectionDescription>
            <SectionLinks>
              <SectionLink to="/background/overview/">
                <UiText id="LandingPage.background.overview" />
              </SectionLink>
              <SectionLink to="/background/concepts/">
                <UiText id="LandingPage.background.concepts" />
              </SectionLink>
              <SectionLink to="/background/development-skills//">
                <UiText id="LandingPage.background.developmentSkills" />
              </SectionLink>
              <SectionLink to="/background/">
                <UiText id="LandingPage.background.all" /> (
                {articleCounts.background || 0})
              </SectionLink>
            </SectionLinks>
          </Section>
        </Grid>
        <Paragraph>
          <UiText id="LandingPage.outro" />{' '}
          <A href="https://sharetribe.typeform.com/to/CMiqus">
            <UiText id="LandingPage.outroLink" />
          </A>
        </Paragraph>
      </Content>
    </MainLayout>
  );
};

export default LandingPage;
