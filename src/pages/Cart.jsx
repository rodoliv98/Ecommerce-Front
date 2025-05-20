import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const accessCookie = document.cookie.split(';').find(cookie => cookie.startsWith('accessToken'));
            console.log(accessCookie);
            if (!accessCookie) {
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
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
            <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">Carrinho</h1>
                    <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:bg-gray-900 transition duration-200">
                        Home
                    </Link>
                </div>
                {cartItems.length === 0 ? (
                    <p className="text-black text-center">Seu carrinho está vazio</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item.productId} className="border-b border-gray-300 pb-4 mb-4">
                            <h2 className="text-xl font-bold text-black mb-2">{item.item}</h2>
                            <p className="text-lg font-semibold text-black">Preço unitário: R${item.price.toFixed(2)}</p>
                            <p className="text-lg font-semibold text-black">Subtotal: R${(item.price * item.quantity).toFixed(2)}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleDecreaseQuantity(item.productId)}
                                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:bg-gray-900 transition duration-200"
                                    >
                                        -
                                    </button>
                                    <span className="text-black text-center w-8">{item.quantity}</span>
                                    <button
                                        onClick={() => handleIncreaseQuantity(item.productId)}
                                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:bg-gray-900 transition duration-200"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveFromCart(item.productId)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 transition duration-200"
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {cartItems.length > 0 && (
                    <div className="mt-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-black">Total: R${calculateTotal().toFixed(2)}</h2>
                        <Link
                            to="/payment"
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 active:bg-green-700 transition duration-200"
                        >
                            Pagamento
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
