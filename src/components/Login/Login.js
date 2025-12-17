import React, { useState } from 'react';
import logo from '../../assets/Logo principal.png'




const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#626c7f]">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#626c7f]">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);


// --- Componente de Login ---

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setError('');
    // Lógica de autenticación aquí
    console.log('Iniciando sesión con:', { email, password });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-[#234451] rounded-2xl shadow-2xl m-auto mt-10">
      
      {/* Encabezado con Logo y Título */}
      <div className="flex flex-col items-center space-y-4">
       <img src={logo} width={400}/>
        <h2 className="text-2xl font-bold text-center text-[#EBECF4]">
          Iniciar Sesión
        </h2>
      </div>

      {/* Formulario */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* Campo de Email */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-[#626c7f] mb-2"
          >
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MailIcon />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#3b4d66] border border-[#626c7f] text-[#EBECF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9443]"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-[#626c7f] mb-2"
          >
            Contraseña
          </label>
          <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockIcon />
            </span>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#3b4d66] border border-[#626c7f] text-[#EBECF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9443]"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Error y Olvidé Contraseña */}
        <div className="flex items-center justify-between">
            {error && <p className="text-sm text-red-400">{error}</p>}
            
            <a 
              href="#" 
              className={`text-sm text-[#ff9443] hover:text-[#BD5505] transition-colors duration-200 ${!error ? 'ml-auto' : ''}`}
            >
              ¿Olvidaste tu contraseña?
            </a>
        </div>

        {/* Botón de Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 text-white font-semibold bg-[#FF6F00] rounded-lg hover:bg-[#BD5505] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6F00] focus:ring-offset-[#234451] transition-all duration-200 shadow-lg"
          >
            Ingresar
          </button>
        </div>
      </form>

      {/* Link a Registro */}
      <p className="text-sm text-center text-[#abc1e1]">
        ¿No tienes una cuenta?{' '}
        <a href="#" className="font-medium text-[#ff9443] hover:text-[#BD5505] transition-colors duration-200">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}

export default Login