import EmptyFilter from "@/app/components/EmptyFilter";
import React from "react";

function Page({ searchParams }: { searchParams: { callbackUrl: string } }) {
    console.log(searchParams.callbackUrl);

    return (
        <EmptyFilter
            title="You need to be logged in to visit this page"
            subtitle="Please click below to sign"
            showLogin
            callbackUrl={searchParams.callbackUrl}
        />
    );
}

export default Page;
