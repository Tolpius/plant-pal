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
    --radius-md: 10px;
    --radius-sm: 5px;

    --font-primary: 'Playfair Display';
    --font-secondary: 'Nunito';

    --font-size-xl: 24px;
    --font-size-lg: 20px;
    --font-size-md: 16px;
    --font-size-sm: 14px;

    --padding-small: 8px ;
    --padding-medium: 16px ;
    --padding-large: 24px ;
    --padding-extra-large: 32px ;


     --radius: 0.65rem;
   --background: oklch(1 0 0);
   --foreground: oklch(0.141 0.005 285.823);
   --card: oklch(1 0 0);
   --card-foreground: oklch(0.141 0.005 285.823);
   --popover: oklch(1 0 0);
   --popover-foreground: oklch(0.141 0.005 285.823);
   --primary: oklch(0.723 0.219 149.579);
   --primary-foreground: oklch(0.982 0.018 155.826);
   --secondary: oklch(0.967 0.001 286.375);
   --secondary-foreground: oklch(0.21 0.006 285.885);
   --muted: oklch(0.967 0.001 286.375);
   --muted-foreground: oklch(0.552 0.016 285.938);
   --accent: oklch(0.967 0.001 286.375);
   --accent-foreground: oklch(0.21 0.006 285.885);
   --destructive: oklch(0.577 0.245 27.325);
   --border: oklch(0.92 0.004 286.32);
   --input: oklch(0.92 0.004 286.32);
   --ring: oklch(0.723 0.219 149.579);
   --chart-1: oklch(0.646 0.222 41.116);
   --chart-2: oklch(0.6 0.118 184.704);
   --chart-3: oklch(0.398 0.07 227.392);
   --chart-4: oklch(0.828 0.189 84.429);
   --chart-5: oklch(0.769 0.188 70.08);
   --sidebar: oklch(0.985 0 0);
   --sidebar-foreground: oklch(0.141 0.005 285.823);
   --sidebar-primary: oklch(0.723 0.219 149.579);
   --sidebar-primary-foreground: oklch(0.982 0.018 155.826);
   --sidebar-accent: oklch(0.967 0.001 286.375);
   --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
   --sidebar-border: oklch(0.92 0.004 286.32);
   --sidebar-ring: oklch(0.723 0.219 149.579);
  }`;
