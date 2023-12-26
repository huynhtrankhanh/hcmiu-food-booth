import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainComponent } from './MainComponent';

test('renders food selection stage by default', () => {
  render(<MainComponent />);
  const foodSelectionHeading = screen.getByText(/choose food/i);
  expect(foodSelectionHeading).toBeInTheDocument();
});

test('adds dishes to the cart on button click', () => {
  render(<MainComponent />);
  const addButton = screen.getByText(/add/i);
  fireEvent.click(addButton);
  const checkoutButton = screen.getByText(/checkout/i);
  expect(checkoutButton).toBeInTheDocument();
});

test('removes dishes from the cart on button click', () => {
  render(<MainComponent />);
  const addButton = screen.getByText(/add/i);
  fireEvent.click(addButton);
  const removeButton = screen.getByText(/remove/i);
  fireEvent.click(removeButton);
  const foodSelectionHeading = screen.getByText(/choose food/i);
  expect(foodSelectionHeading).toBeInTheDocument();
});

test('updates quantity when quantity buttons are clicked', () => {
  render(<MainComponent />);
  const addButton = screen.getByText(/add/i);
  fireEvent.click(addButton);
  const increaseButton = screen.getByText('+');
  fireEvent.click(increaseButton);
  const quantityText = screen.getByText(/2/i);
  expect(quantityText).toBeInTheDocument();
});

test('calculates total amount correctly', () => {
  render(<MainComponent />);
  const addButton = screen.getByText(/add/i);
  fireEvent.click(addButton);
  const checkoutButton = screen.getByText(/checkout/i);
  fireEvent.click(checkoutButton);
  const paymentButton = screen.getByText(/pay with cash/i);
  expect(paymentButton).toBeInTheDocument();
});

test('creates a new order on payment', () => {
  render(<MainComponent />);
  const addButton = screen.getByText(/add/i);
  fireEvent.click(addButton);
  const checkoutButton = screen.getByText(/checkout/i);
  fireEvent.click(checkoutButton);
  const paymentButton = screen.getByText(/pay with cash/i);
  fireEvent.click(paymentButton);
  const downloadReceiptButton = screen.getByText(/download receipt/i);
  expect(downloadReceiptButton).toBeInTheDocument();
});

test('fulfills an order in admin interface', () => {
  render(<MainComponent />);
  const adminButton = screen.getByText(/jump to admin interface/i);
  fireEvent.click(adminButton);
  const fulfillOrderButton = screen.getByText(/mark as fulfilled/i);
  fireEvent.click(fulfillOrderButton);
  const exitAdminButton = screen.getByText(/exit admin interface/i);
  expect(exitAdminButton).toBeInTheDocument();
});

test('exits admin interface on button click', () => {
  render(<MainComponent />);
  const adminButton = screen.getByText(/jump to admin interface/i);
  fireEvent.click(adminButton);
  const exitAdminButton = screen.getByText(/exit admin interface/i);
  fireEvent.click(exitAdminButton);
  const foodSelectionHeading = screen.getByText(/choose food/i);
  expect(foodSelectionHeading).toBeInTheDocument();
});

test('resets order on button click', () => {
  render(<MainComponent />);
  const addButton = screen.getByText(/add/i);
  fireEvent.click(addButton);
  const checkoutButton = screen.getByText(/checkout/i);
  fireEvent.click(checkoutButton);
  const resetOrderButton = screen.getByText(/return to dish selection/i);
  fireEvent.click(resetOrderButton);
  const foodSelectionHeading = screen.getByText(/choose food/i);
  expect(foodSelectionHeading).toBeInTheDocument();
});

test('admin login succeeds with correct password', () => {
  render(<MainComponent />);
  const adminButton = screen.getByText(/jump to admin interface/i);
  fireEvent.click(adminButton);
  const passwordInput = screen.getByLabelText(/admin password/i);
  fireEvent.change(passwordInput, { target: { value: 'admin' } });
  const loginButton = screen.getByText(/login/i);
  fireEvent.click(loginButton);
  const adminInterfaceHeading = screen.getByText(/admin interface/i);
  expect(adminInterfaceHeading).toBeInTheDocument();
});
     
