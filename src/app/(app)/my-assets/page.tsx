"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, CrossIcon } from "lucide-react";
import Link from "next/link";
import { Address, toHex } from "viem";
import { useIpAsset, useNftClient, PIL_TYPE } from "@story-protocol/react-sdk";
import { ConnectKitButton } from "connectkit";
import { useStory } from "@/lib/context/AppContext";
import { useAccount } from "wagmi";

interface AssetData {
  url: string;
  nftMinted: boolean;
  mintedIP: boolean;
  postedOnZora: boolean;
  tokenId: string;
  ipAssetLink: string;
  zoraLink: string;
}


export default function MyAssets() {
  const { isConnected } = useAccount();
  const { mintNFT, client } = useStory();
  const [assets, setAssets] = useState<AssetData[]>([]);

  useEffect(() => {
    // Simulate fetching data from local storage
    const storedAssets = localStorage.getItem("myAssets");
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
  }, []);

  const handleTest = async () => {
    const response = await client?.ipAsset.register({
      nftContract: "0xd2a4a4Cb40357773b658BECc66A6c165FD9Fc485", // your NFT contract address
      tokenId: "462", // your NFT token ID
      ipMetadata: {
        ipMetadataURI: "test-uri",
        ipMetadataHash: toHex("test-metadata-hash", { size: 32 }),
        nftMetadataHash: toHex("test-nft-metadata-hash", { size: 32 }),
        nftMetadataURI: "test-nft-uri",
      },
      txOptions: { waitForTransaction: true },
    });
    console.log(`Root IPA created at tx hash ${response?.txHash}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

      {/* <Button onClick={handleTest}>Test</Button> */}
      {assets.length === 0 ? (
        <div className="text-center col-span-full mt-40">
          <p className="text-2xl font-semibold text-muted-foreground">No Saved Assets Found</p>
        </div>
      ) : (
        assets.map((asset, index) => (
          <Card key={index} className="w-full max-w-sm mx-auto">
            <CardContent className="p-6">
              <div className="relative mb-4 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <video
                  className="object-cover w-full h-full"
                  src={asset.url}
                  controls
                  preload="metadata"
                />
              </div>
              <div className="space-y-2">
                {asset.nftMinted ? (
                  <>
                    {asset.mintedIP ? (
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={asset.ipAssetLink}>
                          IP already minted
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline">
                        Register IP for Asset
                      </Button>
                    )}
                    {asset.postedOnZora ? (
                      <Button className="w-full" asChild>
                        <Link href={asset.zoraLink}>
                          View Post on Zora
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" disabled={!asset.mintedIP}>
                        Post on Zora
                      </Button>
                    )}
                  </>
                ) : isConnected ? (
                  <Button className="w-full">Mint NFT</Button>
                ) : (
                  <div className="w-full flex justify-center">
                    <ConnectKitButton />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
