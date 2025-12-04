"use client";
import { useUserTokens } from "@/hooks/useTokenBalance";
import { useState } from "react";

export default function Inventory() {
  const savedWallet =
    typeof window !== "undefined"
      ? localStorage.getItem("wallet_address")
      : null;
  const [wallet] = useState<string | null>(savedWallet);

  const { tokens, loading, error } = useUserTokens({
    userAddress: wallet,
    contractAddress: "0x7a6153E88838843a65dF29860Eb4EDe77d204351",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {tokens.length === 0 ? (
        <p>No tokens found.</p>
      ) : (
        tokens.map((t) => (
          <div key={t.tokenId}>
            <p>Token ID: {t.tokenId}</p>
            <p>Balance: {t.balance}</p>
            {/* {t.media[0]?.gateway && (
              <img
                src={t.media[0].gateway}
                width={100}
                alt={`Token ${t.tokenId}`}
              />
            )} */}
          </div>
        ))
      )}
    </div>
  );
}
