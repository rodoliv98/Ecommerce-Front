import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '/intercepter/intercepter.js'

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
        currency: 'BRL',
    });
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadCartFromLocalStorage = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(cart);
            const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotal(totalCost);
        };

        loadCartFromLocalStorage();
    }, []);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                await api.get('/api/v1/auth');
            } catch {
                navigate('/login');
            }
        }

        checkLogin();
    }, [])

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
                cart: cartItems,
            };
            const response = await api.post('/api/v1/purchase', payload);
            if (response.data.purchaseId) {
                localStorage.removeItem('cart');
                navigate('/confirmation', { state: { purchaseId: response.data.purchaseId } });
            }
        } catch (error) {
            if(error.response.status === 401){
                navigate('/login');
            }
            setError('An error occurred while processing your payment. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header with logo and navigation */}
                <div className="flex justify-between items-center mb-8">
                    <div className="text-2xl font-bold text-blue-600">R-Store</div>
                    <Link to="/cart" className="text-blue-600 hover:text-blue-800 flex items-center transition duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar para o carrinho
                    </Link>
                </div>
                
                {/* Main content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Finalizar Compra</h1>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        {/* Order summary for desktop */}
                        {cartItems.length > 0 && (
                            <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
                                <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Resumo do Pedido
                                </h2>
                                <div className="space-y-2">
                                    {cartItems.map(item => (
                                        <div key={item.productId} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{item.quantity}x {item.item}</span>
                                            <span className="font-medium text-gray-800">R${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-blue-200 pt-2 mt-2">
                                        <div className="flex justify-between font-bold">
                                            <span className="text-gray-800">Total</span>
                                            <span className="text-blue-700">R${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
                                        <span>1</span>
                                    </div>
                                    Informações Pessoais
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Nome completo</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Seu nome completo"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cpf" className="block text-gray-700 font-medium mb-1">CPF</label>
                                        <input
                                            type="text"
                                            id="cpf"
                                            name="cpf"
                                            value={formData.cpf}
                                            onChange={handleChange}
                                            placeholder="000.000.000-00"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="birthDate" className="block text-gray-700 font-medium mb-1">Data de nascimento</label>
                                        <input
                                            type="text"
                                            id="birthDate"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            placeholder="DD/MM/AAAA"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Address Information */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
                                        <span>2</span>
                                    </div>
                                    Endereço de Entrega
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="country" className="block text-gray-700 font-medium mb-1">País</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="Brasil"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-gray-700 font-medium mb-1">Estado</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Estado"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-gray-700 font-medium mb-1">Cidade</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Cidade"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cep" className="block text-gray-700 font-medium mb-1">CEP</label>
                                        <input
                                            type="text"
                                            id="cep"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleChange}
                                            placeholder="00000-000"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="street" className="block text-gray-700 font-medium mb-1">Rua</label>
                                        <input
                                            type="text"
                                            id="street"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            placeholder="Nome da rua"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="houseNumber" className="block text-gray-700 font-medium mb-1">Número</label>
                                        <input
                                            type="text"
                                            id="houseNumber"
                                            name="houseNumber"
                                            value={formData.houseNumber || ''}
                                            onChange={handleChange}
                                            placeholder="Número da casa"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Payment Information */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
                                        <span>3</span>
                                    </div>
                                    Informações de Pagamento
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-1">Número do cartão</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleChange}
                                                placeholder="0000.0000.0000.0000"
                                                required
                                                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                            />
                                            <div className="absolute left-3 top-2.5 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="currency" className="block text-gray-700 font-medium mb-1">Moeda</label>
                                        <select
                                            id="currency"
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                        >
                                            <option value="BRL">Real Brasileiro (BRL)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Total and Submit */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <p className="text-gray-600">Total de itens: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                                        <h3 className="text-2xl font-bold text-gray-800">Total: R${total.toFixed(2)}</h3>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium shadow-md flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Finalizar Compra
                                    </button>
                                </div>
                                
                                {error && (
                                    <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                        <div className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-red-700">{error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                        
                        {/* Security Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-800">Pagamento 100% Seguro</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Seus dados estão protegidos e a transação é criptografada.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
