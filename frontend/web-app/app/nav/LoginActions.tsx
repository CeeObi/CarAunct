'use client';
import { Dropdown } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaRegCircleUser } from 'react-icons/fa6';
import { RiLoginBoxLine } from "react-icons/ri";
const LoginActions = () => {
  return (   
        <Dropdown arrowIcon={false} label={<span className="flex items-center mx-0 px-0"><FaRegCircleUser className="m-0  text-green-600 hover:text-green-400 p-0" size={29} /></span>} inline>
                <Dropdown.Item className=' ' icon={RiLoginBoxLine} onClick={() => signIn("id-server",{callbackUrl:"/"}, {prompt: "login"})}>Login</Dropdown.Item>
                <Dropdown.Item className=' ' icon={FaGithub} onClick={()=>signIn("github")}>Signin with Github</Dropdown.Item>
        </Dropdown>    
  )
}





export default LoginActions