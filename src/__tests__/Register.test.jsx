import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Register from '../pages/Register';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('Register Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders register form', () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });

    test('handles form submission successfully', async () => {
        axios.post.mockResolvedValue({ data: 'Account created! Please verify your email to login.' });

        render(
            <Router>
                <Register />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(screen.getByText('Account created! Please verify your email to login.')).toBeInTheDocument();
        });
    });

    test('handles form submission error', async () => {
        axios.post.mockRejectedValue({ response: { data: 'Error creating account' } });

        render(
            <Router>
                <Register />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(screen.getByText('Error creating account')).toBeInTheDocument();
        });
    });
});
