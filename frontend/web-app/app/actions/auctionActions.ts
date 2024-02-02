"use server"

import { Auction, Bid, PagedResult } from "@/types";
import { del, get, post, put } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";


export async function getData(query : string): Promise<PagedResult<Auction>>  {
    return  await get(`search/${query}`)  
  }

export async function updateAuctionTest() {
  const data = {mileage: Math.floor(Math.random() * 100000)+ 1}
  return await put("auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c", data)
}

export async function createAuction(data: FieldValues) {
  return await post("auctions", data)
}

export async function updateAuction( id:string, data: FieldValues) {  
  const res= await put(`auctions/${id}`, data)
  revalidatePath(`auctions/${id}`)
  return res
}

export async function deleteAuction( id:string) {  
  const res= await del(`auctions/${id}`)
  return res
}

export async function getDetailedAuction(id: string):Promise<Auction> {
  return await get(`auctions/${id}`)
}


export async function getBidsForAuctions(id: string): Promise<Bid[]> {
  return await get(`bids/${id}`)  
}
export async function placeBidsForAuctions(auctionId: string, amount:number) {
  return await post(`bids?auctionId=${auctionId}&amount=${amount}`,{})  
}
  