import { Bid } from "@/types"
import { create } from "zustand"

type State = {
    bids: Bid[]
    open: Boolean
}
type Actions = {
    setBids: (bids:Bid[]) => void,
    addBid: (bid:Bid) => void,
    setOpen: (value: Boolean) => void
}

const useBidStore = create<State & Actions>((set) => ({
    //State//
    bids:[],
    open: true,
       //&//
    //Action//
    setBids: (bids:Bid[]) => {
        set(() => ({bids}))
    },
    addBid: (bid: Bid) =>{
        console.log(bid);
        set((state)=>({
            bids: !state.bids.find((x)=> x.id === bid.id) ? [bid,...state.bids] : [...state.bids]
        }));
    },
    setOpen: (value: Boolean) =>{
        set(()=> ({open: value}))
    }
}))



export default useBidStore;