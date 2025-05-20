import { useState, useEffect } from 'react';
import api from '/intercepter/intercepter.js';
import { useNavigate, Link } from 'react-router-dom';

const ProfileData = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        birthDate: '',
        cpf: ''
    });
    const [empty, setEmpty] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get('/api/v1/user/profile');
                setProfile({
                    fullName: response.data.fullName,
                    birthDate: response.data.birthDate,
                    cpf: response.data.cpf
                });
            } catch (err) {
                if(err.response.status === 401){
                    navigate('/api/v1/login');
                }
                if(err.response.data.error === 'Perfil não encontrado'){
                    setEmpty({
                        fullName: '',
                        birthDate: '',
                        cpf: ''
                    });
                }
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                await api.get('/api/v1/auth');
            } catch {
                navigate('/login');
            }
        };

        checkLogin();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'birthDate') {
            const formattedValue = value
                .replace(/\D/g, '') 
                .slice(0, 8) 
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d)/, '$1/$2'); 
            setProfile(prevProfile => ({
                ...prevProfile,
                [name]: formattedValue,
            }));
        } else if (name === 'cpf') {
            const formattedCPF = value
                .replace(/\D/g, '') 
                .slice(0, 11) 
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2') 
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
            setProfile(prevProfile => ({
                ...prevProfile,
                [name]: formattedCPF,
            }));
        } else {
            setProfile(prevProfile => ({
                ...prevProfile,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            if(empty.fullName === '' && empty.birthDate === '' && empty.cpf === ''){
                const response = await api.post('/api/v1/user/profile', profile);
                setMessage(response.data.msg);
                setEmpty('');
                return;
            }
            const response = await api.patch('/api/v1/user/profile', profile);
            setMessage(response.data.msg);
            setErrorMessage('');
        } catch(err){
            if(err.response.status === 401){
                navigate('/login');
            }
            setErrorMessage('Ocorreu um erro, tente novamente.');
        }
        
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Dados Pessoais</h1>
                        <div className="flex space-x-3">
                            <Link to="/" className="flex items-center px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Home
                            </Link>
                            <button 
                                onClick={() => navigate(-1)} 
                                className="flex items-center px-3 py-1 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Voltar
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Informações Pessoais</h2>
                                <p className="text-gray-600 text-sm">Atualize seus dados pessoais</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    placeholder="Seu nome completo"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                />
                            </div>
                            <div>
                                <label htmlFor="birthDate" className="block text-gray-700 font-medium mb-1">Data de Nascimento</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="birthDate"
                                        name="birthDate"
                                        value={profile.birthDate}
                                        onChange={handleChange}
                                        placeholder="DD/MM/AAAA"
                                        maxLength={10}
                                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                    <div className="absolute left-3 top-2.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="cpf" className="block text-gray-700 font-medium mb-1">CPF</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="cpf"
                                        name="cpf"
                                        value={profile.cpf}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                    <div className="absolute left-3 top-2.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Salvar Alterações
                            </button>
                            
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
                            
                            {errorMessage && (
                                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-red-700">{errorMessage}</p>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Seus dados estão protegidos de acordo com nossa
                        <a href="#" className="text-blue-600 hover:underline ml-1">Política de Privacidade</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileData;