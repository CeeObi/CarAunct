"use server";
const searchUrl = process.env.SEARCH_URL; //"https://search-svc.onrender.com/api/";
const auctionUrl = process.env.AUCTION_URL; //"https://auctn-svc.onrender.com/api/";
const bidUrl = process.env.BID_URL;

import { Auction, Bid, PagedResult } from "@/types";
import { del, get, post, put } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

//Get data from search api
export async function getData(query: string): Promise<PagedResult<Auction>> {
    return await get(`${searchUrl}/api/search/${query}`);
}

//action TEST update
export async function updateAuctionTest() {
    const data = { mileage: Math.floor(Math.random() * 100000) + 1 };
    // return await put("auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c", data)
    return await put(`${auctionUrl}/api/auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c`, data);
}

//Create new auction
export async function createAuction(data: FieldValues) {
    return await post(`${auctionUrl}/api/auctions`, data);
}

//update auction
export async function updateAuction(id: string, data: FieldValues) {
    const res = await put(`${auctionUrl}/api/auctions/${id}`, data);
    revalidatePath(`${auctionUrl}/api/auctions/${id}`);
    return res;
}

//delete auction
export async function deleteAuction(id: string) {
    const res = await del(`${auctionUrl}/api/auctions/${id}`);
    return res;
}

//get auction details
export async function getDetailedAuction(id: string): Promise<Auction> {
    return await get(`${auctionUrl}/api/auctions/${id}`);
}

//get bids
export async function getBidsForAuctions(id: string): Promise<Bid[]> {
    return await get(`${bidUrl}/api/bids/${id}`);
}

//place bids
export async function placeBidsForAuctions(auctionId: string, amount: number) {
    return await post(`${bidUrl}/api/bids?auctionId=${auctionId}&amount=${amount}`, {});
}
