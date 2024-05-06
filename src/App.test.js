import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
const axios = require('axios');
import App from './App';

jest.mock('axios');

describe('App component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        name: 'Classic Tee',
        price: 75,
        description: 'A comfortable and stylish t-shirt.',
      },
    });
  });

  it('renders the product details correctly', async () => {
    render(<App />);
    expect(await screen.findByText('Classic Tee')).toBeInTheDocument();
    expect(screen.getByText('$75')).toBeInTheDocument();
    expect(screen.getByText('A comfortable and stylish t-shirt.')).toBeInTheDocument();
  });

  it('adds an item to the cart when a size is selected', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('M'));
    fireEvent.click(screen.getByText('ADD TO CART'));
    expect(await screen.findByText('Classic Tee (M) - $75 x 1')).toBeInTheDocument();
  });

  it('displays an alert when no size is selected', async () => {
    render(<App />);
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    fireEvent.click(screen.getByText('ADD TO CART'));
    expect(alertMock).toHaveBeenCalledWith('Please select a size.');
    alertMock.mockRestore();
  });

  it('clears the cart when the "Clear Cart" button is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('M'));
    fireEvent.click(screen.getByText('ADD TO CART'));
    fireEvent.click(screen.getByText('Cart (1)'));
    fireEvent.click(screen.getByText('Clear Cart'));
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });
});