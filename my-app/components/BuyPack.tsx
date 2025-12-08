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
        throw new Error("MetaMask not detected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Check if we are on Sepolia network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        throw new Error("Please connect to the Sepolia network on MetaMask");
      }

      // Connect to contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Get pack price
      const packPrice = await contract.packPrice();
      console.log("Pack price:", ethers.formatEther(packPrice), "ETH");

      // Check if user has enough balance
      const balance = await provider.getBalance(await signer.getAddress());
      console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

      if (balance < packPrice) {
        throw new Error(`Insufficient balance. You need ${ethers.formatEther(packPrice)} ETH + gas fees`);
      }

      // Buy pack
      console.log("Sending buyPack transaction with value:", ethers.formatEther(packPrice), "ETH");
      const tx = await contract.buyPack({ 
        value: packPrice,
        gasLimit: 500000 // Set explicit gas limit
      });
      
      console.log("Transaction sent:", tx.hash);
      setSuccess(`Transaction sent! Hash: ${tx.hash.substring(0, 10)}... Waiting for confirmation...`);
      
      const receipt = await tx.wait();
      
      // Extract sticker IDs from event
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

      setSuccess(`Pack purchased successfully! Stickers: ${tokenIds.join(", ")}`);
      
      if (onSuccess) {
        onSuccess(tokenIds);
      }
    } catch (err) {
      console.error("Full error:", err);
      
      let errorMessage = "Error buying pack";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Specific MetaMask/Ethers errors
        if (errorMessage.includes("user rejected")) {
          errorMessage = "Transaction cancelled by user";
        } else if (errorMessage.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas fees";
        } else if (errorMessage.includes("CALL_EXCEPTION")) {
          errorMessage = "Error executing contract. Check if the contract is correct and if you have enough ETH.";
        } else if (errorMessage.includes("No stickers available")) {
          errorMessage = "No stickers available at the moment";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Buy Pack</h2>
      
      <div className="mb-4">
        <p className="text-gray-700">
          Each pack contains <span className="font-bold">5 random stickers</span>
        </p>
        <p className="text-2xl font-bold text-green-600 mt-2">
          Price: 0.001 ETH
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
        {loading ? "Processing..." : "Buy Pack"}
      </button>

      <p className="text-sm text-gray-500 mt-4">
        * You need to have the Sepolia network configured in MetaMask
      </p>
    </div>
  );
}