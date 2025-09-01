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
    font-family: var(--font-body);
  background-color: var(--color-beige-100);
font-size: var(--fs-md);
}
   

  :root {
    --color-green-500: #3B7A57;
    --color-green-300: #74C69D;
    --color-green-700: #2D5D42;
    --color-beige-100: #F5F1E6;
    --color-beige-200: #E9E2D0;
    --color-gray-800: #333333;
    --color-gray-600: #555555;
    --color-white: #FFFFFF;
    --color-yellow-400: #FFD166;
    --color-red-500: #E63946;


    --font-headline:'Playfair Display';
    --font-body:'Nunito';
    --fs-xl: 24px;
    --fs-lg: 20px;
    --fs-md: 16px;
    --fs-sm: 14px;
    --pd-sm: 8px;
    --pd-md: 16px;
    --pd-lg: 24px;
    --pd-xl: 32px;
  }`;
