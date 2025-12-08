"use client";

import { ensureApproval } from "@/app/util/getApproval";
import contractInfo from "@/contract-info.json";
import { ethers } from "ethers";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

interface Props {
  userWallet: string;
  albumAddress: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateOrderModal({
  userWallet,
  albumAddress,
  isOpen,
  onClose,
}: Props) {
  const [maker, setMaker] = useState(userWallet);
  const [tokenGive, setTokenGive] = useState(albumAddress);
  const [tokenIdGive, setTokenIdGive] = useState("");
  const [amountGive, setAmountGive] = useState("");
  const [tokenWant, setTokenWant] = useState(albumAddress);
  const [tokenIdWant, setTokenIdWant] = useState("");
  const [amountWant, setAmountWant] = useState("");
  const [taker, setTaker] = useState("");
  const [deadline, setDeadline] = useState("");

  if (!isOpen) return null;

  async function signOrder(order: any, contractAddress: string) {
    if (!window.ethereum) throw new Error("MetaMask não encontrada");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    // 🏷️ EIP-712 domain (igual ao do contrato)
    const domain = {
      name: "ERC1155SignedSwap",
      version: "1",
      chainId: Number(network.chainId),
      verifyingContract: contractAddress,
    };

    // 🧱 Deve refletir EXATAMENTE o struct Order do contrato
    const types = {
      Order: [
        { name: "maker", type: "address" },
        { name: "tokenGive", type: "address" },
        { name: "tokenIdGive", type: "uint256[]" },
        { name: "amountGive", type: "uint256[]" },
        { name: "tokenWant", type: "address" },
        { name: "tokenIdWant", type: "uint256[]" },
        { name: "amountWant", type: "uint256[]" },
        { name: "taker", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    // 🧩 Agora os arrays são passados diretamente
    const value = {
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
    };

    // 🔏 Assina os dados tipados
    return signer.signTypedData(domain, types, value);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const newOrder = {
      maker,
      tokenGive,
      tokenIdGive: tokenIdGive.split(",").map(Number),
      amountGive: amountGive.split(",").map(Number),
      tokenWant,
      tokenIdWant: tokenIdWant.split(",").map(Number),
      amountWant: amountWant.split(",").map(Number),
      taker: taker || "0x0000000000000000000000000000000000000000",
      nonce: Math.floor(Math.random() * 1e18),
      deadline: new Date(deadline).getTime(), // timestamp em segundos
      createdAt: serverTimestamp(),
    };

    try {
      // 🔏 gerar assinatura EIP-712
      alert("É necessário fornecer permissão e assinar");
      await ensureApproval(albumAddress, userWallet, contractInfo.swap_address);
      const signature = await signOrder(newOrder, contractInfo.swap_address);

      console.log(newOrder);
      console.log(signature);

      // 💾 salvar no Firestore
      await addDoc(collection(db, "orders"), {
        ...newOrder,
        signature,
      });

      onClose();
    } catch (err) {
      console.error("Erro ao criar ou assinar ordem:", err);
      alert(
        "Falha ao assinar a ordem. Verifique se a carteira está conectada."
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Criar Nova Order
        </h2>

        <div className="space-y-3">
          
          <input
            className="input"
            placeholder="TokenId Give (ex: 1,3,5)"
            value={tokenIdGive}
            onChange={(e) => setTokenIdGive(e.target.value)}
          />

          <input
            className="input"
            placeholder="Amounts Give (ex: 1,1,2)"
            value={amountGive}
            onChange={(e) => setAmountGive(e.target.value)}
          />

          

          <input
            className="input"
            placeholder="TokenId Want (ex: 2,4)"
            value={tokenIdWant}
            onChange={(e) => setTokenIdWant(e.target.value)}
          />

          <input
            className="input"
            placeholder="Amounts Want (ex: 1,2)"
            value={amountWant}
            onChange={(e) => setAmountWant(e.target.value)}
          />

          <input
            className="input"
            placeholder="Taker (opcional)"
            value={taker}
            onChange={(e) => setTaker(e.target.value)}
          />

          <input
            type="datetime-local"
            className="input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button className="w-full bg-green-600 text-white rounded-xl p-3">
            Criar Order
          </button>

          <button
            type="button"
            className="w-full bg-gray-200 p-3 rounded-xl"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
