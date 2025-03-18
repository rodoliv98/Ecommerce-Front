import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Recovery from '../pages/Recovery';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('Recovery Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders recovery form', () => {
        render(<Recovery />);

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send Recovery Email/i })).toBeInTheDocument();
    });

    test('handles form submission successfully', async () => {
        axios.post.mockResolvedValue({ data: 'Recovery email sent successfully' });

        render(<Recovery />);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: /Send Recovery Email/i }));

        await waitFor(() => {
            expect(screen.getByText('Recovery email sent successfully')).toBeInTheDocument();
        });
    });

    test('handles form submission error', async () => {
        axios.post.mockRejectedValue({ response: { data: 'Error sending recovery email' } });

        render(<Recovery />);

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: /Send Recovery Email/i }));

        await waitFor(() => {
            expect(screen.getByText('Error sending recovery email')).toBeInTheDocument();
        });
    });
});
