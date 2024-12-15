"use client";
import { Dropdown } from "flowbite-react";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { FaGithub } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiLoginBoxLine } from "react-icons/ri";
const LoginActions = ({ user }: { user: { id: string; username: string } | null }) => {
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLoad(false);
        }
    }, [user]);

    return (
        <Dropdown
            arrowIcon={false}
            label={
                <span className="flex items-center mx-0 px-0">
                    {isLoad && <Spinner color="success" aria-label="success spinner example" />}
                    <FaRegCircleUser className="m-0 ms-4  text-green-600 hover:text-green-400 p-0" size={29} />
                </span>
            }
            inline
        >
            <Dropdown.Item
                className=" "
                icon={RiLoginBoxLine}
                onClick={() => {
                    setIsLoad(true);
                    signIn("id-server");
                }}
            >
                Login
            </Dropdown.Item>
            <Dropdown.Item
                className=" "
                icon={FaGithub}
                onClick={() => {
                    setIsLoad(true);
                    signIn("github");
                }}
            >
                Signin with Github
            </Dropdown.Item>
        </Dropdown>
    );
};

export default LoginActions;
