"use client";

import { useState } from "react";
import BuyPackComponent from "@/components/BuyPack";
import useBalance from "@/hooks/useBalance";

// Substitua pelo endereço do seu contrato após o deploy na Sepolia
const CONTRACT_ADDRESS = "0x7a6153E88838843a65dF29860Eb4EDe77d204351";

// ABI mínima necessária para interagir com o contrato
const CONTRACT_ABI = [
  "function buyPack() external payable",
  "function packPrice() external view returns (uint256)",
  "function stickersPerPack() external view returns (uint256)",
  "event PackPurchased(address indexed buyer, uint256[] tokenIds, uint256 totalPaid)"
];

export default function LojaPage() {
  const savedWallet = typeof window !== "undefined" ? localStorage.getItem("wallet_address") : null;
  const [wallet] = useState<string | null>(savedWallet);
  const { balance, error, wrongNetwork, refresh, switchToSepolia } = useBalance(wallet);
  const [purchasedStickers, setPurchasedStickers] = useState<string[]>([]);

  const handleSuccess = (tokenIds: string[]) => {
    setPurchasedStickers(prev => [...prev, ...tokenIds]);
    refresh(); // Atualizar saldo após compra
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="max-w-4xl mx-auto text-center mt-20">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Loja de Figurinhas</h1>
          <p className="text-xl text-gray-600 mb-8">
            Conecte sua carteira para comprar figurinhas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Loja de Figurinhas ⚽
        </h1>

        {/* Informações da Carteira */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sua Carteira</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Endereço:</p>
              <p className="font-mono text-sm text-gray-800 break-all">{wallet}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo (Sepolia):</p>
              {error && wrongNetwork ? (
                <div>
                  <p className="text-red-600 text-sm mb-2">{error}</p>
                  <button
                    onClick={switchToSepolia}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    🔄 Trocar para Sepolia
                  </button>
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {balance !== null ? `${balance} ETH` : "Carregando..."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Componente de Compra */}
        <div className="flex justify-center mb-8">
          <BuyPackComponent
            contractAddress={CONTRACT_ADDRESS}
            contractABI={CONTRACT_ABI}
            onSuccess={handleSuccess}
          />
        </div>

        {/* Figurinhas Compradas */}
        {purchasedStickers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Figurinhas Compradas Nesta Sessão
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {purchasedStickers.map((id, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-center shadow-md"
                >
                  <p className="text-white font-bold text-xl">#{id}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📝 Como Usar:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-900">
            <li>Certifique-se de estar conectado à rede <strong>Sepolia</strong> no MetaMask</li>
            <li>Tenha saldo suficiente de ETH na Sepolia (você pode obter ETH de teste em faucets)</li>
            <li>Clique em "Comprar Pacote" para adquirir 5 figurinhas aleatórias</li>
            <li>Confirme a transação no MetaMask</li>
            <li>Aguarde a confirmação da transação na blockchain</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Importante:</strong> Você precisa substituir o endereço do contrato no código
              (arquivo <code className="bg-yellow-200 px-1 rounded">app/loja/page.tsx</code>) 
              após fazer o deploy do smart contract na rede Sepolia.
            </p>
          </div>
        </div>

        {/* Links Úteis */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🔗 Links Úteis:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <a
                href="https://sepoliafaucet.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                → Sepolia Faucet (obter ETH de teste)
              </a>
            </li>
            <li>
              <a
                href="https://sepolia.etherscan.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                → Sepolia Etherscan (explorador de blocos)
              </a>
            </li>
            <li>
              <a
                href="https://chainlist.org/chain/11155111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                → Adicionar Sepolia ao MetaMask
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
