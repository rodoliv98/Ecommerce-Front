import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Confirmation = () => {
    const [purchaseId, setPurchaseId] = useState('');
    const location = useLocation();

    useEffect(() => {
        const state = location.state;
        if (state && state.purchaseId) {
            setPurchaseId(state.purchaseId);
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white text-center">Confirmação da Compra</h1>
                    </div>
                    
                    <div className="p-6 md:p-8 text-center">
                        {purchaseId ? (
                            <div>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Compra Realizada com Sucesso!</h2>
                                <p className="text-gray-600 mb-6">
                                    Obrigado pela sua compra! Seu pedido foi confirmado e está sendo processado.
                                </p>
                                
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-gray-500 mb-1">ID da Compra</p>
                                    <p className="text-lg font-mono font-bold text-blue-600">{purchaseId}</p>
                                </div>
                                
                                <p className="text-sm text-gray-500 mb-6">
                                    Guarde este ID para consultas futuras. Um email de confirmação foi enviado para o seu endereço de email cadastrado.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Informação Indisponível</h2>
                                <p className="text-red-600 mb-6">
                                    ID da compra não encontrado. Por favor, entre em contato com o suporte.
                                </p>
                            </div>
                        )}
                        
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Voltar à Página Inicial
                        </Link>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Precisa de ajuda? Entre em contato com nosso
                        <a href="#" className="text-blue-600 hover:underline ml-1">suporte ao cliente</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
