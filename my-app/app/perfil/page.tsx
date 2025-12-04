"use client";

import { useState } from "react";
import useBalance from "@/hooks/useBalance";

export default function PerfilPage() {
  const savedWallet = typeof window !== "undefined" ? localStorage.getItem("wallet_address") : null;
  const [wallet] = useState<string | null>(savedWallet);

  const { balance, loading, error, wrongNetwork, refresh, switchToSepolia } = useBalance(wallet);

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
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Saldo (Sepolia):</p>
            <button
              onClick={refresh}
              disabled={loading}
              className="text-xs text-green-400 hover:text-green-300 disabled:text-gray-500"
            >
              {loading ? "⟳ Atualizando..." : "↻ Atualizar"}
            </button>
          </div>
          {error ? (
            <div>
              <p className="text-red-400 text-sm mb-3">{error}</p>
              {wrongNetwork && (
                <button
                  onClick={switchToSepolia}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
                >
                  🔄 Trocar para Sepolia
                </button>
              )}
            </div>
          ) : (
            <p className="text-2xl font-bold text-green-400 mt-1">
              {balance !== null ? `${balance} ETH` : "Carregando..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
