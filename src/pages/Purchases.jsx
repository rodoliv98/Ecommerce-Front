import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '/intercepter/intercepter.js';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/user/historic');
            if (Array.isArray(response.data)) {
                setPurchases(response.data); 
            }
        } catch (err) {
            if(err.response?.status === 401){
                navigate('/login');
            }
            setError('Ocorreu um erro ao buscar o histórico de compras. Tente novamente.'); 
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'concluído':
            case 'concluido':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pendente':
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelado':
            case 'cancelled':
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'em processamento':
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Histórico de Compras</h1>
                        <div className="flex space-x-3">
                            <Link to="/" className="flex items-center px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Home
                            </Link>
                            <Link to="/profile" className="flex items-center px-3 py-1 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Perfil
                            </Link>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        ) : purchases.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma compra encontrada</h3>
                                <p className="text-gray-500 mb-6">Você ainda não realizou nenhuma compra.</p>
                                <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Explorar produtos
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {purchases.map((purchase) => (
                                    <div key={purchase.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                            <div className="flex flex-wrap justify-between items-center">
                                                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                                    <h2 className="text-lg font-semibold text-gray-900">Pedido #{purchase.id}</h2>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                                                        {purchase.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(purchase.date)}
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {formatCurrency(purchase.total)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="px-6 py-4">
                                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Itens do pedido</h3>
                                            <div className="divide-y divide-gray-200">
                                                {purchase.cart.map((item, index) => (
                                                    <div key={index} className="py-3 flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3 text-gray-500">
                                                                {item.quantity}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{item.item}</p>
                                                                <p className="text-sm text-gray-500">{formatCurrency(item.price)} cada</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                                            <div className="text-sm text-gray-500">
                                                {purchase.cart.reduce((acc, item) => acc + item.quantity, 0)} itens
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                    Comprar novamente
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Purchases;