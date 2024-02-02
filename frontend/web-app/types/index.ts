type PagedResult<T>={
    results: T[],
    pageCount: number,
    totalCount: number
}

type Auction = {
    reservePrice: number
    seller: string
    winner?: string
    soldAmount: number
    currentHighBid: number
    createdAt: string
    updatedAt: string
    auctionEnd: string
    status: string
    make: string
    model: string
    color: string
    year: number
    mileage: number
    imageUrl: string
    id: string
  } 

  type Bid ={ 
    id:string,
    auctionId:string,
    bidder: string,
    bidTime: string,
    amount: number,
    bidStatus: string
  }


  type AuctionFinished ={
    itemSold: boolean,
    auctionId: string,
    winner: string,
    seller: string,
    amount: number
  }

export type {PagedResult, Auction, Bid, AuctionFinished}