"use server";
const searchUrl = "http://localhost:7002/api/"; //process.env.SEARCH_URL;
const auctionUrl = process.env.AUCTION_URL;
const bidUrl = process.env.BID_URL;

import { Auction, Bid, PagedResult } from "@/types";
import { del, get, post, put } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    return await get(`${searchUrl}search/${query}`);
}

export async function updateAuctionTest() {
    const data = { mileage: Math.floor(Math.random() * 100000) + 1 };
    // return await put("auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c", data)
    return await put(`${auctionUrl}auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c`, data);
}

export async function createAuction(data: FieldValues) {
    return await post(`${auctionUrl}auctions`, data);
}

export async function updateAuction(id: string, data: FieldValues) {
    const res = await put(`${auctionUrl}auctions/${id}`, data);
    revalidatePath(`${auctionUrl}auctions/${id}`);
    return res;
}

export async function deleteAuction(id: string) {
    const res = await del(`${auctionUrl}auctions/${id}`);
    return res;
}

export async function getDetailedAuction(id: string): Promise<Auction> {
    return await get(`${auctionUrl}auctions/${id}`);
}

export async function getBidsForAuctions(id: string): Promise<Bid[]> {
    return await get(`${bidUrl}bids/${id}`);
}
export async function placeBidsForAuctions(auctionId: string, amount: number) {
    return await post(`${bidUrl}bids?auctionId=${auctionId}&amount=${amount}`, {});
}
