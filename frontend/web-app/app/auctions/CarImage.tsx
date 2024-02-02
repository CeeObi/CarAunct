"use client"
import Image from 'next/image'
import React, { useState } from 'react'


type Props = {
    imgUrl: string,
  }

function CarImage({imgUrl}:Props) {
    const [isLoading, setIsLoading] = useState(true)
  return (
    
    <Image src={imgUrl} priority alt="image" fill 
    className={`group-hover:opacity-65 duration-700 ease-in-out object-cover ${isLoading ? "grayscale blur-2xl scale-110" : "grayscale-0 blur-0 scale-100"}` }
    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw" onLoad={() => setIsLoading(false)}/>            

  )
}




export default CarImage