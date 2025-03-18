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
                const response = await axios.get('http://localhost:3000/user');
                setUserData(response.data);
            } catch (err) {
                if(err.response.data === 'Please login'){
                    userRedirect('/login');
                }
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Profile Page</h1>
                <Link to="/" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                    Home
                </Link>
            </div>
            {userData && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Welcome, {userData.msg}!</h2>
                    <p className="text-gray-400 mb-4">Email: {userData.email}</p>
                    <div className="flex space-x-4">
                        <Link to='/my-orders' className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                            Purchases
                        </Link>
                        <Link to='/profile-data' className="bg-green-500 text-white p-2 rounded hover:bg-green-600 active:bg-green-700">
                            Profile Data
                        </Link>
                        <Link to='/profile-address' className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                            Addresses
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;