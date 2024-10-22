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
  RegisterIpResponse,
} from "@story-protocol/react-sdk";
import { ConnectKitButton } from "connectkit";
import { useStory } from "@/lib/context/AppContext";
import { useAccount } from "wagmi";
import { uploadJSONToIPFS } from "@/app/actions";
import { createHash } from "crypto";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [form, setForm] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  function refreshAssets() {
    const storedAssets = localStorage.getItem("myAssets");
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
  }

  const updateAssetInStorage = (updatedAsset: AssetData) => {
    const existingAssets = JSON.parse(localStorage.getItem("myAssets") || "[]");
    const updatedAssets = existingAssets.map((asset: AssetData) =>
      asset.url === updatedAsset.url ? updatedAsset : asset
    );
    localStorage.setItem("myAssets", JSON.stringify(updatedAssets));
    setAssets(updatedAssets);
  };

  useEffect(() => {
    refreshAssets();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const registerIP = async (
    tokenId: string,
    nftIpfsHash: string,
    nftHash: string,
    title: string,
    description: string,
    asset: AssetData
  ) => {
    if (!form.title || !form.description) {
      alert("Please fill in both title and description.");
      return;
    }

    const ipMetadata: IpMetadata = {
      title: title,
      description: description,
    };
    console.log("Ip metadata:", ipMetadata);

    // upload to ipfs
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash("sha256")
      .update(JSON.stringify(ipMetadata))
      .digest("hex");

    setIsLoading(true);

    // @ts-ignore
    const response: RegisterIpResponse = await client.ipAsset.register({
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

    const updatedAsset = {
      ...asset,
      registeredIp: true,
      storyExplorerLink: `https://explorer.story.foundation/ipa/${response.ipId}`,
    };

    updateAssetInStorage(updatedAsset);
    setForm({ title: "", description: "" });
    setIsLoading(false);
  };

  const mintStoryNFT = async (uri: string, asset: AssetData) => {
    // save object to ipfs - get name and description from user inside dialog
    const nftMetadata = {
      name: "NFT representing ownership of IP Asset",
      description: "This NFT represents ownership of an IP Asset",
      video: uri,
    };

    setIsLoading(true);

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

    // Update asset after minting
    const updatedAsset = {
      ...asset,
      nftMinted: true,
      nftIpfsHash,
      nftHash,
      tokenId,
    };
    updateAssetInStorage(updatedAsset);
    setIsLoading(false);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full" variant="outline">
                            Register IP for Asset
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full max-w-md">
                          <DialogHeader>
                            <DialogTitle>Register IP for Asset</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              registerIP(
                                asset.tokenId,
                                asset.nftIpfsHash,
                                asset.nftHash,
                                form.title,
                                form.description,
                                asset
                              );
                            }}
                          >
                            <div className="flex flex-col gap-4">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                name="title"
                                placeholder="Enter title"
                                value={form.title}
                                onChange={handleFormChange}
                                required
                              />
                              <Label htmlFor="description">Description</Label>
                              <Input
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                value={form.description}
                                onChange={handleFormChange}
                                required
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                className="w-full mt-4"
                                disabled={isLoading}
                              >
                                {isLoading
                                  ? "Registering IP..."
                                  : "Register IP"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      // <Button
                      //   onClick={() =>
                      //     registerIP(
                      //       asset.tokenId,
                      //       asset.nftIpfsHash,
                      //       asset.nftHash,
                      //       "Title",
                      //       "Description",
                      //       asset)
                      //   }
                      //   className="w-full"
                      //   variant="outline"
                      // >
                      //   Register IP for Asset
                      // </Button>
                    )}
                  </>
                ) : isConnected ? (
                  <Button
                    onClick={() => {
                      mintStoryNFT(asset.url, asset);
                    }}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Minting NFT..." : "Mint Story NFT"}
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
