"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, CrossIcon } from "lucide-react";
import Link from "next/link";
import { Address, toHex } from "viem";
import {
  useIpAsset,
  useNftClient,
  PIL_TYPE,
  IpMetadata,
} from "@story-protocol/react-sdk";
import { ConnectKitButton } from "connectkit";
import { useStory } from "@/lib/context/AppContext";
import { useAccount } from "wagmi";
import { uploadJSONToIPFS } from "@/app/actions";
import { createHash } from "crypto";

interface AssetData {
  url: string;
  nftMinted: boolean;
  nftIpfsHash: string;
  nftHash: string;
  registeredIp: boolean;
  tokenId: string;
  storyExplorerLink: string;
}

export default function MyAssets() {
  const { isConnected, address } = useAccount();
  const { mintNFT, client } = useStory();
  const [assets, setAssets] = useState<AssetData[]>([]);

  function refreshAssets() {
    // Simulate fetching data from local storage
    const storedAssets = localStorage.getItem("myAssets");
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
  }

  useEffect(() => {
    // Simulate fetching data from local storage
    refreshAssets();
  }, []);

  // Add dialog to get title and description from user - mint
  const registerIP = async (
    tokenId: string,
    nftIpfsHash: string,
    nftHash: string,
    title: string,
    description: string
  ) => {
    const ipMetadata: IpMetadata = {
      title: title,
      description: description,
    };
    // upload to ipfs
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash("sha256")
      .update(JSON.stringify(ipMetadata))
      .digest("hex");
    const response = await client?.ipAsset.register({
      nftContract: "0xd2a4a4Cb40357773b658BECc66A6c165FD9Fc485", // Story NFT contract address
      tokenId: tokenId, // your NFT token ID
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });
    console.log(`Root IPA created at tx hash ${response?.txHash}`);
  };

  const mintStoryNFT = async (uri: string) => {
    // save object to ipfs - get name and description from user inside dialog
    const nftMetadata = {
      name: "NFT representing ownership of IP Asset",
      description: "This NFT represents ownership of an IP Asset",
      video: uri,
    };

    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash("sha256")
      .update(JSON.stringify(nftMetadata))
      .digest("hex");
    console.log(`NFT hash ${nftHash}`);

    const tokenId = await mintNFT(
      address as Address,
      `https://ipfs.io/ipfs/${nftIpfsHash}`
    );
    console.log(`NFT minted with tokenId ${tokenId}`);
    // update this asset data in localstorage -- nftMinted = true, tokenId = tokenId, nftIpfsHash, nftHash -- TODO
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* <Button onClick={handleTest}>Test</Button> */}
      {assets.length === 0 ? (
        <div className="text-center col-span-full mt-40">
          <p className="text-2xl font-semibold text-muted-foreground">
            No Saved Assets Found
          </p>
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
                    {asset.registeredIp ? (
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={asset.storyExplorerLink}>
                          IP already minted
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          registerIP(asset.tokenId, "", "", "", "")
                        }
                        className="w-full"
                        variant="outline"
                      >
                        Register IP for Asset
                      </Button>
                    )}
                  </>
                ) : isConnected ? (
                  <Button
                    onClick={() => {
                      mintStoryNFT(asset.url);
                    }}
                    className="w-full"
                  >
                    Mint Story NFT
                  </Button>
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
