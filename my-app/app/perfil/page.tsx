"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function PerfilPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet_address");

    if (!savedWallet) return;

    setWallet(savedWallet);

    // Buscar saldo da carteira
    const loadBalance = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);

        const rawBalance = await provider.getBalance(savedWallet);
        const ethBalance = ethers.formatEther(rawBalance);

        setBalance(Number(ethBalance).toFixed(4)); // ex.: 0.1234 ETH
      }
    };

    loadBalance();
  }, []);

  if (!wallet) {
    return (
      <div className="text-center mt-24 text-xl text-gray-300">
        Nenhum usuário logado.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-gray-900 border border-green-500 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
        Meu Perfil
      </h1>

      <div className="space-y-4 text-gray-300">
        
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Endereço da carteira:</p>
          <p className="font-mono break-all text-green-300 mt-1">{wallet}</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Saldo:</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {balance ? `${balance} ETH` : "Carregando..."}
          </p>
        </div>
      </div>
    </div>
  );
}
