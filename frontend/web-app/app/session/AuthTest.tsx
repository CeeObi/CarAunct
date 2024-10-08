"use client";
import React, { useState } from "react";
import { updateAuctionTest } from "../Services/auctionService";
import { Button } from "flowbite-react";

function AuthTest() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>();

    function doUpdate() {
        setResult(undefined);
        setLoading(true);
        updateAuctionTest()
            .then((fnResult) => setResult(fnResult))
            .finally(() => setLoading(false));
    }

    return (
        <div className="flex items-center gap-4">
            <Button isProcessing={loading} onClick={doUpdate} outline>
                {" "}
                Test auth
            </Button>
            <div>{JSON.stringify(result, null, 2)}</div>
        </div>
    );
}

export default AuthTest;
