import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Addresses from '../pages/Addresses';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('Addresses Page', () => {
    const mockAddresses = [
        { _id: '1', country: 'Country 1', state: 'State 1', city: 'City 1', street: 'Street 1', houseNumber: '1' },
        { _id: '2', country: 'Country 2', state: 'State 2', city: 'City 2', street: 'Street 2', houseNumber: '2' },
    ];

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockAddresses });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders addresses', async () => {
        render(
            <Router>
                <Addresses />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Country 1')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Country 2')).toBeInTheDocument();
        });
    });

    test('handles add new address', async () => {
        axios.post.mockResolvedValue({ data: { _id: '3', country: 'Country 3', state: 'State 3', city: 'City 3', street: 'Street 3', houseNumber: '3' } });

        render(
            <Router>
                <Addresses />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'Country 3' } });
        fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State 3' } });
        fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City 3' } });
        fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: 'Street 3' } });
        fireEvent.change(screen.getByPlaceholderText('House Number'), { target: { value: '3' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Address/i }));

        await waitFor(() => {
            expect(screen.getByDisplayValue('Country 3')).toBeInTheDocument();
        });
    });

    test('handles update address', async () => {
        axios.patch.mockResolvedValue({ data: { msg: 'Address updated successfully' } });

        render(
            <Router>
                <Addresses />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Country 1')).toBeInTheDocument();
        });

        fireEvent.change(screen.getAllByDisplayValue('Country 1')[0], { target: { value: 'Updated Country 1' } });
        fireEvent.click(screen.getAllByRole('button', { name: /Update/i })[0]);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Updated Country 1')).toBeInTheDocument();
        });
    });

    test('handles delete address', async () => {
        axios.delete.mockResolvedValue({ data: [] });

        render(
            <Router>
                <Addresses />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Country 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);

        await waitFor(() => {
            expect(screen.queryByDisplayValue('Country 1')).not.toBeInTheDocument();
        });
    });

    test('handles add address error', async () => {
        axios.post.mockRejectedValue({ response: { data: 'There was an error adding the address. Please try again.' } });

        render(
            <Router>
                <Addresses />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'Country 3' } });
        fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State 3' } });
        fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City 3' } });
        fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: 'Street 3' } });
        fireEvent.change(screen.getByPlaceholderText('House Number'), { target: { value: '3' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Address/i }));

        await waitFor(() => {
            expect(screen.getByText('There was an error adding the address. Please try again.')).toBeInTheDocument();
        });
    });
});
