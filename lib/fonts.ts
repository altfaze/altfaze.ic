import {
    JetBrains_Mono as FontMono,
    Inter as FontSans,
    Libre_Bodoni as FontDisplay,
  } from "next/font/google";
  
  export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["400", "500", "600", "700"],
    display: "swap",
  });
  
  export const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "600"],
    display: "swap",
  });

  export const fontDisplay = FontDisplay({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["400", "700"],
    display: "swap",
  });