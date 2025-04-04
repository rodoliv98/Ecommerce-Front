import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '/intercepter/intercepter.js'

const AdminPanel = () => {
    const redirectUser = useNavigate();

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                await api.get('/admin');

            } catch (error) {
                if (error.response?.status === 401) {
                    return redirectUser('/');
                }
            }
        };

        checkAdminAccess();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-black mb-8 text-center">Admin Dashboard</h1>
                <div className="flex flex-col gap-4">
                    <Link
                        to="/admin/create-product"
                        className="flex items-center justify-center bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg hover:bg-gray-700 active:bg-gray-900 transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-lg font-semibold">Create Product</span>
                    </Link>
                    <Link
                        to="/admin/update-product"
                        className="flex items-center justify-center bg-blue-800 text-white px-6 py-4 rounded-lg shadow-lg hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213l-4.5 1 1-4.5L16.862 3.487z" />
                        </svg>
                        <span className="text-lg font-semibold">Update Product</span>
                    </Link>
                    <Link
                        to="/admin/delete-product"
                        className="flex items-center justify-center bg-red-800 text-white px-6 py-4 rounded-lg shadow-lg hover:bg-red-700 active:bg-red-900 transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 10H7a2 2 0 01-2-2V7h14v14a2 2 0 01-2 2zM10 7V4h4v3" />
                        </svg>
                        <span className="text-lg font-semibold">Delete Product</span>
                    </Link>
                    <Link
                        to="/admin/upload-image"
                        className="flex items-center justify-center bg-green-800 text-white px-6 py-4 rounded-lg shadow-lg hover:bg-green-700 active:bg-green-900 transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4m0 0l4 4m-4-4v12M20 12h-4m0 0l4-4m-4 4l4 4" />
                        </svg>
                        <span className="text-lg font-semibold">Upload Image</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
