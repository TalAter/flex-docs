import React from 'react';
import styled from 'styled-components';

import { baselineBreakpoint, baselineSmall, baselineLarge } from '../../config';
import {
  Ingress,
  H1,
  H6,
  MainLayout,
  Breadcrumb,
  Box,
  UiText,
} from '../../components';
import LastUpdated from './LastUpdated';
import InfoSection from './InfoSection';
import MarkdownHtml from './MarkdownHtml';
import Toc from './Toc';
import ArticleToc from './ArticleToc';

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const articleContentMaxWidth = 884;
const sideColumnWidth = 277;

const SideColumn = styled.aside`
  display: none;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    display: block;
    width: ${sideColumnWidth}px;
  }
`;

const SideNavigation = styled(Box)`
  // SideColumn is hidden in small viewport

  @media (min-width: ${baselineBreakpoint}px) {
    box-shadow: none;
    position: sticky;
    margin-left: 12px;
    margin-top: ${6 * baselineLarge}px;
    margin-bottom: ${4 * baselineLarge}px;
    top: ${2 * baselineLarge}px;
    padding-left: 36px;
    padding-right: 36px;
  }

  :hover {
    transform: none;
    box-shadow: none;
  }
`;

const MainColumn = styled.article`
  flex-grow: 1;

  overflow-x: hidden;

  padding-left: ${props => props.theme.contentPaddingSmall}px;
  padding-right: ${props => props.theme.contentPaddingSmall}px;

  max-width: ${props =>
    articleContentMaxWidth + 2 * props.theme.contentPaddingLarge}px;

  @media (min-width: ${baselineBreakpoint}px) {
    padding-left: ${props => props.theme.contentPaddingLarge}px;
    padding-right: ${props => props.theme.contentPaddingLarge}px;
  }
`;

const CrumbWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${4 * baselineSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    flex-direction: row;
    margin-top: ${9 * baselineLarge}px;
  }
`;

const Updated = styled(LastUpdated)`
  flex-shrink: 0;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${baselineLarge}px;
    margin-left: auto;
    padding-left: 7px;
  }
`;

const Heading = styled(H1)`
  margin-top: ${3 * baselineSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${3 * baselineLarge}px;
  }
`;

const ArticleIngress = styled(Ingress)`
  margin-top: ${2 * baselineSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${3 * baselineLarge}px;
  }
`;

const Info = styled(InfoSection)`
  margin-top: ${1 * baselineSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${1 * baselineLarge}px;
  }
`;

const Markdown = styled(MarkdownHtml)`
  margin-top: ${3 * baselineSmall}px;
  margin-bottom: ${props => props.theme.contentPaddingSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${4 * baselineLarge}px;
    margin-bottom: ${props => props.theme.contentPaddingLarge}px;
  }
`;

const SideToc = styled(Toc)`
  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${2 * baselineLarge}px;
  }
`;

const ContentTocHeader = styled(H6)`
  margin-top: ${3 * baselineSmall}px;

  @media (min-width: ${baselineBreakpoint}px) {
    margin-top: ${4 * baselineLarge}px;
  }
`;
const ArticlePage = props => {
  const { frontmatter, htmlAst, estimatedReadingTime, tableOfContents } = props;
  const { title, slug, updated, category, ingress, toc } = frontmatter;

  // Structured metadata for the article page
  //
  // See: https://developers.google.com/search/docs/data-types/article
  const ldJson = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'TechArticle',
    dateModified: updated,
    headline: title,
    description: ingress,

    // NOTE: image is recommended, but we don't have a way to dig it at the moment
    //
    // image: [
    //   'http://example.com/image.jpg'
    // ]
  });

  return (
    <MainLayout title={title} description={ingress} activeCategory={category}>
      <ColumnLayout>
        <SideColumn>
          <SideNavigation as="nav">
            <H6 as="p">{title}</H6>
            <SideToc
              path={`/${category}/${slug}/`}
              headings={tableOfContents}
              maxDepth={2}
            />
          </SideNavigation>
        </SideColumn>
        <MainColumn>
          <script type="application/ld+json">{ldJson}</script>
          <CrumbWrapper>
            <Breadcrumb
              links={[
                { path: '/', label: 'Docs' },
                {
                  path: `/${category}/`,
                  label: UiText.fn(`ArticlePage.${category}.breadCrumbTitle`),
                },
                { path: `/${category}/${slug}/`, label: title },
              ]}
            />
            <Updated date={updated} />
          </CrumbWrapper>
          <Heading>{title}</Heading>
          <Info
            frontmatter={frontmatter}
            estimatedReadingTime={estimatedReadingTime}
          />
          <ArticleIngress>{ingress}</ArticleIngress>
          {toc ? (
            <>
              <ContentTocHeader as="h2">
                <UiText id="ArticlePage.tableOfContents" />
              </ContentTocHeader>
              <ArticleToc
                path={`/${category}/${slug}/`}
                headings={tableOfContents}
                maxDepth={3}
              />
            </>
          ) : null}
          <Markdown htmlAst={htmlAst} />
        </MainColumn>
      </ColumnLayout>
    </MainLayout>
  );
};

export default ArticlePage;
