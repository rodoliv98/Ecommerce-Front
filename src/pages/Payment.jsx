import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Payment = () => {
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        cpf: '',
        birthDate: '',
        street: '',
        city: '',
        state: '',
        country: '',
        cep: '',
        cardNumber: '',
        currency: 'USD',
    });
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('https://e-commerce-api-akwz.onrender.com/cart');
                setCartItems(response.data);
                const totalCost = response.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
                setTotal(totalCost);
            } catch (error) {
                if (error.response?.data === 'Unauthorized') navigate('/login');
            }
        };

        fetchCartItems();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const formattedValue = value
                .replace(/\D/g, '')
                .slice(0, 16)
                .replace(/(\d{4})(?=\d)/g, '$1.');
            setFormData({
                ...formData,
                [name]: formattedValue,
            });
        } else if (name === 'cpf') {
            const formattedCPF = value
                .replace(/\D/g, '')
                .slice(0, 11)
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
            setFormData({
                ...formData,
                [name]: formattedCPF,
            });
        } else if (name === 'cep') {
            const formattedCEP = value
                .replace(/\D/g, '')
                .slice(0, 8)
                .replace(/(\d{5})(\d)/, '$1-$2');
            setFormData({
                ...formData,
                [name]: formattedCEP,
            });
        } else if (name === 'birthDate') {
            const formattedBirthDate = value
                .replace(/\D/g, '')
                .slice(0, 8)
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d)/, '$1/$2');
            setFormData({
                ...formData,
                [name]: formattedBirthDate,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                ...formData,
                total,
                cart: cartItems.map(item => ({
                    _id: item._id,
                    item: item.item,
                    price: item.price,
                    quantity: item.quantity,
                })),
            };
            const response = await axios.post('https://e-commerce-api-akwz.onrender.com/cart/payment', payload);
            if (response.data.purchaseID) {
                navigate('/confirmation', { state: { purchaseId: response.data.purchaseID } });
            }
        } catch (error) {
            setError('An error occurred while processing your payment. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-4xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">Payment</h1>
                    <Link to="/cart" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition duration-200">
                        Back to Cart
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-black mb-4">Personal Information</h2>
                    <div>
                        <label htmlFor="fullName" className="block text-black font-semibold mb-2">Full Name:</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="block text-black font-semibold mb-2">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            placeholder="Enter your CPF"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="birthDate" className="block text-black font-semibold mb-2">Birthdate:</label>
                        <input
                            type="text"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            placeholder="Enter your birthdate (DD/MM/YYYY)"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-4">Address</h2>
                    <div>
                        <label htmlFor="country" className="block text-black font-semibold mb-2">Country:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Enter your country"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-black font-semibold mb-2">State:</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Enter your state"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-black font-semibold mb-2">City:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-black font-semibold mb-2">Street:</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Enter your street"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="houseNumber" className="block text-black font-semibold mb-2">House Number:</label>
                        <input
                            type="text"
                            id="houseNumber"
                            name="houseNumber"
                            value={formData.houseNumber || ''}
                            onChange={handleChange}
                            placeholder="Enter your house number"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="cep" className="block text-black font-semibold mb-2">CEP:</label>
                        <input
                            type="text"
                            id="cep"
                            name="cep"
                            value={formData.cep}
                            onChange={handleChange}
                            placeholder="Enter your CEP"
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-4">Payment Details</h2>
                    <div>
                        <label htmlFor="cardNumber" className="block text-black font-semibold mb-2">Card Number:</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="currency" className="block text-black font-semibold mb-2">Currency:</label>
                        <select
                            id="currency"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            required
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="BRL">BRL</option>
                        </select>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-black">Total Cost: R${total.toFixed(2)}</h2>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        Submit Payment
                    </button>
                    {error && <p className="text-black mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Payment;
