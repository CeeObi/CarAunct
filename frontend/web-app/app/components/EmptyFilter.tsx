"use client";
import React from "react";
import { useParamsStore } from "../hooks/useParamsStore";
import Headings from "./Headings";
import { Button } from "flowbite-react";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { RiLoginBoxLine } from "react-icons/ri";

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
                        <Button className="mx-auto my-3" outline onClick={() => signIn("id-server", { callbackUrl })}>
                            <RiLoginBoxLine className="m-1" /> Login
                        </Button>
                        <Button className="" outline onClick={() => signIn("github")}>
                            <FaGithub className="m-1" />
                            Signin with Github
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default EmptyFilter;
