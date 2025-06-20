import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '/intercepter/intercepter.js'

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const dropdownRef = useRef(null);
    const redirectUser = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/api/v1/products');
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        const loadCartFromLocalStorage = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartCount(cart.length); 
        };

        fetchProducts();
        loadCartFromLocalStorage();
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                await api.get('/api/v1/auth');
                setIsLoggedIn(true);
            } catch (err) {
                if (err.response.status === 401) {
                    const response = await api.post('/api/v1/refresh');
                    if (response.status === 200) {
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                    }
                }
            }
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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddToCart = (productId, price, item, imagePath) => {
        if(!isLoggedIn){
            return redirectUser('/login')
        }
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === productId);

        if (!existingItem) {
            cart.push({ productId, item, price, imagePath, quantity: 1 });
            setCartCount(cartCount + 1);
        } else {
            existingItem.quantity += 1;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const handleLogout = async () => {
            setIsLoggedIn(false);
            setIsMenuOpen(false);
            // Optionally, call a logout API endpoint to clear the cookie
            try {
                await api.post('/api/v1/logout');
            } catch {}
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredProducts = products.filter(product =>
        product.item && product.item.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || product.category === selectedCategory)
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-black border-dashed rounded-full animate-spin"></div>
                    <p className="text-black mt-4">Carregando...</p>
                    <p className="text-black mt-2">Isso pode levar alguns segundos</p>
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
        <div className="min-h-screen bg-white p-8">
            <div className="container mx-auto max-w-4xl flex flex-col space-y-4 mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-black">R-Store</h1>
                    <div className="relative w-1/2 mx-4">
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full p-2 pr-10 rounded text-black placeholder-black border border-black focus:ring-0 focus:border-black"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Link
                                to="/cart"
                                className="flex items-center justify-center text-black px-4 py-2 rounded-lg shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13l-1.5-6M7 13h10m-6 6h.01M13 19h.01" />
                                </svg>
                            </Link>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleMenu}
                                className="flex items-center justify-center text-black px-2 py-2 rounded-lg shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="black">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                                </svg>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-200 rounded shadow-lg">
                                    <Link to="/profile" className="block px-4 py-2 text-black hover:bg-gray-300">
                                        Perfil
                                    </Link>
                                    {isLoggedIn ? (
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-black hover:bg-gray-300"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link to="/login" className="block px-4 py-2 text-black hover:bg-gray-300">
                                            Login
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-black">Categorias:</h2>
                    <button
                        onClick={() => handleCategoryChange('')}
                        className={`px-4 py-2 rounded ${selectedCategory === '' ? 'bg-blue-500 text-white' : 'text-black hover:bg-gray-300'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => handleCategoryChange('Blusas')}
                        className={`px-4 py-2 rounded ${selectedCategory === 'Blusas' ? 'bg-blue-500 text-white' : 'text-black hover:bg-gray-300'}`}
                    >
                        Blusas
                    </button>
                    <button
                        onClick={() => handleCategoryChange('Calças')}
                        className={`px-4 py-2 rounded ${selectedCategory === 'Calças' ? 'bg-blue-500 text-white' : 'text-black hover:bg-gray-300'}`}
                    >
                        Calças
                    </button>
                    <button
                        onClick={() => handleCategoryChange('Bermudas')}
                        className={`px-4 py-2 rounded ${selectedCategory === 'Bermudas' ? 'bg-blue-500 text-white' : 'text-black hover:bg-gray-300'}`}
                    >
                        Bermudas
                    </button>
                    <button
                        onClick={() => handleCategoryChange('Camisetas')}
                        className={`px-4 py-2 rounded ${selectedCategory === 'Camisetas' ? 'bg-blue-500 text-white' : 'text-black hover:bg-gray-300'}`}
                    >
                        Camisetas
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.length === 0 ? (
                    <p className="text-black">Nenhum produto disponível</p>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product._id} className="w-72 mx-auto">
                            <div 
                                className="w-full h-96 flex items-center justify-center rounded-t-lg cursor-pointer" 
                                onClick={() => redirectUser(`/product/${product._id}`)}
                            >
                                <img 
                                    src={product.imagePath} 
                                    alt={product.item} 
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div className="w-full p-4 rounded-b-lg">
                                <h2 className="text-lg font-bold text-black text-left truncate">{product.item}</h2> 
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-lg font-semibold text-black">R${product.price.toFixed(2)}</p> 
                                    <button
                                        onClick={() => handleAddToCart(product._id, product.price, product.item, product.imagePath)}
                                        className="text-black"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative" fill="none" viewBox="0 0 24 24" stroke="black">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13l-1.5-6M7 13h10m-6 6h.01M13 19h.01" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v4m2-2h-4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;