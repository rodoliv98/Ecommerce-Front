import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Confirmation = () => {
    const [purchaseId, setPurchaseId] = useState('');
    const location = useLocation();

    useEffect(() => {
        const state = location.state;
        if (state && state.purchaseId) {
            setPurchaseId(state.purchaseId);
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-black mb-6">Purchase Confirmation</h1>
                {purchaseId ? (
                    <p className="text-lg text-black">
                        Thank you for your purchase! Your purchase ID is:
                        <span className="block text-blue-500 font-bold mt-2">{purchaseId}</span>
                    </p>
                ) : (
                    <p className="text-lg text-red-500">No purchase ID found.</p>
                )}
                <Link
                    to="/"
                    className="mt-6 inline-block bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Confirmation;
