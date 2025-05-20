import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '/intercepter/intercepter.js'

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                await api.get('/api/v1/auth');
            } catch {
                navigate('/login');
            }
        };
        
        const loadCartFromLocalStorage = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(cart);
        };

        loadCartFromLocalStorage();
        checkLoginStatus();
    }, []);

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleDecreaseQuantity = (productId) => {
        const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        ).filter(item => item.quantity > 0);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleIncreaseQuantity = (productId) => {
        const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6 md:p-8">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Seu Carrinho</h1>
                        <Link to="/" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition duration-200 font-medium shadow-sm">
                            Continuar Comprando
                        </Link>
                    </div>
                    
                    <div className="p-6">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-lg mb-6">Seu carrinho está vazio</p>
                                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                                    Explorar Produtos
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {cartItems.map(item => (
                                    <div key={item.productId} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex-1 mb-4 md:mb-0">
                                            <div className="flex items-start">
                                                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg> */}
                                                    <img src={item.imagePath} alt={item.item} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-800 mb-1">{item.item}</h2>
                                                    <p className="text-gray-600 text-sm">Preço unitário: <span className="font-medium">R${item.price.toFixed(2)}</span></p>
                                                    <p className="text-blue-600 font-medium mt-1">Subtotal: R${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end md:space-x-6">
                                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item.productId)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                                                    aria-label="Diminuir quantidade"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="text-gray-800 font-medium w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncreaseQuantity(item.productId)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                                                    aria-label="Aumentar quantidade"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromCart(item.productId)}
                                                className="text-red-600 hover:text-red-800 transition flex items-center"
                                                aria-label="Remover item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span className="ml-1 hidden sm:inline">Remover</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {cartItems.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <p className="text-gray-600">Total de itens: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                                        <h3 className="text-2xl font-bold text-gray-800 mt-1">Total: R${calculateTotal().toFixed(2)}</h3>
                                    </div>
                                    <Link
                                        to="/payment"
                                        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-center font-medium shadow-md"
                                    >
                                        Finalizar Compra
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {cartItems.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações importantes</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-gray-600">Frete grátis para compras acima de R$100,00</p>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-gray-600">Pagamento seguro com criptografia de dados</p>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-gray-600">Garantia de 30 dias em todos os produtos</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
