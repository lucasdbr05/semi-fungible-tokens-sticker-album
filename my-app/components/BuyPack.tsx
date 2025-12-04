"use client";

import { useState } from "react";
import { ethers } from "ethers";

interface BuyPackProps {
  contractAddress: string;
  contractABI: any[];
  onSuccess?: (tokenIds: string[]) => void;
}

export default function BuyPackComponent({ contractAddress, contractABI, onSuccess }: BuyPackProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const buyPack = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask não detectado");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Verificar se estamos na rede Sepolia
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        throw new Error("Por favor, conecte-se à rede Sepolia no MetaMask");
      }

      // Conectar ao contrato
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Obter preço do pacote
      const packPrice = await contract.packPrice();
      console.log("Preço do pacote:", ethers.formatEther(packPrice), "ETH");

      // Verificar se o usuário tem saldo suficiente
      const balance = await provider.getBalance(await signer.getAddress());
      console.log("Saldo da carteira:", ethers.formatEther(balance), "ETH");

      if (balance < packPrice) {
        throw new Error(`Saldo insuficiente. Você precisa de ${ethers.formatEther(packPrice)} ETH + gas fees`);
      }

      // Comprar pacote
      console.log("Enviando transação buyPack com valor:", ethers.formatEther(packPrice), "ETH");
      const tx = await contract.buyPack({ 
        value: packPrice,
        gasLimit: 500000 // Definir gas limit explícito
      });
      
      console.log("Transação enviada:", tx.hash);
      setSuccess(`Transação enviada! Hash: ${tx.hash.substring(0, 10)}... Aguardando confirmação...`);
      
      const receipt = await tx.wait();
      
      // Extrair IDs das figurinhas do evento
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === "PackPurchased";
        } catch {
          return false;
        }
      });

      let tokenIds: string[] = [];
      if (event) {
        const parsed = contract.interface.parseLog(event);
        tokenIds = parsed?.args.tokenIds.map((id: any) => id.toString()) || [];
      }

      setSuccess(`Pacote comprado com sucesso! Figurinhas: ${tokenIds.join(", ")}`);
      
      if (onSuccess) {
        onSuccess(tokenIds);
      }
    } catch (err) {
      console.error("Erro completo:", err);
      
      let errorMessage = "Erro ao comprar pacote";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Erros específicos do MetaMask/Ethers
        if (errorMessage.includes("user rejected")) {
          errorMessage = "Transação cancelada pelo usuário";
        } else if (errorMessage.includes("insufficient funds")) {
          errorMessage = "Saldo insuficiente para pagar gas fees";
        } else if (errorMessage.includes("CALL_EXCEPTION")) {
          errorMessage = "Erro ao executar contrato. Verifique se o contrato está correto e se você tem ETH suficiente.";
        } else if (errorMessage.includes("No stickers available")) {
          errorMessage = "Não há figurinhas disponíveis no momento";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Comprar Pacote</h2>
      
      <div className="mb-4">
        <p className="text-gray-700">
          Cada pacote contém <span className="font-bold">5 figurinhas aleatórias</span>
        </p>
        <p className="text-2xl font-bold text-green-600 mt-2">
          Preço: 0.001 ETH
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <button
        onClick={buyPack}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        {loading ? "Processando..." : "Comprar Pacote"}
      </button>

      <p className="text-sm text-gray-500 mt-4">
        * Você precisa ter a rede Sepolia configurada no MetaMask
      </p>
    </div>
  );
}
