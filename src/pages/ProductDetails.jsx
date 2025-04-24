import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '/intercepter/intercepter.js';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const dropdownRef = useRef(null);
    const redirectUser = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await api.get(`/products/${productId}`);
                setProduct(response.data.product);
            } catch (err) {
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        const fetchCartCount = async () => {
                const cart = localStorage.getItem('cart');
                const parsedCart = JSON.parse(cart);
                setCartCount(parsedCart.length);
        };
        fetchCartCount();
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('loginToken');
            if(!token) redirectUser('/login');

            setIsLoggedIn(true)
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
            localStorage.removeItem('loginToken');
            setIsLoggedIn(false);
            setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleAddToCart = async (productId, price, item) => {
        const token = localStorage.getItem('loginToken');
        if(!token) redirectUser('/login');

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === productId);

        if(!existingItem){
            cart.push({ productId, item, price, quantity: 1 });
            setCartCount(cartCount + 1);
        } else {
            existingItem.quantity += 1;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const handleQuantityChange = (change) => {
        setQuantity((prev) => Math.max(1, prev + change));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-black border-dashed rounded-full animate-spin"></div>
                    <p className="text-black mt-4">Carregando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Voltar para a loja
                    </Link>
                    
                    <Link to="/" className="text-3xl font-bold text-black">R-Store</Link>
                    
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Link to="/cart" className="flex items-center justify-center text-black px-4 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13l-1.5-6M7 13h10m-6 6h.01M13 19h.01" />
                                </svg>
                            </Link>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={toggleMenu} className="flex items-center justify-center text-black px-2 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                                </svg>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-200 rounded shadow-lg">
                                    <Link to="/profile" className="block px-4 py-2 text-black hover:bg-gray-300">Perfil</Link>
                                    {isLoggedIn ? (
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-black hover:bg-gray-300">
                                            Logout
                                        </button>
                                    ) : (
                                        <Link to="/login" className="block px-4 py-2 text-black hover:bg-gray-300">Login</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={product.imagePath || product.image || ''}
                                    alt={product.item}
                                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{product.item}</h1>
                                <p className="text-4xl font-bold text-blue-600">
                                    R${product.price || product.cost || 'N/A'}
                                </p>
                            </div>

                            <div className="border-t border-b border-gray-200 py-4">
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border rounded-lg px-3 py-2">
                                        <button 
                                            onClick={() => handleQuantityChange(-1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            className="w-16 text-center border-none focus:ring-0" 
                                            value={quantity} 
                                            readOnly 
                                        />
                                        <button 
                                            onClick={() => handleQuantityChange(1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Entrega grátis</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Suporte 24 horas</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product._id, product.price, product.item)}
                                    className="w-full bg-blue-800 text-white px-6 py-4 rounded-lg hover:bg-blue-700 active:bg-blue-900 transition duration-200 flex items-center justify-center space-x-2 font-semibold mt-4"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Adicionar ao carrinho</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
