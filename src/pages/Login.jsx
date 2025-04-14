import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const redirectUser = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://e-commerce-api-akwz.onrender.com/login', { email, password }, { withCredentials: true });
      if(response.data.token){
        localStorage.setItem('token', response.data.token)
      }

      if(response.data === 'Login successful' || response.data.msg === 'Login successful'){
        redirectUser('/');
      }
    } catch (err) {
      console.log(err)
      if(err.response.data === 'Please verify your email'){
        setError('Por favor verifique o seu email!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">Bem vindo!</h2>
          <Link to="/" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200">
            Home
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-black font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="bg-gray-200 w-full text-black px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-black font-semibold mb-2" htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="bg-gray-200 w-full text-black px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-black focus:border-black transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black transition duration-200">
              Esqueceu sua senha?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 active:bg-blue-900 transition duration-200 font-semibold"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">Não tem uma conta?</p>
          <Link to="/register" className="text-blue-800 font-semibold hover:underline transition duration-200">
            Registrar agora
          </Link>
        </div>
        {error && <p className="text-black mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
