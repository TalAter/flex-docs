import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle, fonts, BaselineDevGrid } from '../brand-components';
import { themeLight as theme } from '../config';

const fontsInUse = ['CircularStd-Book', 'CircularStd-Bold'];

const FontPreloadLink = font => {
  const { name, format, url } = font;
  return (
    <link
      key={name}
      rel="preload"
      as="font"
      crossorigin="crossorigin"
      type={`font/${format}`}
      href={url}
    />
  );
};

const BaseLayout = props => {
  const { title, description, noIndex, children } = props;
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => {
        const siteTitle = data.site.siteMetadata.title;
        const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
        const meta = [];

        // https://moz.com/learn/seo/meta-description
        if (description) {
          meta.push({ name: 'description', content: description });
        }

        // https://developers.google.com/search/reference/robots_meta_tag
        // https://moz.com/learn/seo/robots-meta-directives
        if (noIndex) {
          meta.push({ name: 'robots', content: 'noindex' });
        }

        return (
          <ThemeProvider theme={theme}>
            <>
              <Helmet title={pageTitle} meta={meta}>
                <html lang="en" />
                {fonts
                  .filter(f => fontsInUse.includes(f.name))
                  .map(FontPreloadLink)}
              </Helmet>
              <BaselineDevGrid>{children}</BaselineDevGrid>
              <GlobalStyle fontNames={fontsInUse} />
            </>
          </ThemeProvider>
        );
      }}
    />
  );
};

export default BaseLayout;
