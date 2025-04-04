import { useState } from 'react';
import axios from 'axios';

const Recovery = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://e-commerce-api-akwz.onrender.com/register/recovery-password', { email });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-black text-center mb-6">Recover Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-black font-semibold mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        Send Recovery Email
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-black">{message}</p>}
            </div>
        </div>
    );
};

export default Recovery;