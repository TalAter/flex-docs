import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
  }
  button {
    border: none;
    cursor: pointer;
    padding: 0;
    background-color: transparent;
  }
`;

export default GlobalStyle;