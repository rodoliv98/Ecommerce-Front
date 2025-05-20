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
            setError('Ocorreu um erro ao adicionar o endereço. Tente novamente.');
        }
    };

    const handleUpdate = async (index) => {
        try {
            const address = addresses[index];
            await api.patch(`/api/v1/user/address/${address._id}`, address);
        } catch (err) {
            setError('Ocorreu um erro ao atualizar o endereço. Tente novamente.');
        }
    };

    const handleDelete = async (index) => {
        try {
            const address = addresses[index];
            await api.delete(`/api/v1/user/address/${address._id}`);
            setAddresses(addresses.filter((_, i) => i !== index));
        } catch (err) {
            setError('Ocorreu um erro ao deletar o endereço. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl mb-8 flex justify-between">
                <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition duration-200">
                    Home
                </Link>
                <Link to="/profile" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 active:bg-gray-900 transition duration-200">
                    Perfil
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mb-8">
                <h2 className="text-2xl font-bold text-center text-black mb-4">Adicione um novo endereço</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="country"
                        value={newAddress.country}
                        onChange={handleChange}
                        placeholder="País"
                        required
                        className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleChange}
                        placeholder="Estado"
                        required
                        className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleChange}
                        placeholder="Cidade"
                        required
                        className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleChange}
                        placeholder="Rua"
                        required
                        className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <input
                        type="text"
                        name="houseNumber"
                        value={newAddress.houseNumber}
                        onChange={handleChange}
                        placeholder="Número da casa"
                        required
                        className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <input
                        type="text"
                        name="cep"
                        value={newAddress.cep}
                        onChange={handleChange}
                        placeholder="CEP"
                        required
                        className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <button type="submit" className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200">
                        Adicionar
                    </button>
                </form>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center text-black mb-6">Endereços</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                    {addresses.length > 0 ? addresses.map((address, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                            <div className="flex items-center">
                                <label className="text-black font-semibold w-32">País:</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={address.country}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-black font-semibold w-32">Estado:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-black font-semibold w-32">Cidade:</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-black font-semibold w-32">Rua:</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={address.street}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-black font-semibold w-32">Casa Nº:</label>
                                <input
                                    type="text"
                                    name="houseNumber"
                                    value={address.houseNumber}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-black font-semibold w-32">CEP:</label>
                                <input
                                    type="text"
                                    name="cep"
                                    value={address.cep}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-200 w-full text-black px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => handleUpdate(index)}
                                    className="bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                                >
                                    Atualizar
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 active:bg-red-700 transition duration-200 flex items-center justify-center"
                                >
                                    <img src="trash.svg" alt="delete" className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )) : <p className="text-black text-center">Nenhum endereço encontrado</p>}
                </div>
            </div>
        </div>
    );
};

export default Addresses;