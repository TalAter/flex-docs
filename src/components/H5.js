import styled, { css } from 'styled-components';

import fonts from '../fonts';
import { baselineBreakpoint } from '../config';

const h5Styles = css`
  // Reset default styles
  margin: 0;

  // Font
  ${fonts['CircularStd-Bold'].styles}

  // Enable baseline offset
  position: relative;

  // Color
  color: ${props => props.theme.headingColor};

  font-size: 20px;
  line-height: 36px;
  letter-spacing: -0.33px;

  // Offset baseline
  top: -1px;

  @media (min-width: ${baselineBreakpoint}px) {
    font-size: 24px;
    line-height: 32px;
    letter-spacing: -0.2px;

    // Offset baseline
    top: -1px;
  }
`;

const H5 = styled.h5`
  ${h5Styles}
`;
H5.styles = h5Styles;

export default H5;