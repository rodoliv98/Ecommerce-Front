import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const EmailConfirmed = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        async function handleSendEmail() {
            try {
                const response = await axios.post(`https://e-commerce-api-akwz.onrender.com/register/verify-email?token=${token}`);
                setMessage(response.data);
            } catch (err) {
                setMessage('Error confirming email');
            } finally {
                setLoading(false);
            }
        }
        handleSendEmail();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <p className="text-black mt-4">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-black mb-6">Confirmação de email</h1>
                <p className={`text-lg ${message === 'Error confirming email' ? 'text-black' : 'text-black'}`}>
                    {message}
                </p>
                <div className="mt-6 flex justify-between">
                    <Link
                        to="/"
                        className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        Home
                    </Link>
                    <Link
                        to="/login"
                        className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EmailConfirmed;