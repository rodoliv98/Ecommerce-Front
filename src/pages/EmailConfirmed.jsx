import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const EmailConfirmed = () => {
    const [message, setMessage] = useState('');
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        async function handleSendEmail() {
            try {
                const response = await axios.post(`http://localhost:3000/register/verify-email?token=${token}`);
                setMessage(response.data);
            } catch (err) {
                setMessage('Error confirming email');
            }
        }
        handleSendEmail();
    }, [token]);

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