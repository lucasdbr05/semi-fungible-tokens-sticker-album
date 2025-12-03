"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Endereço do contrato ERC-1155 na Sepolia
const CONTRACT_ADDRESS = "0x7a6153E88838843a65dF29860Eb4EDe77d204351";

// IDs das figurinhas (1 a 20)
const STICKERS = Array.from({ length: 20 }, (_, i) => i + 1);

// ABI mínima do ERC-1155
const abi = [
  "function balanceOf(address account, uint256 id) view returns (uint256)"
];

export default function ColecaoPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balances, setBalances] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("wallet_address");
    if (!saved) return;

    setWallet(saved);
    loadBalances(saved);
  }, []);

  const loadBalances = async (userWallet: string) => {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      const results: { [key: number]: number } = {};

      for (const id of STICKERS) {
        const balance = await contract.balanceOf(userWallet, id);
        results[id] = Number(balance);
      }

      setBalances(results);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar figurinhas:", error);
      alert("Erro ao consultar a blockchain.");
    }
  };

  if (!wallet) {
    return (
      <div className="text-center mt-24 text-gray-300 text-xl">
        Nenhum usuário logado.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 px-6">
      <h1 className="text-3xl font-bold text-green-400 mb-8 text-center drop-shadow-lg">
        Minhas Figurinhas
      </h1>

      {loading ? (
        <p className="text-center text-gray-300 text-lg">Carregando coleção...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {STICKERS.map((id) => (
            <div
              key={id}
              className="bg-gray-900 border border-green-500 rounded-xl p-5 shadow-lg hover:shadow-green-500/30 transition"
            >
              {/* Área da imagem da figurinha */}
              <div className="w-full h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 font-medium text-sm">
                  Figurinha #{id}
                </span>
              </div>

              {/* Quantidade */}
              <p className="text-center text-green-300 text-xl font-bold">
                {balances[id]}x
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
