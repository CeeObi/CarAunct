import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { FaGithub } from "react-icons/fa";
import { getCurrentUser } from "../Services/authService";
import UserActions from "./UserActions";
import LoginActions from "./LoginActions";
import React, { useEffect, useState } from "react";

const Navbar = async () => {
    const user = await getCurrentUser(); //{username:"Jame",id:"12345"}

    return (
        <header className="sticky top-0 z-50 lg:flex justify-between bg-white p-5 text-gray-800 shadow-md items-center">
            <div className="flex justify-between items-center w-full">
                <Logo />
                <Search vizbility="hidden md:flex  w-[50%]  " />
                {user ? (
                    <UserActions user={user} />
                ) : (
                    <>
                        <LoginActions user={user} />
                        {/* <LoginButton/>          
                        <LoginButton2/>           */}
                    </>
                )}
            </div>
            <Search vizbility="md:hidden mt-2  w-full" />
        </header>
    );
};

export default Navbar;
