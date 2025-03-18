import { useEffect, useState } from 'react';
import axios from 'axios';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/historic');
                setPurchases(response.data);
            } catch (error) {
                console.error('Error fetching purchases:', error);
            }
        };

        fetchPurchases();
    }, []);

    return (
        <div>
            <h1>Purchase History</h1>
            {purchases.length === 0 ? (
                <p>No purchases found.</p>
            ) : (
                <ul>
                    {purchases.map((purchase) => (
                        <li key={purchase.id}>
                            <p>Product: {purchase.productName}</p>
                            <p>Quantity: {purchase.quantity}</p>
                            <p>Price: ${purchase.price}</p>
                            <p>Date: {new Date(purchase.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Purchases;