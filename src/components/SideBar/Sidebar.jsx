import React from 'react'
import "./Sidebar.css"
import { useDispatch } from 'react-redux'
import { setAppState } from '../../features/appStateSlice';

const Sidebar = () => {
   
    const dispatch= useDispatch();
    
    const handleAppState = (state) =>{
        
        dispatch(setAppState(state))
      
    }
    return (
    <div className='contenedor-sidebar'>
       <aside class=" bg-sidebar-bg h-full flex flex-col items-center py-5">
            
       
            <div class="flex flex-col items-center space-y-8">
             
           

                
                <nav>
                    <ul class="flex flex-col items-center space-y-4">
                
                     <li onClick={(e)=>{
                        handleAppState('assets')
                     }}    >
                            <a href="#" class="flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 text-icon-gray hover:bg-icon-hover-bg hover:text-white" title="assets">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mb-1">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                    <line x1="12" x2="12" y1="8" y2="16"></line>
                                    <line x1="8" x2="16" y1="12" y2="12"></line>
                                </svg>
                                <span class="text-xs font-medium">Assets</span>
                            </a>
                        </li>
                        
                    
                        <li onClick={(e)=>{
                        handleAppState('inspections')
                     }}  >
                            <a href="#" class="flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 text-icon-gray hover:bg-icon-hover-bg hover:text-white" title="inspections">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mb-1">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                    <line x1="12" x2="12" y1="8" y2="16"></line>
                                    <line x1="8" x2="16" y1="12" y2="12"></line>
                                </svg>
                                <span class="text-xs font-medium">Inspections</span>
                            </a>
                        </li>

                        
                        <li onClick={(e)=>{
                        handleAppState('analytics')
                     }}  >
                            <a href="#" class="flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 text-icon-gray hover:bg-icon-hover-bg hover:text-white" title="analytics">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mb-1">
                                    <line x1="12" x2="12" y1="20" y2="10"></line>
                                    <line x1="18" x2="18" y1="20" y2="4"></line>
                                    <line x1="6" x2="6" y1="20" y2="16"></line>
                                </svg>
                                <span class="text-xs font-medium">Analytics</span>
                            </a>
                        </li>

                        
                        <li onClick={(e)=>{
                        handleAppState('gallery')
                     }}  >
                            <a href="#" class="flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 text-icon-gray hover:bg-icon-hover-bg hover:text-white" title="gallery">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mb-1">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                    <circle cx="9" cy="9" r="2"></circle>
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                </svg>
                                <span class="text-xs font-medium">Gallery</span>
                            </a>
                        </li>

                       
                       
                        

                    </ul>
                </nav>
            </div>

        
           
        </aside>
    </div>
  )
}

export default Sidebar