import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

// Self-hosted fonts (no build-time network dependency)
const archivo = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../../public/fonts/archivo-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/archivo-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/archivo-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/archivo-700.woff2", weight: "700", style: "normal" },
  ],
})

const archivoBlack = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/archivo-black.woff2",
      weight: "400",
      style: "normal",
    },
  ],
})

const spaceMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "../../public/fonts/space-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/space-mono-700.woff2", weight: "700", style: "normal" },
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "YBA",
    template: "%s | YBA",
  },
  description:
    "YBA. Precision-cut menswear and womenswear essentials. Built for the road.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${archivo.variable} ${archivoBlack.variable} ${spaceMono.variable}`}
    >
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
