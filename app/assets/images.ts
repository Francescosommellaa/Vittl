// ============================================
// VITTL - Central Image Configuration
// ============================================
// Importa SEMPRE da qui, non hardcodare i path

export const images = {
  logo: {
    // Su sfondo bianco/chiaro → usa dark
    dark: "/logo/svg/logo-dark.svg",
    darkPng: "/logo/logo-dark.png",

    // Su sfondo nero/scuro → usa white
    white: "/logo/svg/logo-white.svg",
    whitePng: "/logo/logo-white.png",
  },

  icon: {
    // Su sfondo bianco/chiaro
    dark: "/icona/svg/icon-dark.svg",
    darkPng: "/icona/icon-dark.png",

    // Su sfondo nero/scuro
    white: "/icona/svg/icon-white.svg",
    whitePng: "/icona/icon-white.png",

    // Con sfondo incluso
    darkOnWhite: "/icona/svg/icon-dark-white-bg.svg",
    whiteOnDark: "/icona/svg/icon-white-dark-bg.svg",
  },
} as const;

// ─── COME USARE ─────────────────────────────
//
// import { images } from "@/app/assets/images"
// import Image from "next/image"
//
// Su sfondo bianco:
// <Image src={images.logo.dark} alt="Vittl" width={80} height={28} />
//
// Su sfondo nero (es. CTA section, footer dark):
// <Image src={images.logo.white} alt="Vittl" width={80} height={28} />
