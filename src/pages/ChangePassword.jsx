import { useState } from 'react';
import api from '/intercepter/intercepter.js'

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        setError('');
        setMessage('');
        setIsSubmitting(true);
        try {
            const response = await api.post('/register/new-password', { password: formData.password });
            setMessage(response.data.message || 'Password changed successfully!');
        } catch (err) {
            setError(err.response?.data || 'Failed to change password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-black text-center mb-6">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-black font-semibold mb-2">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-black font-semibold mb-2">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                        disabled={isSubmitting}
                    >
                        Change Password
                    </button>
                    {isSubmitting && (
                        <div className="flex justify-center mt-4">
                            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        </div>
                    )}
                </form>
                {message && <p className="text-black mt-4 text-center">{message}</p>}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default ChangePassword;