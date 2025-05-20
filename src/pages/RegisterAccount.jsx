import { useState } from 'react';
import api from '/intercepter/intercepter.js';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'password') {
            if (value === '') {
                setPasswordError('');
            } else if (!validatePassword(value)) {
                setPasswordError(
                    'A senha deve conter pelo menos 10 caracteres, incluindo letras maiúsculas, números e simbolos.'
                );
            } else {
                setPasswordError('');
            }
        }

        if (name === 'confirmPassword' || name === 'password') {
            if (formData.password === value || formData.confirmPassword === value) {
                setMessage('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage('As senhas não coincidem.');
            return;
        }
        if (passwordError) {
            setMessage('A senha não atende aos requisitos.');
            return;
        }
        setMessage('');
        setPasswordError('');
        setIsSubmitting(true);
        try {
            const { confirmPassword, ...dataToSend } = formData;
            const response = await api.post('/api/v1/register', dataToSend);
            if (response.data.message === 'Conta criada com sucesso') {
                setMessage('Conta criada com sucesso! Verifique seu email para confirmar.');
            }
        } catch (error) {
            setMessage('Ocorreu um erro, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white text-center">Criar Conta</h2>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">Primeiro nome</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleChange}
                                            placeholder="Seu nome"
                                            required
                                            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                        <div className="absolute left-3 top-2.5 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">Sobrenome</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleChange}
                                            placeholder="Seu sobrenome"
                                            required
                                            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                        <div className="absolute left-3 top-2.5 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        placeholder="seu@email.com"
                                        required
                                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                    <div className="absolute left-3 top-2.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Senha</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password || ''}
                                        onChange={handleChange}
                                        placeholder="••••••••••"
                                        required
                                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                    <div className="absolute left-3 top-2.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                {passwordError && (
                                    <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                                        <div className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-red-700">{passwordError}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">Confirmar Senha</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword || ''}
                                        onChange={handleChange}
                                        placeholder="••••••••••"
                                        required
                                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                    <div className="absolute left-3 top-2.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
                                disabled={isSubmitting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Criar Conta
                            </button>
                            
                            {isSubmitting && (
                                <div className="flex justify-center mt-4">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </form>
                        
                        {message && (
                            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-green-700">{message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-gray-600 mb-2">Já tem uma conta?</p>
                            <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Fazer Login
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Ao criar uma conta, você concorda com nossos
                        <a href="#" className="text-blue-600 hover:underline ml-1">Termos de Serviço</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;