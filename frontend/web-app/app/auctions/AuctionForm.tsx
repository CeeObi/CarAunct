"use client"
import { Button, TextInput } from 'flowbite-react';
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/auctionActions';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Auction } from '@/types';

type Props ={
    auction?: Auction
}

function AuctionForm({auction}:Props) {
    const {control, handleSubmit, setFocus, reset, formState:{isValid,isSubmitting}} = useForm({mode:"onTouched"});
    const router = useRouter()
    const pathname = usePathname()

    async function onSubmit(data : FieldValues) {
        try {
            let id="";
            let res;
            if(pathname === "/auctions/create"){
                res = await createAuction(data)
                id = res.id
            }else{
                if(auction){
                    res = await updateAuction(auction.id, data)
                    id=auction.id
                }
            }
            if (res.error) {
                throw res.error
            }
            router.push(`/auctions/details/${id}`)
        } catch (error: any) {
            toast.error(error.status + " " + error.message)            
        }
    }

    useEffect(() => {
        if (auction){
            const {make, model, mileage, year, color} = auction
            reset ({make, model, mileage, year, color})
        }
        setFocus("make")
    },[setFocus, reset,auction])

  return (
    <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>
        <Input label='Make' name='make' control={control} rules={{required:"Make is required"}} />
        <Input label='Model' name='model' control={control} rules={{required:"Model is required"}} />            
        <Input label='Color' name='color' control={control} rules={{required:"Color is required"}} /> 
        <div className='grid grid-cols-2 gap-3'>
            <Input label='Year' name='year' control={control} rules={{required:"Year is required"}} type='number' /> 
            <Input label='Mileage' name='mileage' control={control} rules={{required:"Mileage is required"}} type='number' /> 
        </div>  
        {pathname === "/auctions/create" &&
            <>
                <Input label='Image URL' name='imageURL' control={control} rules={{required:"Image URL is required"}} />
                <div className='grid grid-cols-2 gap-3'>
                    <Input label='Reserve Price (Please enter 0 if no reserve)' name='reservePrice' control={control} 
                                rules={{required:"Reserve Price is required"}} type='number' /> 
                    <DateInput label='Auction End Date/Time' name='auctionEnd' control={control} 
                            rules={{required:"Auction End date is required"}} dateFormat='dd MMMM yyyy h:mm a' showTimeSelect /> 
                </div> 
            </> 
        }
        <div className='flex justify-between'>
            <Button outline color='gray'>Cancel</Button>
            <Button type='submit' outline disabled={!isValid} isProcessing={isSubmitting} color='success'>Submit</Button>
        </div>
    </form>
  )
}

export default AuctionForm