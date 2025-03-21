import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const EmailConfirmed = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        async function handleSendEmail() {
            try {
                const response = await axios.post(`https://e-commerce-api-akwz.onrender.com/register/verify-email?token=${token}`);
                setMessage(response.data);
            } catch (err) {
                setMessage('Error confirming email');
                setError('Failed to confirm email.');
            } finally {
                setLoading(false);
            }
        }
        handleSendEmail();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <p className="text-white mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
            <Link to="/" className="absolute top-4 left-4 px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Home
            </Link>
            <Link to="/login" className="absolute top-4 right-4 px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Login
            </Link>
            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-white mb-6">Email Confirmation</h1>
                <p className="text-center text-white">{message}</p>
            </div>
        </div>
    );
}

export default EmailConfirmed;