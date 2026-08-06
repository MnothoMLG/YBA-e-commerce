import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Archivo, Archivo_Black, Space_Mono } from "next/font/google"
import "styles/globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
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
