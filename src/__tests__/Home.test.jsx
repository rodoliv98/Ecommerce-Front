import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Home from '../pages/Home';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('Home Page', () => {
    const mockProducts = [
        { _id: '1', item: 'Product 1', quantity: 10, price: 100 },
        { _id: '2', item: 'Product 2', quantity: 5, price: 50 },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: { products: mockProducts } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders products', async () => {
        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });
    });

    test('handles search input', async () => {
        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText('Search products...'), { target: { value: 'Product 1' } });

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
        });
    });

    test('handles add to cart', async () => {
        axios.post.mockResolvedValue({ data: 'Product added to cart' });

        render(
            <Router>
                <Home />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Add to Cart')[0]);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/cart', { productId: '1' });
        });
    });
});
