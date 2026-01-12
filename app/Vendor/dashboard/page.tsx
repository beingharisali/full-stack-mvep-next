import Navbar from '@/app/components/Navbar'
import Sidebar from '@/app/components/Sidebar'
import Link from 'next/link';
import React from 'react'

function page() {
  return (
    <div>
      
      <Navbar/>
      <div className='flex'>
      <Sidebar/>
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className='font-bold text-2xl mb-6'>Welcome to Vendor Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
              <p className="text-gray-600 mb-4">View, add, edit, and manage your products</p>
              <Link 
                href="/products" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
              >
                Manage Products
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">View Orders</h2>
              <p className="text-gray-600 mb-4">Check and manage customer orders</p>
              <Link 
                href="#" 
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 inline-block"
              >
                View Orders
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Sales Reports</h2>
              <p className="text-gray-600 mb-4">Analyze your sales performance</p>
              <Link 
                href="#" 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default page
