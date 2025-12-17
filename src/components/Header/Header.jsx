import React,{useState,useRef,useEffect} from 'react'
import './Header.css';
import logo from '../../assets/Isologo principal.png'

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref para detectar clics fuera del dropdown

  // Función para cerrar el dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setModalOpen(!modalOpen);
  };
  
  return (
    <header className='contenedor-header relative'>
        <img src={logo} className='logo'/>
        
        
       
        <div className='contenedor-user-icon' ref={dropdownRef} onClick={toggleDropdown}>
        <h4>Capsa</h4>
        <i class="fa-solid fa-user user-icon"></i>
        </div>
        {modalOpen && (
        <div className="absolute right-0  mt-2 w-64 bg-white rounded-lg shadow-xl py-5  border border-gray-200 contenedor-modal">
        

         

          {/* Opciones de menú */}
          <a href="#" className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 ">Settings</a>
          <a href="#" className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 ">Security Settings</a>
          <a href="#" className="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100">Terms and Conditions</a>

          {/* Separador */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Opción "Logout" */}
          <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</a>
        </div>
      )}
        

       
      
       
      
    </header>
  )
}

export default Header