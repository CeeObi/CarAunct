import { Auction, PagedResult } from "@/types";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

//create class object, where type in type script is likened to class in aspnet
//state class object with 3 properties/fields
type State = {
    auctions: Auction[];
    totalCount: number;
    pageCount: number;
};

//action class object with its properties basically functions
type Actions = {
    setData: (data: PagedResult<Auction>) => void;
    setCurrentPrice: (auctionId: string, amount: number) => void;
};

const initialState: State = {
    auctions: [],
    pageCount: 0,
    totalCount: 0,
};

//Initialize the store with initial values and methods
const useActionStore = create<State & Actions>((set) => ({
    ...initialState,
    setData: (data: PagedResult<Auction>) => {
        set(() => ({
            auctions: data.results,
            totalCount: data.totalCount,
            pageCount: data.pageCount,
        }));
    },
    setCurrentPrice: (auctionId: string, amount: number) => {
        set((state) => ({
            auctions: state.auctions.map((auction) =>
                auction.id === auctionId ? { ...auction, currentHighBid: amount } : auction
            ),
        }));
    },
}));


export default useActionStore;
