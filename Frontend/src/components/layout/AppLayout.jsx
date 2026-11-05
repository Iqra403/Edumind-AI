import React,{useState} from 'react'
import  Sidebar  from './Sidebar.jsx'
import Header from './Header'
const AppLayout = ({children}) => {
  const[isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSideBar=()=>{
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <>
    <div className='flex h-screen bg-[#f6f8fb] text-[#172033] dark:bg-[linear-gradient(145deg,#111c2d_0%,#0e1624_55%,#09111d_100%)] dark:text-slate-100'>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSideBar={toggleSideBar}/>
      <div className='flex-1 flex flex-col overflow-hidden'> 
      <Header  toggleSideBar={toggleSideBar}/>
      <main className='relative flex-1 overflow-x-hidden overflow-y-auto p-5 md:p-8'>
        {children}
      </main>
</div>
    </div>
    </>
  )
}

export default AppLayout
