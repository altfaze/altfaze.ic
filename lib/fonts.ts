import {
    JetBrains_Mono as FontMono,
    Inter as FontSans,
    Libre_Bodoni as FontDisplay,
  } from "next/font/google";
  
  export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
  });
  
  export const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
  });

  export const fontDisplay = FontDisplay({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["400", "700"],
  });