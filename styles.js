import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }

  body {
    margin: 0;
    font-family: var(--font-secondary);
    background-color: var(--color-secondary);
    font-size: var(--font-size-md);
}
   
  :root {
    --color-primary: #3B7A57;
    --color-primary-light: #74C69D;
    --color-primary-dark: #2D5D42;

    --color-secondary: #F5F1E6;
    --color-secondary-dark: #E9E2D0;

    --color-white: #FFFFFF;
    --color-black: #000000ff;

    --color-neutral-dark: #333333;
    --color-neutral-medium: #bfbfbfff;
    --color-neutral-light: #e3e3e3ff;

    --color-text-white: #FFFFFF;
    --color-text-dark: #333333;
    --color-text-medium: #555555;
    
    --color-light-grey: #ccc;

    --color-accent: #FFD166;
    --color-alert: #ff0015ff;
    
    --radius-lg: 25px;
    --radius-bg-md: 15px;
    --radius-md: 10px;
    --radius-sm: 5px;

    --border-sm-dark: 1px black solid;

    --font-primary: 'Playfair Display';
    --font-secondary: 'Nunito';

    --font-size-xl: 24px;
    --font-size-lg: 20px;
    --font-size-md: 16px;
    --font-size-sm: 14px;

    --box-shadow-md: 5px 5px 15px black;

    --padding-small: 8px ;
    --padding-bg-sm: 10px;
    --padding-medium: 16px ;
    --padding-bg-md: 20px;
    --padding-large: 24px ;
    --padding-extra-large: 32px ;
  }`;
