"use client";

import BuyPackComponent from "@/components/BuyPack";
import useBalance from "@/hooks/useBalance";
import { useState } from "react";
import contractInfo from "../../contract-info.json";

// Substitua pelo endereço do seu contrato após o deploy na Sepolia
const CONTRACT_ADDRESS = contractInfo.address;

// ABI mínima necessária para interagir com o contrato
const CONTRACT_ABI = [
  "function buyPack() external payable",
  "function packPrice() external view returns (uint256)",
  "function stickersPerPack() external view returns (uint256)",
  "event PackPurchased(address indexed buyer, uint256[] tokenIds, uint256 totalPaid)",
];

export default function LojaPage() {
  const savedWallet =
    typeof window !== "undefined"
      ? localStorage.getItem("wallet_address")
      : null;
  const [wallet] = useState<string | null>(savedWallet);
  const { balance, error, wrongNetwork, refresh, switchToSepolia } =
    useBalance(wallet);
  const [purchasedStickers, setPurchasedStickers] = useState<string[]>([]);

  const handleSuccess = (tokenIds: string[]) => {
    setPurchasedStickers((prev) => [...prev, ...tokenIds]);
    refresh(); // Atualizar saldo após compra
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="max-w-4xl mx-auto text-center mt-20">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Sticker Store
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect your wallet to buy stickers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Sticker Store ⚽
        </h1>

        {/* Informações da Carteira */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Wallet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Address:</p>
              <p className="font-mono text-sm text-gray-800 break-all">
                {wallet}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance (Sepolia):</p>
              {error && wrongNetwork ? (
                <div>
                  <p className="text-red-600 text-sm mb-2">{error}</p>
                  <button
                    onClick={switchToSepolia}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    🔄 Switch to Sepolia
                  </button>
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {balance !== null ? `${balance} ETH` : "Loading..."}
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
              Stickers Purchased in This Session
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
        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📝 How to Use:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-900">
            <li>
              Make sure you are connected to the <strong>Sepolia</strong>{" "}
              network on MetaMask
            </li>
            <li>
              Have enough ETH balance on Sepolia (you can get test ETH from
              faucets)
            </li>
            <li>Click "Buy Pack" to acquire 5 random stickers</li>
            <li>Confirm the transaction on MetaMask</li>
            <li>Wait for the transaction confirmation on the blockchain</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Important:</strong> You need to replace the contract
              address in the code (file{" "}
              <code className="bg-yellow-200 px-1 rounded">
                app/loja/page.tsx
              </code>
              ) after deploying the smart contract on the Sepolia network.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
