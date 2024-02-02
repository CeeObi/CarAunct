import { numberWithCommas } from '@/lib/numberWithComma'
import { Auction, AuctionFinished } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


type Props  = {
    finishedAuction: AuctionFinished,
    auction: Auction
}

function AuctionFinishedToast({auction, finishedAuction} : Props) {
    return (
      <Link href={`auctions/detail/${auction.id}`} className='flex flex-col items-center'>
          <div className='flex flex-row items-center gap-2'>
              <Image src={auction.imageUrl} alt='image' height={80} width={80} className='rounded-lg w-auto h-auto' />
              <div className='flex flex-col'>
                  <span>The auction for {auction.make} {auction.model} has ended.</span>
                  {finishedAuction.itemSold && finishedAuction.winner 
                  ? (<p>Congrats to {finishedAuction.winner} for winning this auction for $${numberWithCommas(finishedAuction.amount)}</p>) 
                  :(<p>This item did not sell</p>)}  
              </div>
          </div>  
      </Link>
    )
  }



export default AuctionFinishedToast