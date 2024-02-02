import { Button, ButtonGroup } from 'flowbite-react';
import React from 'react'
import { useParamsStore } from '../hooks/useParamsStore';
import { AiOutlineClockCircle, AiOutlineSortAscending } from 'react-icons/ai';
import { BsFillStopCircleFill, BsStopwatchFill } from 'react-icons/bs';
import { GiFinishLine, GiFlame } from 'react-icons/gi';

const pageSizeButtons = [4, 8, 12];
const orderButtons = [
  {
    label: "Alphabetical",
    icon: AiOutlineSortAscending,
    value: "make"
  },
  {
    label: "End date",
    icon: AiOutlineClockCircle,
    value: "endingSoon"
  },
  {
    label: "Recently added",
    icon: BsFillStopCircleFill,
    value: "new"
  }
]
const filterButtons = [
  {
    label: "Live Auctions",
    icon: GiFlame,
    value: "live"
  },
  {
    label: "Ending < 6 hours",
    icon: GiFinishLine,
    value: "endingsoon"
  },
  {
    label: "Completed",
    icon: BsStopwatchFill,
    value: "finished"
  }
]


function Filters() {
  const pageSize = useParamsStore((state) => state.pageSize);
  const {setParams, orderBy, filterBy} = useParamsStore((state) => state)


  return (
    <div className='flex justify-between items-center mb-4'>
      <div>
        <span className='uppercase text-sm text-gray-500 mr-2'>Filter by</span>
        <ButtonGroup>
            {
                filterButtons.map(({label, icon:Icon, value}) =><Button key={value} className={` border-0 focus:ring-0 ${filterBy===value ? "bg-red-100" : "bg-gray-100"}`} color={filterBy===value ? "red" : "gray"} onClick={() => setParams({filterBy: value})}><Icon className='mr-2 h-4 w-4'/>{label}</Button> )
            }
        </ButtonGroup> 
      </div>
      <div>
        <span className='uppercase text-sm text-gray-500 mr-2'>Order by</span>
        <ButtonGroup>
            {
                orderButtons.map(({label, icon:Icon, value}) =><Button key={value} className={` border-0 focus:ring-0 ${orderBy===value ? "bg-red-100" : "bg-gray-100"}`} color={orderBy===value ? "red" : "gray"} onClick={() => setParams({orderBy: value})}><Icon className='mr-2 h-4 w-4'/>{label}</Button> )
            }
        </ButtonGroup> 
      </div>
      <div>
        <span className='uppercase text-sm text-gray-500 mr-2'>Page Size</span>  
        <ButtonGroup>
            {
                pageSizeButtons.map((val,indx) => <Button key={indx} className='focus:ring-0' color={pageSize===val ? "red" : "gray"} onClick={() => setParams({pageSize: val})}>{val}</Button> )
            }
        </ButtonGroup> 
      </div>
    </div>
  )
}

export default Filters;