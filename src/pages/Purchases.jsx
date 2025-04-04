import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState(''); 

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get('https://e-commerce-api-akwz.onrender.com/user/historic');
                if (Array.isArray(response.data.historic)) {
                    setPurchases(response.data.historic); 
                }
            } catch (error) {
                console.log(error);
                setError('Failed to fetch purchase history. Please try again later.'); 
            }
        };

        fetchPurchases();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
            <div className="container mx-auto max-w-6xl bg-white p-6 rounded-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-black">Your Purchase History</h1>
                    <div className="flex space-x-4">
                        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition duration-200">
                            Home
                        </Link>
                        <Link to="/profile" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 transition duration-200">
                            Profile
                        </Link>
                    </div>
                </div>
                {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : purchases.length === 0 ? (
                    <p className="text-black text-center">No purchases found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {purchases.map((purchase) => (
                            <div key={purchase.id} className="bg-gray-100 p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-black mb-4">Order ID: {purchase.id}</h2>
                                <p className="text-gray-700 mb-2"><strong>Full Name:</strong> {purchase.fullName}</p>
                                <p className="text-gray-700 mb-2"><strong>Address:</strong> {purchase.street}, {purchase.houseNumber}, {purchase.city}, {purchase.state}, {purchase.cep}</p>
                                <p className="text-gray-700 mb-2"><strong>Currency:</strong> {purchase.currency}</p>
                                <p className="text-gray-700 mb-2"><strong>Total:</strong> R${Number(purchase.total).toFixed(2)}</p>
                                <p className="text-gray-700 mb-4"><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                                <h3 className="text-lg font-bold text-black mb-2">Items:</h3>
                                <ul className="list-disc list-inside text-gray-700 mb-4">
                                    {purchase.cart.map((item, index) => (
                                        <li key={index}>
                                            {item.quantity}x {item.item} - R${Number(item.price).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Purchases;