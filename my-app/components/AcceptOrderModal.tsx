"use client";

import { ensureApproval } from "@/app/util/getApproval";
import { ethers } from "ethers";
import { useState } from "react";

const abi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "maker", type: "address" },
          { internalType: "address", name: "tokenGive", type: "address" },
          { internalType: "uint256[]", name: "tokenIdGive", type: "uint256[]" },
          { internalType: "uint256[]", name: "amountGive", type: "uint256[]" },
          { internalType: "address", name: "tokenWant", type: "address" },
          { internalType: "uint256[]", name: "tokenIdWant", type: "uint256[]" },
          { internalType: "uint256[]", name: "amountWant", type: "uint256[]" },
          { internalType: "address", name: "taker", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        internalType: "struct ERC1155SignedSwap.Order",
        name: "order",
        type: "tuple",
      },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "executeOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "maker",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "taker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenGive",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "tokenIdGive",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountGive",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenWant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "tokenIdWant",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountWant",
        type: "uint256[]",
      },
    ],
    name: "OrderExecuted",
    type: "event",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: any; // order object from Firestore
  signature: string; // order.signature
  albumAddress: string; // ERC1155 token contract
  swapAddress: string; // your ERC1155SignedSwap contract
  userWallet: string; // taker wallet
}

export default function AcceptOrderModal({
  isOpen,
  onClose,
  order,
  signature,
  albumAddress,
  swapAddress,
  userWallet,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleAccept() {
    try {
      setLoading(true);

      // 1️⃣ Check approval (for taker)
      await ensureApproval(albumAddress, userWallet, swapAddress);

      // 2️⃣ Execute order
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const swap = new ethers.Contract(swapAddress, abi, signer);

      // ⚙️ Build proper struct for the contract call
      const tx = await swap.executeOrder(
        {
          maker: order.maker,
          tokenGive: order.tokenGive,
          tokenIdGive: order.tokenIdGive.map((n: number) => BigInt(n)),
          amountGive: order.amountGive.map((n: number) => BigInt(n)),
          tokenWant: order.tokenWant,
          tokenIdWant: order.tokenIdWant.map((n: number) => BigInt(n)),
          amountWant: order.amountWant.map((n: number) => BigInt(n)),
          taker: order.taker,
          nonce: BigInt(order.nonce),
          deadline: BigInt(order.deadline),
        },
        signature
      );

      console.log("⏳ Transaction sent:", tx.hash);
      await tx.wait();
      console.log("✅ Swap executed!");

      alert("Troca executada com sucesso!");
      onClose();
    } catch (err: any) {
      console.error("❌ Error executing order:", err);
      if (err.code === 4001) {
        alert("Operação cancelada pelo usuário.");
      } else {
        alert("Falha ao executar a troca. Verifique permissões e saldo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Aceitar Troca
        </h2>

        <p className="text-gray-600 mb-4 text-center">
          Você está prestes a trocar suas figurinhas:
        </p>

        <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm text-black">
          <p>
            <b>Você dará as figurinhas de id:</b> {order.tokenIdWant.join(", ")}{" "}
            (quantidades {order.amountWant.join(", ")})
          </p>
          <p>
            <b>Você receberá as figurinhas de id:</b>{" "}
            {order.tokenIdGive.join(", ")} (quantidades{" "}
            {order.amountGive.join(", ")})
          </p>
          <p>signature: {signature}</p>
        </div>

        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-xl p-3 mb-2"
        >
          {loading ? "Executando..." : "Confirmar Troca"}
        </button>

        <button onClick={onClose} className="w-full bg-gray-200 p-3 rounded-xl">
          Cancelar
        </button>
      </div>
    </div>
  );
}
