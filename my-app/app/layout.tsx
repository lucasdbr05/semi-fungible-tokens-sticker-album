import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Meu App Ethereum",
  description: "Aplicação da disciplina",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
