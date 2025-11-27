"use client";

import Link from "next/link";
import useWallet from "../hooks/useWallet";

export default function Navbar() {
  const { address, isLogged, connectWallet, disconnectWallet } = useWallet();

  return (
    <nav className="w-full bg-white border-b border-green-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link
          href="/"
          className="text-2xl font-extrabold text-green-700 hover:opacity-80 transition"
        >
          Figurinhas ⚽
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-green-700 font-medium hover:text-green-900 transition"
          >
            Início
          </Link>

          <Link
            href="/contato"
            className="text-green-700 font-medium hover:text-green-900 transition"
          >
            Contato
          </Link>

          {/* Apenas quando logado */}
          {isLogged && (
            <>
              <Link
                href="/colecao"
                className="text-green-700 font-medium hover:text-green-900 transition"
              >
                Minha Coleção
              </Link>

              <Link
                href="/trocas"
                className="text-green-700 font-medium hover:text-green-900 transition"
              >
                Trocas
              </Link>
            </>
          )}
        </div>

        {/* Botão de Login Web3 */}
        {!isLogged ? (
          <button
            onClick={connectWallet}
            className="hidden md:inline px-5 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
          >
            Conectar Carteira
          </button>
        ) : (
          <button
            onClick={disconnectWallet}
            className="hidden md:inline px-5 py-2 bg-green-700 text-white rounded-full shadow hover:bg-green-800 transition"
          >
            {address.slice(0, 6)}...{address.slice(-4)}
          </button>
        )}
      </div>
    </nav>
  );
}
