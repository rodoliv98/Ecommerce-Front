import { useState, useEffect } from 'react';
import api from '/intercepter/intercepter.js';
import { Link } from 'react-router-dom';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        country: '',
        state: '',
        city: '',
        street: '',
        houseNumber: ''
    });
    const [update, setUpdate] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await api.get('/user/address');
                setAddresses(response.data);
            } catch (error) {
                setError('There was an error. Please try again.');
            }
        };
        fetchAddresses();
    }, [update]);
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prevState => ({
            ...prevState,
            [name]: value
        }));
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
            const response = await api.post('/user/address', newAddress);
            setAddresses([...addresses, response.data]);
            setNewAddress({
                country: '',
                state: '',
                city: '',
                street: '',
                houseNumber: ''
            });
            setUpdate(Math.random());
        } catch (error) {
            setError('There was an error adding the address. Please try again.');
        }
    };

    const handleUpdate = async (index) => {
        try {
            const address = addresses[index];
            await api.patch(`/user/address/${address._id}`, address);
        } catch (error) {
            setError('There was an error updating the address. Please try again.');
        }
    };

    const handleDelete = async (index) => {
        try {
            const address = addresses[index];
            await api.delete(`/user/address/${address._id}`);
            setAddresses(addresses.filter((_, i) => i !== index));
        } catch (error) {
            setError('There was an error deleting the address. Please try again.');
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