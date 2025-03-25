import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState(''); 

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/historic');
                if (Array.isArray(response.data.historic)) {
                    setPurchases(response.data.historic); 
                }
            } catch (error) {
                setError('Failed to fetch purchase history. Please try again later.'); 
            }
        };

        fetchPurchases();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Your Purchase History</h1>
                <div className="flex space-x-4">
                    <Link to="/" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                        Home
                    </Link>
                    <Link to="/profile" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 active:bg-green-700">
                        Profile
                    </Link>
                </div>
            </div>
            {error ? (
                <p className="text-red-500 text-center">{error}</p> 
            ) : purchases.length === 0 ? (
                <p className="text-white text-center">No purchases found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {purchases.map((purchase) => (
                        <div key={purchase.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-white mb-4">Order ID: {purchase.id}</h2>
                            <p className="text-gray-400 mb-2"><strong>Full Name:</strong> {purchase.fullName}</p>
                            <p className="text-gray-400 mb-2"><strong>Address:</strong> {purchase.street}, {purchase.houseNumber}, {purchase.city}, {purchase.state}, {purchase.cep}</p>
                            <p className="text-gray-400 mb-2"><strong>Currency:</strong> {purchase.currency}</p>
                            <p className="text-gray-400 mb-2"><strong>Total:</strong> R${purchase.total}</p>
                            <p className="text-gray-400 mb-4"><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                            <h3 className="text-lg font-bold text-white mb-2">Items:</h3>
                            <ul className="list-disc list-inside text-gray-400 mb-4">
                                {purchase.cart.map((item, index) => (
                                    <li key={index}>
                                        {item.quantity}x {item.item} - R${item.price.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Purchases;