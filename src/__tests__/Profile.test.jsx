import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Profile from '../pages/Profile';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('Profile Page', () => {
    const mockProfileData = {
        msg: 'John',
        email: 'john.doe@example.com'
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockProfileData });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders profile data', async () => {
        render(
            <Router>
                <Profile />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
            expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
        });
    });

    test('redirect buttons work correctly', async () => {
        render(
            <Router>
                <Profile />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Purchases'));
        expect(window.location.pathname).toBe('/my-orders');

        fireEvent.click(screen.getByText('Profile Data'));
        expect(window.location.pathname).toBe('/profile-data');

        fireEvent.click(screen.getByText('Addresses'));
        expect(window.location.pathname).toBe('/profile-address');
    });
});
