'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink } from "lucide-react"
import Link from 'next/link'

interface AssetData {
  url: string
  mintedIP: boolean
  ipAssetLink: string
  postedOnZora: boolean
  zoraLink: string
}

const sampleAssetData: AssetData[] = [
  {
    url: "https://example.com/asset1",
    mintedIP: false,
    ipAssetLink: "",
    postedOnZora: false,
    zoraLink: ""
  },
  {
    url: "https://example.com/asset2",
    mintedIP: true,
    ipAssetLink: "https://example.com/ip-asset2",
    postedOnZora: false,
    zoraLink: ""
  },
  {
    url: "https://example.com/asset3",
    mintedIP: true,
    ipAssetLink: "https://example.com/ip-asset3",
    postedOnZora: true,
    zoraLink: "https://zora.co/contract/address/tokenId3"
  },
]

export default function MyAssets() {
  const [assets, setAssets] = useState<AssetData[]>([])

  useEffect(() => {
    // Simulate fetching data from local storage
    const storedAssets = localStorage.getItem('myAssets')
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets))
    } else {
      // If no data in local storage, use sample data
      setAssets(sampleAssetData)
      localStorage.setItem('myAssets', JSON.stringify(sampleAssetData))
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset, index) => (
        <Card key={index} className="w-full max-w-sm mx-auto">
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Play className="w-16 h-16 text-gray-400" />
            </div>
            <div className="space-y-2">
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}