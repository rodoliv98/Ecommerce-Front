import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '/intercepter/intercepter.js'

const DeleteProduct = () => {
    const [productId, setProductId] = useState('');
    const [message, setMessage] = useState('');
    const redirectUser = useNavigate();

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                await api.get('/api/v1/admin');

            } catch (error) {
                if (error.response?.status === 401) {
                    redirectUser('/');
                }
            }
        };

        checkAdminAccess();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.delete(`/api/v1/products/${productId}`);
            setMessage(response.data.message || 'Product deleted successfully!');
        } catch (error) {
            setMessage('Failed to delete product.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8"> {/* Centered form */}
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-black mb-6 text-center">Delete Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="productId" className="block text-black font-semibold mb-2">Product ID:</label>
                        <input
                            type="text"
                            id="productId"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            placeholder="Enter product ID"
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        Delete Product
                    </button>
                </form>
                {message && <p className="text-black mt-4 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default DeleteProduct;
