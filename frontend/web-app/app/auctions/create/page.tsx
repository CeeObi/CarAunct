import Headings from '@/app/components/Headings'
import React from 'react'
import AuctionForm from '../AuctionForm'

function Create() {
  return (
    <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
            <Headings title='Sell Your Car' subtitle="Please enter the details of your car" />
            <AuctionForm/> 
    </div>
  )
}

export default Create