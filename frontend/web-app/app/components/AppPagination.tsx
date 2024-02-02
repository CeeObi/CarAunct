"use client"
import { Pagination } from 'flowbite-react'
import React from 'react'

type Props = {
    currentPage: number,
    pageCount:number,
    changePage: (page:number) => void
}



function AppPagination({currentPage, pageCount, changePage} : Props) {
  return (
    <Pagination 
        currentPage={currentPage} 
        onPageChange={(e) => changePage(e)} 
        totalPages={pageCount} 
        layout='pagination' 
        showIcons={true} 
        className='mb-5 text-blue-500' 
    />
  )
}

export default AppPagination