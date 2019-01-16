// Components that don't import other components from this
// index. These should not create any circular dependencies.
export { H1, H2, H3, H4, H5, H6 } from './headings';
export { default as P } from './P';
export { default as Strong } from './Strong';
export { default as Em } from './Em';
export { default as Hr } from './Hr';
export { default as Ul } from './Ul';
export { default as Ol } from './Ol';
export { default as Li } from './Li';
export { default as A } from './A';
export { default as Link } from './Link';
export { default as Ingress } from './Ingress';
export { default as Footer } from './Footer';
export { default as SecondaryBox } from './SecondaryBox';
export { default as Breadcrumb } from './Breadcrumb';
export { default as UiText } from './UiText';
export { default as GlobalStyle } from './GlobalStyle';
export { default as BaselineDevGrid } from './BaselineDevGrid';

// Components that import other components from this index. These
// might create circular dependencies. Changing the order of these
// exports solves those problems.
//
// See the gatsby-node.js file to enable a Webpack plugin that warns
// about circular dependencies to aid in finding problematic
// dependencies.
export { default as BaseLayout } from './BaseLayout';
export { default as MainLayout } from './MainLayout';
export { default as Topbar } from './Topbar/Topbar';
export {
  default as ArticleIndexPage,
} from './ArticleIndexPage/ArticleIndexPage';
export { default as ArticlePage } from './ArticlePage/ArticlePage';
export { default as LandingPage } from './LandingPage/LandingPage';
export { default as NotFoundPage } from './NotFoundPage';
export {
  default as ThanksForTheFeedbackPage,
} from './ThanksForTheFeedbackPage';
export { default as Root } from './Root';
