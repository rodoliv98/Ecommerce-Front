import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '/intercepter/intercepter.js'

const CreateProduct = () => {
    const [product, setProduct] = useState({
        item: '',
        price: '',
        quantity: '',
        imagePath: '',
        category: '',
    });
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                item: product.item,
                price: parseInt(product.price),
                quantity: parseInt(product.quantity),
                imagePath: product.imagePath,
                category: product.category,
            }
            const response = await api.post('/api/v1/products', productData);
            setMessage('Product created successfully!');
        } catch (error) {
            console.log(error)
            setMessage('Failed to create product.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8"> {/* Centered form */}
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-black mb-6 text-center">Create Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="item" className="block text-black font-semibold mb-2">Item Name:</label>
                        <input
                            type="text"
                            id="item"
                            name="item"
                            value={product.item}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-black font-semibold mb-2">Price:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            placeholder="Enter product price"
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-black font-semibold mb-2">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            placeholder="Enter product quantity"
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-black font-semibold mb-2">Category:</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            placeholder="Enter product category"
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="imagePath" className="block text-black font-semibold mb-2">Image Path:</label>
                        <input
                            type="text"
                            id="imagePath"
                            name="imagePath"
                            value={product.imagePath}
                            onChange={handleChange}
                            placeholder="Enter image path (e.g., /images/product.jpg)"
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        Create Product
                    </button>
                </form>
                {message && <p className="text-black mt-4 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default CreateProduct;
