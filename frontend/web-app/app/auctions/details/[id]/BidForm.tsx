"use client"
import { placeBidsForAuctions } from '@/app/actions/auctionActions'
import useBidStore from '@/app/hooks/useBidStore'
import { numberWithCommas } from '@/lib/numberWithComma'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
type Props = {
    auctionId: string,
    highBid: number
}


function BidForm({auctionId,highBid}: Props) {
    const {register, handleSubmit, formState:{errors}, reset} = useForm()
    const {addBid} = useBidStore((state) => state)    

    function handleOnSubmit(data: FieldValues){
        if (data.amount <= highBid){
          reset()
          return toast.error("Bid must be at least $" + numberWithCommas(highBid+1))
        }
        placeBidsForAuctions(auctionId, +data.amount)
        .then((bid) => {
            if (bid.error) throw bid.error;
            addBid(bid);
            reset();
        })
        .catch((e) => toast.error(e.message) )
    }


  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className='flex items-center border-2 rounded-lg py-2'>
        <input type='number' {...register('amount')}  className='input-custom text-sm text-gray-600'
                 placeholder={`Enter your bid (minimum bid is ${numberWithCommas(highBid + 1)})`} />
    </form>
  )
}

export default BidForm