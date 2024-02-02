import Headings from '@/app/components/Headings'
import React from 'react'
import AuctionForm from '../../AuctionForm'
import { getDetailedAuction } from '@/app/actions/auctionActions'

async function Update( {params}:{params:{id:string}}) {
  const data = await getDetailedAuction(params.id)
  return (
    <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
      <Headings title='Update Your Auction' subtitle='Please update the details of your car' />
      <AuctionForm auction={data} />
    </div>
  )
}

export default Update