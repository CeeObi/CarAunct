"use client"
import { Button } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import React from 'react'

function LoginButton() {
  return (
    <Button outline onClick={() => signIn("github")}>Login github</Button>
  )
}

export default LoginButton