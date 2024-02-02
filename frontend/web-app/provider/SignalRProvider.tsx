"use client"
import { getDetailedAuction } from '@/app/actions/auctionActions'
import AuctionCreatedToast from '@/app/components/AuctionCreatedToast'
import AuctionFinishedToast from '@/app/components/AuctionFinishedToast'
import useActionStore from '@/app/hooks/useAuctionStore'
import useBidStore from '@/app/hooks/useBidStore'
import { Auction, AuctionFinished, Bid } from '@/types'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { User } from 'next-auth'
import React, { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
    children: ReactNode,
    user: User | null
}


function SignalRProvider({children, user}:Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const {setCurrentPrice} = useActionStore((state) => state);
    const {addBid} = useBidStore((state) => state)
    const apiUrl = process.env.NODE_ENV === "production" ? "https://api.carsbidi.com/notifications" : process.env.NEXT_PUBLIC_NOTIFY_URL!

    useEffect(()=>{
        const newConnection = new HubConnectionBuilder().withUrl(apiUrl).withAutomaticReconnect().build();
        setConnection(newConnection)
    },[apiUrl])


    useEffect(() => {
        if(connection){
            connection.start()
            .then(()=>{
                console.log("Connected to notification hub");
                connection.on("BidPlaced",(bid: Bid)=>{
                    console.log("Bid Placed event received");
                    if (bid.bidStatus.includes("Accepted")){
                        setCurrentPrice(bid.auctionId, bid.amount)
                    };
                    
                    addBid(bid);
                })

                connection.on("AuctionCreated",(auction: Auction) => {
                    if (user?.username !== auction.seller){
                        return toast(<AuctionCreatedToast auction={auction} />, {duration: 10000})
                    }
                })
                
                connection.on("AuctionFinished",(finishedAuction: AuctionFinished) => {
                    const auction = getDetailedAuction(finishedAuction.auctionId);
                    
                    return toast.promise(auction, {
                        loading: "loading",
                        success: (auction) => <AuctionFinishedToast finishedAuction={finishedAuction} auction={auction}/>,
                        error: (err) => "Auctions finished!"                         
                    }, {success:{duration: 10000, icon: null}})                    
                })




            })
            .catch((e)=>{console.log(e)})
        }
        return () =>{connection?.stop()};

    },[connection, setCurrentPrice])



  return (
    children
  )
}

export default SignalRProvider