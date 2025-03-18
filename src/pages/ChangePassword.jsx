import { useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/register/new-password?token=${token}`, { password });
            setMessage(response.data);
        } catch (error) {
            setMessage('Error changing password');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
            <Link to="/" className="absolute top-4 left-4 px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Home
            </Link>
            <Link to="/login" className="absolute top-4 right-4 px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Login
            </Link>
            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handleChange}
                            className="shadow appearance-none text-white border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Change Password
                        </button>
                        {message && <p className="ml-4 text-center text-white">{message}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword