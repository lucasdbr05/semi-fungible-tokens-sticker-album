"use client";
import { ethers } from "ethers";
import { useState } from "react";

export default function CreateOrder() {
  const [address, setAddress] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  const [order, setOrder] = useState({
    token: "",
    id: "",
    amount: "",
    counterparty: "",
    nonce: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAddress(addr);
  }

  async function signOrder() {
    if (!window.ethereum) return alert("Connect MetaMask first");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const chainId = (await provider.getNetwork()).chainId;

    const domain = {
      name: "ERC1155Swap",
      version: "1",
      chainId: Number(chainId),
      verifyingContract: "0xYourSwapContractAddressHere",
    };

    const types = {
      Order: [
        { name: "owner", type: "address" },
        { name: "token", type: "address" },
        { name: "id", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "counterparty", type: "address" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const value = {
      owner: address,
      token: order.token,
      id: BigInt(order.id),
      amount: BigInt(order.amount),
      counterparty: order.counterparty,
      nonce: BigInt(order.nonce),
    };

    try {
      const signature = await signer.signTypedData(domain, types, value);
      setSignature(signature);
    } catch (err) {
      console.error(err);
      alert("Failed to sign order.");
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Swap Order (ethers.js)</h1>

      {!address ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="text-sm mb-4">Connected: {address}</p>
      )}

      <div className="space-y-3">
        <input
          name="token"
          placeholder="Token address"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          name="id"
          placeholder="Token ID"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          name="counterparty"
          placeholder="Counterparty address"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          name="nonce"
          placeholder="Nonce"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        onClick={signOrder}
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
      >
        Sign Order
      </button>

      {signature && (
        <div className="mt-6 bg-gray-100 p-4 rounded break-all">
          <h2 className="font-semibold mb-2">Signature:</h2>
          <code>{signature}</code>
        </div>
      )}
    </div>
  );
}
