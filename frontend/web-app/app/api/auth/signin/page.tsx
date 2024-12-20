import EmptyFilter from "@/app/components/EmptyFilter";
import React from "react";

function Page({ searchParams }: { searchParams: { callbackUrl: string } }) {
    return (
        <EmptyFilter
            title="You need to be logged in to visit this page"
            subtitle="Please wait for 50 seconds and click below to sign"
            showLogin
            callbackUrl={searchParams.callbackUrl}
        />
    );
}

export default Page;
