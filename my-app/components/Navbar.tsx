"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const router = useRouter();

  // Carregar sessão salva no localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wallet_address");
    if (saved) setAddress(saved);
  }, []);

  // Conectar carteira
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        localStorage.setItem("wallet_address", accounts[0]);
      }
    } catch (err) {
      console.error("Erro ao conectar carteira:", err);
    }
    
    router.push("/perfil"); 
  }

  // Desconectar carteira
  function disconnectWallet() {
    localStorage.removeItem("wallet_address");
    setAddress(null);
  }

  const logged = !!address;

  return (
    <nav className="w-full bg-white border-b border-green-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-green-700 drop-shadow-sm hover:opacity-80 transition"
        >
          Figurinhas ⚽
        </Link>

        {/* Navegação */}
        <div className="hidden md:flex items-center gap-8">
          {/* Quando NÃO estiver logado */}
          {!logged && (
            <>
              <Link href="/" className="text-green-700 font-medium hover:text-green-900 transition">
                Início
              </Link>

              <Link href="/contato" className="text-green-700 font-medium hover:text-green-900 transition">
                Contato
              </Link>
            </>
          )}

          {/* Quando ESTIVER logado */}
          {logged && (
            <>
              <Link
                href="/perfil"
                className="text-green-700 font-medium hover:text-green-900 transition"
              >
                Perfil
              </Link>

              <Link
                href="/loja"
                className="text-green-700 font-medium hover:text-green-900 transition"
              >
                Loja
              </Link>

              <Link
                href="/colecao"
                className="text-green-700 font-medium hover:text-green-900 transition"
              >
                Minhas Figurinhas
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

        {/* Botão de Login / Logout */}
        {!logged ? (
          <button
            onClick={connectWallet}
            className="hidden md:inline px-5 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
          >
            Conectar Carteira
          </button>
        ) : (
          <button
            onClick={disconnectWallet}
            className="hidden md:inline px-5 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
          >
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}
