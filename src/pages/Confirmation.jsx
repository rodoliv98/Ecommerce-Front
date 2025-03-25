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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Purchase Confirmation</h1>
                {purchaseId ? (
                    <p className="text-lg text-white">
                        Thank you for your purchase! Your purchase ID is:
                        <span className="block text-blue-500 font-bold mt-2">{purchaseId}</span>
                    </p>
                ) : (
                    <p className="text-lg text-red-500">No purchase ID found.</p>
                )}
                <Link
                    to="/"
                    className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Confirmation;
