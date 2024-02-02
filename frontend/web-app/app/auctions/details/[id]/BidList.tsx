"use client"
import { getBidsForAuctions } from '@/app/actions/auctionActions'
import Headings from '@/app/components/Headings'
import useBidStore from '@/app/hooks/useBidStore'
import { Auction, Bid } from '@/types'
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import BidItem from './BidItem'
import { numberWithCommas } from '@/lib/numberWithComma'
import EmptyFilter from '@/app/components/EmptyFilter'
import BidForm from './BidForm'

type Props ={
    user: User | null,
    auction: Auction
}


function BidList({user,auction}: Props) {
    const[loading,setLoading]=useState(true);
    const {bids, setBids} = useBidStore(state=>state)
    const highbid = bids.reduce((previous, current) => previous > current.amount ? previous 
                                                        : current.bidStatus.includes("Accepted") ? current.amount : previous, 0)
    const {open, setOpen} = useBidStore((state)=>state);
    const openForBids = new Date(auction.auctionEnd) > new Date();


    useEffect(()=>{
        getBidsForAuctions(auction.id)
        .then((res: any) =>{ 
            if(res.error){
                throw res.error
            }
            setBids(res as Bid[]);
        })
        .catch((err) => toast.error(err.message)
        )
        .finally(()=>setLoading(false))
    },[auction.id,setBids,setLoading])


    useEffect(()=>{
        setOpen(openForBids)
    },[openForBids, setOpen])

    if (loading) return <span>Loading Bids...</span>


  return (
    <div className="rounded-lg shadow-md">
        <div className='py-2 px-4 b-white'>
            <div className='sticky top-0 bg-white p-2'>
                <Headings title={`Current high bid is: ${numberWithCommas(highbid)}`}/>
            </div>
        </div>
        <div className='overflow-auto h-[400px] flex flex-col-reverse px-2'>
            {bids.length === 0 ? <EmptyFilter title='No bids for this item' subtitle='Please feel free to make a bid'/> 
            : (<> {(bids).map((bid) => <BidItem key={bid.id} bid={bid} />)} </>)}
        </div>
        <div className='px-2 pb-2 text-gray-500'>
            {!open 
                ? (<div className='flex items-center justify-center p-2 font-semibold text-lg'>
                        This auction has finished
                    </div>) 
                : !user
                ? (<div className='flex items-center justify-center p-2 font-semibold text-lg'>
                        Please login to make a bid
                    </div>)
                : user && user.username === auction.seller 
                ?(<div className='flex items-center justify-center p-2 font-semibold text-lg'>
                        You cannot bid on your own auction
                    </div>)
                :(<BidForm auctionId={auction.id} highBid={highbid} />)
            }
        </div>
    </div> 
  )
}

export default BidList