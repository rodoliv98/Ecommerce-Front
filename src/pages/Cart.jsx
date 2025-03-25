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
                const response = await axios.get('https://e-commerce-api-akwz.onrender.com/cart');
                setCartItems(response.data);
            } catch (error) {
                if (error.response.data === 'Unauthorized') return redirectUser('/login');
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`https://e-commerce-api-akwz.onrender.com/cart`, { data: { productId } });
            setCartItems(cartItems.filter(item => item._id !== productId));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        try {
            const updatedCart = cartItems.map(item =>
                item._id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0);

            const updatedItem = updatedCart.find(item => item._id === productId);
            if (updatedItem) {
                await axios.patch(`https://e-commerce-api-akwz.onrender.com/cart/decrease`, { productId });
            }

            setCartItems(updatedCart);
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const handleIncreaseQuantity = async (productId) => {
        try {
            const response = await axios.patch(`https://e-commerce-api-akwz.onrender.com/cart/increase`, { productId });
            const updatedCart = cartItems.map(item =>
                item._id === productId ? { ...item, quantity: response.data.product.quantity } : item
            );
            setCartItems(updatedCart);
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Cart</h1>
                <Link to="/" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                    Home
                </Link>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                {cartItems.length === 0 ? (
                    <p className="text-white">No items in cart</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item._id} className="border-b border-gray-700 pb-4 mb-4">
                            <h2 className="text-xl font-bold text-white mb-2">{item.item}</h2>
                            <p className="text-lg font-semibold text-white">Price: R${item.price}</p>
                            <p className="text-lg font-semibold text-white">Subtotal: R${(item.price * item.quantity).toFixed(2)}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleDecreaseQuantity(item._id)}
                                        className="bg-white text-black p-2 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="text-white text-center w-8">{item.quantity}</span>
                                    <button
                                        onClick={() => handleIncreaseQuantity(item._id)}
                                        className="bg-white text-black p-2 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveFromCart(item._id)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 active:bg-red-700 w-10"
                                >
                                    <img src="trash.svg" alt="trash icon" className="h-5 w-5 mx-auto" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {cartItems.length > 0 && (
                    <div className="mt-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Total: R${calculateTotal().toFixed(2)}</h2>
                        <Link
                            to="/payment"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700"
                        >
                            Pay Now
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
