"use client";

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import contractInfo from "../../../contract-info.json";

// Endereço do contrato ERC-1155 na Sepolia
const CONTRACT_ADDRESS = contractInfo.address;
console.log(CONTRACT_ADDRESS);

// IDs das figurinhas (1 a 20)
const STICKERS = Array.from({ length: 20 }, (_, i) => i + 1);

// ABI mínima do ERC-1155
const abi = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
];

interface Metadata {
  name: string;
  team: string;
  image: string; // caminho da imagem
}

export default function ColecaoPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balances, setBalances] = useState<{ [key: number]: number }>({});
  const [metadata, setMetadata] = useState<{ [key: number]: Metadata }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("wallet_address");
    if (!saved) return;

    setWallet(saved);
    loadBalances(saved);
    loadMetadata();
  }, []);

  // ---- CARREGAR METADADOS DO FRONT (public/metadata/) ----
  const loadMetadata = async () => {
    const meta: { [key: number]: Metadata } = {};

    for (const id of STICKERS) {
      const res = await fetch(`/metadata/id_${id}.json`);
      const json = await res.json();

      meta[id] = {
        name: json.name,
        team: json.time,
        image: json.image,
      };
    }

    setMetadata(meta);
  };

  // ---- CONSULTA À BLOCKCHAIN ----
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

  // ---- UI ----
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
        <p className="text-center text-gray-300 text-lg">
          Carregando coleção...
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {STICKERS.map((id) => {
            const amount = balances[id] ?? 0;
            const data = metadata[id];

            if (!data) return null;

            return (
              <div key={id} className="flex flex-col items-center">
                {/* FIGURINHA ESTILO PANINI */}
                <div className="relative bg-white border-4 border-white rounded-xl shadow-xl p-2 flex flex-col w-full">
                  <div className="border-4 border-yellow-500 rounded-lg p-1 bg-black/10 flex flex-col">
                    {/* LOGO DA COPA */}
                    <img
                      src="/icons/worldcup.png"
                      className="absolute top-3 right-4 w-6 h-6"
                      alt="World Cup Logo"
                    />

                    {/* TIME */}
                    <div className="text-center text-xs font-semibold text-gray-700 mb-2">
                      {data.team}
                    </div>

                    {/* FOTO */}
                    <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={data.image}
                        alt={data.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* NOME + BANDEIRA */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <img
                          src="/icons/brazil.png"
                          className="w-5 h-5"
                          alt="Flag"
                        />
                        <span className="text-xs font-bold text-green-800">
                          BRA
                        </span>
                      </div>

                      <span className="text-xs font-bold text-gray-700">
                        {data.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QUANTIDADE FORA DO CARD — COM CÍRCULO */}
                <div className="mt-3 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">
                      {amount}x
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
