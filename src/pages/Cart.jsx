import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const redirectUser = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cart');
                setCartItems(response.data);
            } catch (error) {
                if (error.response.data === 'Unauthorized') return redirectUser('/login');
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost:3000/cart`, { data: { productId } });
            setCartItems(prevCartItems => prevCartItems.filter(item => item._id !== productId));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        try {
            setCartItems(prevCartItems => prevCartItems.map(item => item._id === productId ? { ...item, quantity: item.quantity - 1 } : item)
                                                       .filter(item => item.quantity > 0));
            await axios.patch(`http://localhost:3000/cart/decrease`, { productId });
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const handleIncreaseQuantity = async (productId) => {
        try {
            setCartItems(prevCartItems => prevCartItems.map(item => item._id === productId ? { ...item, quantity: item.quantity + 1 } : item));
            await axios.patch(`http://localhost:3000/cart/increase`, { productId });
            console.log(cartItems)
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
            <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">Your Cart</h1>
                    <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:bg-gray-900 transition duration-200">
                        Home
                    </Link>
                </div>
                {cartItems.length === 0 ? (
                    <p className="text-black text-center">Your cart is empty.</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item._id} className="border-b border-gray-300 pb-4 mb-4">
                            <h2 className="text-xl font-bold text-black mb-2">{item.item}</h2>
                            <p className="text-lg font-semibold text-black">Price: R${item.price}</p>
                            <p className="text-lg font-semibold text-black">Subtotal: R${(item.price * item.quantity).toFixed(2)}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleDecreaseQuantity(item._id)}
                                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:bg-gray-900 transition duration-200"
                                    >
                                        -
                                    </button>
                                    <span className="text-black text-center w-8">{item.quantity}</span>
                                    <button
                                        onClick={() => handleIncreaseQuantity(item._id)}
                                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:bg-gray-900 transition duration-200"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveFromCart(item._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 transition duration-200"
                                >
                                    <img src="trash.svg" alt="trash icon" className="h-5 w-5 mx-auto" />
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
                            Proceed to Payment
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
