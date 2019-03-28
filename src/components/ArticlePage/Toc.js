import React from 'react';
import styled from 'styled-components';

import { baselineBreakpoint, baselineLarge } from '../../config';
import { Ul, Li, Link } from '../../components';

// NOTE: custom line height
const TocLi = styled(Li).attrs({
  small: true,
})`
  // Side navigation hidden on small viewport

  @media (min-width: ${baselineBreakpoint}px) {
    line-height: 24px;
    padding-bottom: ${baselineLarge}px;
    font-size: 15px;

    color: ${props => props.theme.linkColor};

    :hover {
      color: ${props => props.theme.linkColorHover};
    }
  }
`;

const TocItem = props => {
  const { path, value, depth, id, ...rest } = props;
  return (
    <TocLi {...rest}>
      <Link neutral to={`${path}#${id}`}>
        {' › '}
        {value}
      </Link>
    </TocLi>
  );
};

const Toc = props => {
  const { path, headings, ...rest } = props;
  const topLevelHeadings = headings.filter(heading => heading.depth < 3);
  if (topLevelHeadings.length === 0) {
    return null;
  }
  return (
    <Ul {...rest}>
      {topLevelHeadings.map(heading => (
        <TocItem key={heading.id} path={path} {...heading} />
      ))}
    </Ul>
  );
};

export default Toc;
