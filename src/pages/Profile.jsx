import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

axios.defaults.withCredentials = true;

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRedirect = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://e-commerce-api-akwz.onrender.com/user');
                setUserData(response.data);
            } catch (err) {
                if(err.response.data === 'Unauthorized'){
                    userRedirect('/login');
                }
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

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

    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
            <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">Your Profile</h1>
                    <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:bg-gray-900 transition duration-200">
                        Home
                    </Link>
                </div>
                {userData ? (
                    <div className="space-y-6">
                        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-black">Welcome, {userData.msg}!</h2>
                            <p className="text-gray-600">Email: {userData.email}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/my-orders" className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-600 active:bg-blue-700 transition duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4m-2 0a6 6 0 0112 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
                                </svg>
                                <span className="text-lg font-bold">My Orders</span>
                            </Link>
                            <Link to="/profile-data" className="flex items-center justify-center bg-green-500 text-white p-4 rounded-lg shadow-lg hover:bg-green-600 active:bg-green-700 transition duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-lg font-bold">Profile Data</span>
                            </Link>
                            <Link to="/profile-address" className="flex items-center justify-center bg-purple-500 text-white p-4 rounded-lg shadow-lg hover:bg-purple-600 active:bg-purple-700 transition duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V9h6v12" />
                                </svg>
                                <span className="text-lg font-bold">Addresses</span>
                            </Link>
                            <button
                                onClick={() => userRedirect('/logout')}
                                className="flex items-center justify-center bg-red-500 text-white p-4 rounded-lg shadow-lg hover:bg-red-600 active:bg-red-700 transition duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                </svg>
                                <span className="text-lg font-bold">Logout</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-black text-center">Error: {error}</p>
                )}
            </div>
        </div>
    );
};

export default Profile;