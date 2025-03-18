import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cart from '../pages/Cart';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Cart Page', () => {
    const mockCartItems = [
        { _id: '1', item: 'Product 1', price: 10, quantity: 1 },
        { _id: '2', item: 'Product 2', price: 20, quantity: 2 },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockCartItems });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders cart items', async () => {
        render(
            <Router>
                <Cart />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });
    });

    test('handles remove from cart', async () => {
        axios.delete.mockResolvedValue({ data: [] });

        render(
            <Router>
                <Cart />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Remove from Cart')[0]);

        await waitFor(() => {
            expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
        });
    });

    test('handles decrease quantity', async () => {
        axios.patch.mockResolvedValue({ data: { quantity: 1 } });

        render(
            <Router>
                <Cart />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('-')[1]);

        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });

    test('handles increase quantity', async () => {
        axios.patch.mockResolvedValue({ data: { quantity: 3 } });

        render(
            <Router>
                <Cart />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('+')[1]);

        await waitFor(() => {
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });

    test('redirects to login if not logged in', async () => {
        axios.get.mockRejectedValue({ response: { data: 'Please login' } });

        render(
            <Router>
                <Cart />
            </Router>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
});