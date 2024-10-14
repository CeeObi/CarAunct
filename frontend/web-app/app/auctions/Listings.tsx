"use client";

import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { Auction, PagedResult } from "@/types";
import React, { useEffect, useState } from "react";
import { getData } from "../Services/auctionService";
import Filters from "./Filters";
import { useParamsStore } from "../hooks/useParamsStore";
import qs from "query-string";
import EmptyFilter from "../components/EmptyFilter";
import useActionStore from "../hooks/useAuctionStore";

function Listings() {
    // const [data,setData] = useState<PagedResult<Auction>>();
    const [loading, setLoading] = useState(true);

    const params = useParamsStore((state) => ({
        pageSize: state.pageSize,
        pageNumber: state.pageNumber,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        filterBy: state.filterBy,
        seller: state.seller,
        winner: state.winner,
    }));

    const { auctions, pageCount, totalCount, setData, setCurrentPrice } = useActionStore((state) => state);
    const data = { auctions, pageCount, totalCount };

    const setParams = useParamsStore((state) => state.setParams);
    const queryStringParameters = qs.stringifyUrl({ url: "", query: params }); //only query parameters with no url - using query-string libray to convert object to querystring
    console.log(queryStringParameters);

    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber });
    }

    useEffect(() => {
        getData(queryStringParameters).then((gottenData) => {
            console.log("GOTTENdatA", gottenData);
            setData(gottenData);
            setLoading(false);
        });
    }, [queryStringParameters, setData]);

    if (loading) {
        return <h3>Loading...</h3>;
    }

    return (
        <>
            <Filters />
            {data.totalCount === 0 ? (
                <EmptyFilter showReset />
            ) : data && data.auctions && Array.isArray(data.auctions) ? (
                <>
                    <div className="grid px-3 xl:grid-cols-4 lg:grid-cols-3 gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                        {data.auctions.map((result) => (
                            <AuctionCard key={result.id} auction={result} />
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <AppPagination
                            currentPage={params.pageNumber}
                            pageCount={data.pageCount}
                            changePage={setPageNumber}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h3>Loading...</h3>
                    <h5>Please referesh after 2 mins...</h5>
                </>
            )}
        </>
    );
}

export default Listings;
