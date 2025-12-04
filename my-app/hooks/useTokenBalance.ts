import { Alchemy, Network, OwnedNft } from "alchemy-sdk";
import { useEffect, useState } from "react";

interface UseUserTokensProps {
  userAddress: string | null;
  contractAddress: string;
}

export function useUserTokens({
  userAddress,
  contractAddress,
}: UseUserTokensProps) {
  const [tokens, setTokens] = useState<OwnedNft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userAddress || !contractAddress) return;

    const fetchTokens = async () => {
      setLoading(true);
      setError(null);
      try {
        const alchemy = new Alchemy({
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
          network: Network.ETH_SEPOLIA,
        });

        const response = await alchemy.nft.getNftsForOwner(userAddress, {
          contractAddresses: [contractAddress],
        });

        setTokens(response.ownedNfts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [userAddress, contractAddress]);

  return { tokens, loading, error };
}
