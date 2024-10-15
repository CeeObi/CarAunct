"use client";
import React, { useState } from "react";
import { useParamsStore } from "../hooks/useParamsStore";
import Headings from "./Headings";
import { Button, Spinner } from "flowbite-react";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { RiLoginBoxLine } from "react-icons/ri";
import { startIDService } from "../Services/startServices";

type Props = {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
    showLogin?: boolean;
    callbackUrl?: string;
};

function EmptyFilter({
    title = "No matches for this filter",
    subtitle = "Try changing settings for this filter",
    showReset,
    showLogin,
    callbackUrl,
}: Props) {
    const reset = useParamsStore((state) => state.reset);
    const [buttonLoading, setButtonLoading] = useState(false);

    function handleStartID() {
        startIDService();
        setButtonLoading(true);
    }

    return (
        <div className="h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg">
            <Headings title={title} subtitle={subtitle} center />
            <div className="mt-4">
                {showReset && (
                    <Button outline onClick={reset}>
                        Remove Filters
                    </Button>
                )}
                {showLogin && (
                    <>
                        <Button
                            className="mx-auto my-3"
                            outline
                            onClick={() => {
                                signIn("id-server", { callbackUrl });
                                handleStartID();
                            }}
                        >
                            <RiLoginBoxLine className="m-1" /> Login
                        </Button>
                        <Button className="" outline onClick={() => signIn("github")}>
                            <FaGithub className="m-1" />
                            Signin with Github
                        </Button>
                        <a href="https://idnttyy-svc-latest.onrender.com" target="_blank" className="mx-auto">
                            <Button className="my-3 mx-auto" outline onClick={() => setButtonLoading(true)}>
                                <span>Start Identity Service</span>
                                {buttonLoading && <Spinner color="info" aria-label="Info spinner example" />}
                            </Button>
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}

export default EmptyFilter;
