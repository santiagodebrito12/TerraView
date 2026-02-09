import React from 'react'
import "./Sidebar.css"
import { useDispatch } from 'react-redux'
import { setAppState } from '../../features/appStateSlice';
import absvg from '../../assets/comparison-svgrepo-com.svg'
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
                        <li onClick={(e)=>{
                        handleAppState('timeline')
                     }}  >
                            <a href="#" class="flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 text-icon-gray hover:bg-icon-hover-bg hover:text-white" title="timeline">

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mb-1">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span class="text-xs font-medium">Timeline</span>
                            </a>
                        </li>

                        <li onClick={(e)=>{
                        handleAppState('comparative')
                     }}  >
                            <a href="#" class="flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 text-icon-gray hover:bg-icon-hover-bg hover:text-white" title="gallery">
                                
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0000" stroke-width="white" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mb-1">
                            <path d="M12 3L12 21M14.7107 19.3887C17.1796 18.8321 19.1072 16.979 19.6863 14.6058C20.1046 12.8918 20.1046 11.1081 19.6863 9.39419C19.1072 7.02094 17.1796 5.16789 14.7107 4.61121M12 4.30969C11.0904 4.30969 10.1808 4.41019 9.28927 4.61121C6.82045 5.16789 4.89278 7.02094 4.31367 9.39419C3.89544 11.1081 3.89544 12.8918 4.31367 14.6058C4.89278 16.979 6.82045 18.8321 9.28928 19.3887C10.1808 19.5898 11.0904 19.6903 12 19.6903" stroke="white"  stroke-linecap="round"/>
                            </svg>
                                <span class="text-xs font-medium">A/B</span>
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