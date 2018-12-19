import React from 'react';
import styled from 'styled-components';

import {
  baselineSmall,
  baselineLarge,
  baselineBreakpoint,
  P,
  A,
} from '../../brand-components';
import { SingleColumnLayout } from '../../layouts';
import { IntroHeading, IntroDescription } from './Intro';
import Grid, {
  GridBox,
  GridHeadingLink,
  GridDescription,
  GridLinks,
  GridLink,
} from './Grid';
import { gridSideMargin } from './gridConfig';

const Block = styled.span`
  display: block;
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
    margin-left: ${props => props.theme.contentPaddingLarge + gridSideMargin}px;
    margin-right: ${props =>
      props.theme.contentPaddingLarge + gridSideMargin}px;

    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.09px;

    // Offset baseline
    top: -2px;
  }
`;

const LandingPage = props => {
  const { articleCounts } = props;
  return (
    <SingleColumnLayout>
      <IntroHeading>
        <Block>Sharetribe Flex</Block>
        <Block>Developer documentation</Block>
      </IntroHeading>
      <IntroDescription>
        Sharetribe Flex is the fastest and most affordable way to set up a
        powerful marketplace platform that is uniquely yours. To see what
        features we are building or planning to build, see the Updates page and
        the Flex Roadmap.
      </IntroDescription>
      <Grid>
        <GridBox>
          <GridHeadingLink to="/tutorials">Tutorials</GridHeadingLink>
          <GridDescription>
            Get started in learning about the product with hands-on tutorials
            for developers.
          </GridDescription>
          <GridLinks>
            <GridLink to="/tutorials/getting-started">Getting Started</GridLink>
            <GridLink to="/tutorials">
              All tutorials ({articleCounts.tutorials})
            </GridLink>
          </GridLinks>
        </GridBox>
        <GridBox>
          <GridHeadingLink to="/guides">How-to Guides</GridHeadingLink>
          <GridDescription>
            Specific step-by-step guides for solving{' '}
          </GridDescription>
          <GridLinks>
            <GridLink to="/guides/how-to">How to...</GridLink>
            <GridLink to="/guides">
              All guides ({articleCounts.guides})
            </GridLink>
          </GridLinks>
        </GridBox>
        <GridBox>
          <GridHeadingLink to="/references">Reference</GridHeadingLink>
          <GridDescription>Technical reference to the tooling.</GridDescription>
          <GridLinks>
            <GridLink to="/references/api">API Reference</GridLink>
            <GridLink to="/references">
              All reference ({articleCounts.references})
            </GridLink>
          </GridLinks>
        </GridBox>
        <GridBox>
          <GridHeadingLink to="/background">Background</GridHeadingLink>
          <GridDescription>
            Explanations and background information for important concepts and
            design decisions behind the product.
          </GridDescription>
          <GridLinks>
            <GridLink to="/background/concepts">Important concepts</GridLink>
            <GridLink to="/background/architecture">
              Sharetribe Flex architecture
            </GridLink>
            <GridLink to="/styleguide">Styleguide</GridLink>
            <GridLink to="/notfoundpage">Not Found Page</GridLink>
            <GridLink to="/background">
              All background articles ({articleCounts.background})
            </GridLink>
          </GridLinks>
        </GridBox>
      </Grid>
      <Paragraph>
        Missing something important? <A href="#">Let us know.</A>
      </Paragraph>
    </SingleColumnLayout>
  );
};

export default LandingPage;
