"use client"
import { deleteAuction } from '@/app/actions/auctionActions'
import { Button } from 'flowbite-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props ={
    id:string
}



function DeleteButton({id}:Props) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    function handleDelete() {
        setLoading(true);
        deleteAuction(id)
        .then((res) => {
            if(res.error) throw res.error;
            router.push("/");
        })
        .catch((error) => {toast.error(error.status+" "+ error.message)})
        .finally(() => setLoading(false))
    }


    return (
        <Button color='failure' isProcessing={loading} onClick={handleDelete}>
            Delete Auction
        </Button>
      )
}

export default DeleteButton