import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseForm } from '../../components/ExpenseForm';
import { ExpenseCategory } from '../../models/expense';

describe('ExpenseForm', () => {
  it('should render the form with empty fields', () => {
    // Arrange
    const onSubmit = vi.fn();

    // Act
    render(<ExpenseForm onSubmit={onSubmit} />);

    // Assert
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vendor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should render the form with initial values when editing', () => {
    // Arrange
    const onSubmit = vi.fn();
    const initialValues = {
      date: new Date('2023-01-01'),
      amount: 100,
      vendor: 'Test Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
      notes: 'Test notes',
    };

    // Act
    render(<ExpenseForm onSubmit={onSubmit} initialValues={initialValues} />);

    // Assert
    expect(screen.getByLabelText(/date/i)).toHaveValue('2023-01-01');
    expect(screen.getByLabelText(/amount/i)).toHaveValue(100);
    expect(screen.getByLabelText(/vendor/i)).toHaveValue('Test Vendor');
    expect(screen.getByLabelText(/category/i)).toHaveValue(ExpenseCategory.OFFICE_SUPPLIES);
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Test notes');
  });

  it('should validate required fields on submit', async () => {
    // Arrange
    const onSubmit = vi.fn();

    // Act
    render(<ExpenseForm onSubmit={onSubmit} />);

    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Assert
    expect(screen.getByText(/date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    expect(screen.getByText(/vendor is required/i)).toBeInTheDocument();
    expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when valid', () => {
    // Arrange
    const onSubmit = vi.fn();
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Act
    render(<ExpenseForm onSubmit={onSubmit} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: today } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/vendor/i), { target: { value: 'Test Vendor' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: ExpenseCategory.OFFICE_SUPPLIES } });
    fireEvent.change(screen.getByLabelText(/notes/i), { target: { value: 'Test notes' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      date: expect.any(Date),
      amount: 100,
      vendor: 'Test Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
      notes: 'Test notes',
    });
  });
});
