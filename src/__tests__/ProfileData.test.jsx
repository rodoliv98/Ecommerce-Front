import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ProfileData from '../pages/ProfileData';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('ProfileData Page', () => {
    const mockProfileData = {
        findProfile: {
            fullName: 'John Doe',
            birthDate: '1990-01-01',
            cpf: '123.456.789-00'
        }
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
                <ProfileData />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Birthdate/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
            expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
            expect(screen.getByDisplayValue('123.456.789-00')).toBeInTheDocument();
        });
    });

    test('handles form submission successfully', async () => {
        axios.patch.mockResolvedValue({ data: { msg: 'Profile updated successfully' } });

        render(
            <Router>
                <ProfileData />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText(/Birthdate/i), { target: { value: '1991-01-01' } });
        fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '987.654.321-00' } });

        fireEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
            expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
        });
    });

    test('handles form submission error', async () => {
        axios.patch.mockRejectedValue({ response: { data: 'Error updating profile' } });

        render(
            <Router>
                <ProfileData />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText(/Birthdate/i), { target: { value: '1991-01-01' } });
        fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '987.654.321-00' } });

        fireEvent.click(screen.getByRole('button', { name: /Save/i }));

        await waitFor(() => {
            expect(screen.getByText('Error updating profile')).toBeInTheDocument();
        });
    });
});
