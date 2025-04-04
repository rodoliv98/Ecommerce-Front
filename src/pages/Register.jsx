import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'password') {
            if (value === '') {
                setPasswordError('');
            } else if (!validatePassword(value)) {
                setPasswordError(
                    'Password must contain at least 10 characters, including uppercase, lowercase, a number, and a symbol.'
                );
            } else {
                setPasswordError('');
            }
        }

        if (name === 'confirmPassword' || name === 'password') {
            if (formData.password === value || formData.confirmPassword === value) {
                setMessage('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        if (passwordError) {
            setMessage('Please fix the password requirements.');
            return;
        }
        setMessage('');
        setPasswordError('');
        setIsSubmitting(true);
        try {
            const { confirmPassword, ...dataToSend } = formData;
            const response = await axios.post('https://e-commerce-api-akwz.onrender.com/register', dataToSend);
            if (response.data === 'Account created') {
                setMessage('Account created. Please check your email to verify your account.');
            }
        } catch (error) {
            setMessage(error.response.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-black text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="firstName" className="block text-black font-semibold mb-2">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-black font-semibold mb-2">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-black font-semibold mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-black font-semibold mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                        {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-black font-semibold mb-2">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword || ''}
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
                        Register
                    </button>
                    {isSubmitting && (
                        <div className="flex justify-center mt-4">
                            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        </div>
                    )}
                </form>
                {message && <p className="text-black mt-4 text-center">{message}</p>}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an account?</p>
                    <Link to="/login" className="text-blue-800 font-semibold hover:underline transition duration-200">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;