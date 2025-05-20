import { useState, useEffect } from 'react';
import api from '/intercepter/intercepter.js';
import { useNavigate, Link } from 'react-router-dom';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        country: '',
        state: '',
        city: '',
        street: '',
        houseNumber: '',
        cep: ''
    });
    const [update, setUpdate] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await api.get('/api/v1/user/address');
                setAddresses(response.data);
            } catch (err) {
                if(err.response.status === 401){
                    navigate('/login');
                }
                setError('Ocorreu um erro ao buscar os endereços. Tente novamente.');
            }
        };
        fetchAddresses();
    }, [update]);

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
        if (name === 'cep') {
            const formattedCep = value
                .replace(/\D/g, '')
                .slice(0, 8)
                .replace(/(\d{5})(\d)/, '$1-$2');
            setNewAddress({
                ...newAddress, [name]: formattedCep
            })
        } else {
            setNewAddress(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        setAddresses(prevAddresses => {
            const updatedAddresses = [...prevAddresses];
            updatedAddresses[index] = {
                ...updatedAddresses[index],
                [name]: value,
            };
            return updatedAddresses;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/v1/user/address', newAddress);
            setAddresses([...addresses, response.data]);
            setNewAddress({
                country: '',
                state: '',
                city: '',
                street: '',
                houseNumber: '',
                cep: ''
            });
            setUpdate(Math.random());
        } catch (err) {
            if(err.response.status === 401){
                navigate('/login');
            }
            setError('Ocorreu um erro ao adicionar o endereço. Tente novamente.');
        }
    };

    const handleUpdate = async (index) => {
        try {
            const address = addresses[index];
            await api.patch(`/api/v1/user/address/${address._id}`, address);
        } catch (err) {
            if(err.response.status === 401){
                navigate('/login');
            }
            setError('Ocorreu um erro ao atualizar o endereço. Tente novamente.');
        }
    };

    const handleDelete = async (index) => {
        try {
            const address = addresses[index];
            await api.delete(`/api/v1/user/address/${address._id}`);
            setAddresses(addresses.filter((_, i) => i !== index));
        } catch (err) {
            if(err.response.status === 401){
                navigate('/login');
            }
            setError('Ocorreu um erro ao deletar o endereço. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-sm p-4 mb-8">
                    <h1 className="text-2xl font-bold text-blue-600 mb-4 sm:mb-0">Gerenciar Endereços</h1>
                    <div className="flex space-x-4">
                        <Link to="/" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                        <Link to="/profile" className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Perfil
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Address Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Adicionar Novo Endereço</h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">País</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={newAddress.country}
                                        onChange={handleChange}
                                        placeholder="Brasil"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Estado</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={newAddress.state}
                                        onChange={handleChange}
                                        placeholder="Estado"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Cidade</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={newAddress.city}
                                        onChange={handleChange}
                                        placeholder="Cidade"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Rua</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={newAddress.street}
                                        onChange={handleChange}
                                        placeholder="Nome da rua"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Número</label>
                                        <input
                                            type="text"
                                            name="houseNumber"
                                            value={newAddress.houseNumber}
                                            onChange={handleChange}
                                            placeholder="Número"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">CEP</label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={newAddress.cep}
                                            onChange={handleChange}
                                            placeholder="00000-000"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Adicionar Endereço
                                </button>
                            </form>
                            {error && (
                                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Addresses List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Seus Endereços</h2>
                        </div>
                        <div className="p-6">
                            {addresses.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-gray-600 text-lg mb-2">Nenhum endereço encontrado</p>
                                    <p className="text-gray-500">Adicione seu primeiro endereço usando o formulário ao lado</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {addresses.map((address, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">País</label>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        value={address.country}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Estado</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={address.state}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Cidade</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={address.city}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Rua</label>
                                                    <input
                                                        type="text"
                                                        name="street"
                                                        value={address.street}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Número</label>
                                                    <input
                                                        type="text"
                                                        name="houseNumber"
                                                        value={address.houseNumber}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">CEP</label>
                                                    <input
                                                        type="text"
                                                        name="cep"
                                                        value={address.cep}
                                                        onChange={(e) => handleAddressChange(index, e)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => handleUpdate(index)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Atualizar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addresses;