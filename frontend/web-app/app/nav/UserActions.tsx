"use client";
import { Button, Dropdown } from "flowbite-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from "react-icons/ai";
import { HiCog, HiUser } from "react-icons/hi2";
import { useParamsStore } from "../hooks/useParamsStore";
import { FaRegCircleUser } from "react-icons/fa6";

type Props = {
    user: User;
};

function UserActions({ user }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const setParams = useParamsStore((state) => state.setParams);

    function setWinner() {
        setParams({ winner: user.username, seller: undefined });
        if (pathname != "/") router.push("/");
    }
    function setSeller() {
        setParams({ seller: user.username, winner: undefined });
        if (pathname != "/") router.push("/");
    }

    //signout function
    function signout() {
        signOut({ callbackUrl: "/" });
    }

    return (
        // <Button outline>
        //     <Link href="/session">Session</Link>
        // </Button>
        <Dropdown
            arrowIcon={false}
            label={
                <span className="flex items-center mx-0 px-0">
                    Welcome, {`${user.name}`}
                    <FaRegCircleUser className="p-0 m-0 text-green-500 sm:p-1" size={30} />
                </span>
            }
            inline
        >
            <Dropdown.Item icon={HiUser} onClick={setSeller}>
                My Auctions
            </Dropdown.Item>
            <Dropdown.Item icon={AiFillTrophy} onClick={setWinner}>
                Auctions Won
            </Dropdown.Item>
            <Dropdown.Item icon={AiFillCar}>
                <Link href="/auctions/create">Sell my car</Link>
            </Dropdown.Item>
            <Dropdown.Item icon={HiCog}>
                <Link href="/session">Session (dev only)</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={AiOutlineLogout} onClick={signout}>
                Sign out
            </Dropdown.Item>
        </Dropdown>
    );
}

export default UserActions;
