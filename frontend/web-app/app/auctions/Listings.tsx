"use client"

import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { Auction, PagedResult } from "@/types";
import React, { useEffect, useState } from "react";
import { getData } from "../actions/auctionActions";
import Filters from "./Filters";
import { useParamsStore } from "../hooks/useParamsStore";
import qs from "query-string";
import EmptyFilter from "../components/EmptyFilter";
import useActionStore from "../hooks/useAuctionStore";

 
function Listings() {
    // const [data,setData] = useState<PagedResult<Auction>>();
    const [loading,setLoading] = useState(true)

    const params = useParamsStore((state) => ({        
        pageSize: state.pageSize,
        pageNumber: state.pageNumber,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        filterBy: state.filterBy,
        seller: state.seller,
        winner: state.winner,
    }))

        const {auctions, pageCount, totalCount, setData, setCurrentPrice} = useActionStore((state) => state)
        const data ={auctions,pageCount,totalCount}

    const setParams = useParamsStore((state) => state.setParams)
    const dataUrl = qs.stringifyUrl({url:"", query: params})

     
    function setPageNumber(pageNumber: number) {
        setParams({pageNumber});
        
    }

    useEffect(() => {
        getData(dataUrl).then((gottenData) => {
                setData(gottenData);
                setLoading(false);
        });
    },[dataUrl, setData])


  if (loading){
     return <h3>Loading...</h3>
  }   
 

  return (<>
    <Filters />
    {data.totalCount===0 ? <EmptyFilter showReset /> 
    :<>
        <div className="grid grid-cols-4 gap-6">
            {
                data.auctions.map((result) => (<AuctionCard key={result.id} auction={result} />))
            }
        </div>
        <div className="flex justify-center mt-4">
            <AppPagination currentPage={params.pageNumber} pageCount={data.pageCount} changePage={setPageNumber}/>
        </div>
    </>}
  </>)
}


export default Listings

