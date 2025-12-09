import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://fungible-tokens-sticker-album.vercel.app"),

  title: "ExatasCup Sticker Album",
  description: "Trade and collect digital stickers!",
  openGraph: {
    title: "ExatasCup Sticker Album",
    description: "Trade and collect digital stickers!",
    url: "https://fungible-tokens-sticker-album.vercel.app",
    siteName: "ExatasCup Sticker Album",
    images: [
      {
        url: "/icons/logo-exatascup.png",
        alt: "ExatasCup Album Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icons/logo-exatascup.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
