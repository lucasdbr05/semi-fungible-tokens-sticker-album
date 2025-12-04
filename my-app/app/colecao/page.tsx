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
  const TEAMS = ["Time A", "Time B"];
  const [selectedTeam, setSelectedTeam] = useState("Time A");

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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="max-w-4xl mx-auto text-center mt-20">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Minhas Figurinhas
          </h1>
          <p className="text-xl text-gray-600">
            Conecte sua carteira para visualizar sua coleção
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-green-700 mb-10 text-center">
          Minhas Figurinhas
        </h1>

        {/* Abas dos times */}
        <div className="flex justify-center mb-10 gap-4">
          {TEAMS.map((team) => (
            <button
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={`
                px-6 py-2 rounded-full font-semibold transition shadow
                ${selectedTeam === team
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"}
              `}
            >
              {team}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Carregando coleção...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {STICKERS.map((id) => {
              const amount = balances[id] ?? 0;
              const data = metadata[id];
              if (!data) return null;

              if (data.team !== selectedTeam) return null;

              return (
                <div
                  key={id}
                  className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 border border-gray-200"
                >
                  {/* FIGURINHA ESTILO PANINI */}
                  <div className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm p-2">

                    <div className="border-4 border-yellow-500 rounded-lg p-1 bg-white">

                      {/* LOGO */}
                      <img
                        src="/icons/logo-exatascup.png"
                        className="absolute top-3 right-3 w-6 h-6 opacity-90"
                        alt="World Cup Logo"
                      />

                      {/* TIME */}
                      <div className="text-center text-xs font-semibold text-gray-600 mb-2">
                        {data.team}
                      </div>

                      {/* FOTO */}
                      <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden shadow-sm">
                        <img
                          src={data.image}
                          alt={data.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* NOME + BANDEIRA */}
                      <div className="flex items-center justify-between mt-2 px-1">
                        <div className="flex items-center gap-1">
                          <img src="/icons/brazil.png" className="w-5 h-5" alt="BRA" />
                          <span className="text-xs font-bold text-green-800">BRA</span>
                        </div>

                        <span className="text-xs font-bold text-gray-700">
                          {data.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QUANTIDADE */}
                  <div className="mt-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 shadow-md flex items-center justify-center">
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
    </div>
  );
}
