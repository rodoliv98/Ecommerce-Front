import { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/address');
                setAddresses(response.data);
            } catch (error) {
                setError('There was an error. Please try again.');
            }
        };
        fetchAddresses();
    }, [addresses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const updatedAddresses = [...addresses];
        updatedAddresses[index] = {
            ...updatedAddresses[index],
            [name]: value
        };
        setAddresses(updatedAddresses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/user/address', newAddress);
            setAddresses([...addresses, response.data]);
            setNewAddress({
                country: '',
                state: '',
                city: '',
                street: '',
                houseNumber: ''
            });
        } catch (error) {
            setError('There was an error adding the address. Please try again.');
        }
    };

    const handleUpdate = async (index) => {
        try {
            const address = addresses[index];
            await axios.patch(`http://localhost:3000/user/address/${address.id}`, address);
        } catch (error) {
            setError('There was an error updating the address. Please try again.');
        }
    };

    const handleDelete = async (index) => {
        try {
            const address = addresses[index];
            await axios.delete(`http://localhost:3000/user/address/${address._id}`);
            setAddresses(addresses.filter((_, i) => i !== index));
        } catch (error) {
            setError('There was an error deleting the address. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl mb-8 flex justify-between">
                <Link to="/" className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                    Home
                </Link>
                <Link to="/profile" className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                    Profile
                </Link>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mb-8">
                <h2 className="text-2xl font-bold text-center text-white mb-4">Add New Address</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="country"
                        value={newAddress.country}
                        onChange={handleChange}
                        placeholder="Country"
                        required
                        className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                        className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                        className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleChange}
                        placeholder="Street"
                        required
                        className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="houseNumber"
                        value={newAddress.houseNumber}
                        onChange={handleChange}
                        placeholder="House Number"
                        required
                        className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                        Add Address
                    </button>
                </form>
                {error && <p className="mt-4 text-center text-white">{error}</p>}
            </div>
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center text-white mb-6">Addresses</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                    {addresses.length > 0 ? addresses.map((address, index) => (
                        <div key={index} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-2">
                            <div className="flex items-center">
                                <label className="text-white w-32">Country:</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={address.country}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-white w-32">State:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-white w-32">City:</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-white w-32">Street:</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={address.street}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="text-white w-32">House Nº:</label>
                                <input
                                    type="text"
                                    name="houseNumber"
                                    value={address.houseNumber}
                                    onChange={(e) => handleAddressChange(index, e)}
                                    className="bg-gray-700 w-full text-white px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => handleUpdate(index)}
                                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 active:bg-red-700 flex items-center justify-center"
                                >
                                    <img src="trash.svg" alt="delete" className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )) : <p className="text-white">No addresses found</p>}
                </div>
            </div>
        </div>
    );
};

export default Addresses;