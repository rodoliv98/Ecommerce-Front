import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import EmailConfirmed from '../pages/EmailConfirmed';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('EmailConfirmed Page', () => {
    const mockToken = 'mockToken';

    beforeEach(() => {
        jest.clearAllMocks();
        window.history.pushState({}, 'Test page', `/email-confirmed?token=${mockToken}`);
    });

    test('renders email confirmation message successfully', async () => {
        axios.post.mockResolvedValue({ data: 'Email confirmed successfully' });

        render(
            <Router>
                <EmailConfirmed />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Email confirmed successfully')).toBeInTheDocument();
        });
    });

    test('handles email confirmation error', async () => {
        axios.post.mockRejectedValue({ response: { data: 'Error confirming email' } });

        render(
            <Router>
                <EmailConfirmed />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Error confirming email')).toBeInTheDocument();
        });
    });
});
