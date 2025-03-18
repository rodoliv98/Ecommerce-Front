import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ChangePassword from '../pages/ChangePassword';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('ChangePassword Page', () => {
    const mockToken = 'mockToken';

    beforeEach(() => {
        jest.clearAllMocks();
        window.history.pushState({}, 'Test page', `/change-password?token=${mockToken}`);
    });

    test('renders change password form', () => {
        render(
            <Router>
                <ChangePassword />
            </Router>
        );

        expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change Password/i })).toBeInTheDocument();
    });

    test('handles form submission successfully', async () => {
        axios.post.mockResolvedValue({ data: 'Password changed successfully' });

        render(
            <Router>
                <ChangePassword />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpassword123' } });
        fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

        await waitFor(() => {
            expect(screen.getByText('Password changed successfully')).toBeInTheDocument();
        });
    });

    test('handles form submission error', async () => {
        axios.post.mockRejectedValue({ response: { data: 'Error changing password' } });

        render(
            <Router>
                <ChangePassword />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpassword123' } });
        fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

        await waitFor(() => {
            expect(screen.getByText('Error changing password')).toBeInTheDocument();
        });
    });
});
