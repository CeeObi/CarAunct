// import { getSession } from 'next-auth/react'
import React from 'react'
import Headings from '../components/Headings'
import { getSession, getTokenWorkAround } from '../actions/authActions'
import AuthTest from './AuthTest'




async function session() {
  const session = await getSession()
  const token = await getTokenWorkAround()
  // console.log(session);


  return (
    <div>
        <Headings title={'Session dashboard'} />
        <div className="bg-blue-200 border-2 border-blue-500">
            <h3 className='text-lg'>Session Data</h3>
            <pre>{JSON.stringify(session,null,2)}</pre>
        </div>
        <AuthTest /> 
        <div className="bg-green-200 border-2 border-blue-500 mt-4">
            <h3 className='text-lg'>Token Data</h3>
            <pre className='overflow-auto'>{JSON.stringify(token,null,2)}</pre>
        </div>
    </div>
  )
}

export default session