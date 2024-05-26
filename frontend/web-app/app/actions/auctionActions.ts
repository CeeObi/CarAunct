"use server"

import { Auction, Bid, PagedResult } from "@/types";
import { del, get, post, put } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

const searchUrl = process.env.SEARCH_URL //https://search-svc.onrender.com/api/search
const auctionUrl = process.env.AUCTION_URL //https://auctn-svc.onrender.com/api/auctions
const bidUrl = process.env.BID_URL //https://auctn-svc.onrender.com/api/auctions



export async function getData(query : string): Promise<PagedResult<Auction>>  {
    return  await get(`${searchUrl}/${query}`)  
    // return  await get(`search/${query}`)  
  }

export async function updateAuctionTest() {
  const data = {mileage: Math.floor(Math.random() * 100000)+ 1}
  // return await put("auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c", data)
  return await put(`${auctionUrl}/afbee524-5972-4075-8800-7d1f9d7b0a0c`, data)
}

export async function createAuction(data: FieldValues) {
  return await post(`${auctionUrl}`, data)
}

export async function updateAuction( id:string, data: FieldValues) {  
  // const res= await put(`auctions/${id}`, data)
  const res= await put(`${auctionUrl}/${id}`, data)
  revalidatePath(`${auctionUrl}/${id}`)
  return res
}

export async function deleteAuction( id:string) {  
  const res= await del(`${auctionUrl}/${id}`)
  return res
}

export async function getDetailedAuction(id: string):Promise<Auction> {
  return await get(`${auctionUrl}/${id}`)
}

export async function getBidsForAuctions(id: string): Promise<Bid[]> {
  return await get(`${bidUrl}/${id}`)  
}

export async function placeBidsForAuctions(auctionId: string, amount:number) {
  return await post(`${bidUrl}?auctionId=${auctionId}&amount=${amount}`,{})  
}
  