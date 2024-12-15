"use client";
import { placeBidsForAuctions } from "@/app/Services/auctionService";
import { Spinner } from "flowbite-react";
import { Button } from "flowbite-react";
import useBidStore from "@/app/hooks/useBidStore";
import { numberWithCommas } from "@/lib/numberWithComma";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
type Props = {
    auctionId: string;
    highBid: number;
};

function BidForm({ auctionId, highBid }: Props) {
    const [isLoad, setIsLoad] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const { addBid } = useBidStore((state) => state);

    function handleOnSubmit(data: FieldValues) {
        setIsLoad(true);
        if (data.amount <= highBid) {
            setIsLoad(false);
            reset();
            return toast.error("Bid must be at least $" + numberWithCommas(highBid + 1));
        }
        // console.log(data);
        placeBidsForAuctions(auctionId, +data.amount)
            .then((bid) => {
                setIsLoad(false);
                if (bid.error) throw bid.error;
                // addBid(bid);
                reset();
            })
            .catch((e) => {
                setIsLoad(false);
                toast.error(e.message);
            });
    }

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)} className="flex items-center border-2 rounded-lg py-2 pr-2">
            <input
                type="number"
                {...register("amount")}
                className="input-custom text-sm text-gray-600"
                placeholder={`Enter your bid (minimum bid is ${numberWithCommas(highBid + 1)})`}
                min={0}
            />
            <Button
                className="bg-green-500 px-7 hover:bg-green-700 text-neutral-200 hover:scale-105 duration-500 border-0  "
                type="submit"
                color="primary"
            >
                <span className="text-center mr-2">Place Bid</span>
                {isLoad && <Spinner color="info" aria-label="Info spinner example" />}
            </Button>
        </form>
    );
}

export default BidForm;
