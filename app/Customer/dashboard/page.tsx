import Navbar from '@/app/components/Navbar'
import Sidebar from '@/app/components/Sidebar'
import React from 'react'

function page() {
  return (
    <div>
      
      <Navbar/>
      <div className='flex'>
      <Sidebar/>
      <h1 className='font-bold flex justify-center m-10'>Wellcome to Customer Dashbaord</h1>
      <p>This is the Customer Dashbaord</p>
      </div>
    </div>
  )
}

export default page