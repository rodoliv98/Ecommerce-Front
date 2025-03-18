import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const redirectUser = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://e-commerce-api-akwz.onrender.com/products');
                setProducts(response.data.products || response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddToCart = async (productId) => {
        try {
            await axios.post('https://e-commerce-api-akwz.onrender.com/cart', { productId });
        } catch (error) {
            if (error.response.data === 'Please login') return redirectUser('/login');
        }
    };

    const filteredProducts = products.filter(product =>
        product.item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Products</h1>
                <div className="flex space-x-4">
                    <Link to="/profile" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                        Profile
                    </Link>
                    <Link to="/cart" className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 active:bg-yellow-700">
                        Cart
                    </Link>
                    <Link to="/login" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 active:bg-green-700">
                        Login
                    </Link>
                </div>
            </div>
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.length === 0 ? (
                    <p className="text-white">No products available</p>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-white mb-2">{product.item}</h2>
                            <p className="text-gray-400 mb-4">Quantity: {product.quantity}</p>
                            <p className="text-lg font-semibold text-white">Price: R${product.price}</p>
                            <button
                                onClick={() => handleAddToCart(product._id)}
                                className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;