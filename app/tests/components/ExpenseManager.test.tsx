import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseManager } from '../../components/ExpenseManager';
import { ExpenseService } from '../../models/expenseService';
import { ExpenseCategory } from '../../models/expense';

// Mock the ExpenseService
vi.mock('../../models/expenseService', () => {
  const mockGetExpenses = vi.fn().mockResolvedValue([]);
  const mockAddExpense = vi.fn().mockImplementation(async (data) => ({
    id: 'mock-id',
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const mockUpdateExpense = vi.fn().mockImplementation(async (id, data) => ({
    id,
    ...data,
    updatedAt: new Date(),
  }));
  const mockDeleteExpense = vi.fn().mockResolvedValue(true);

  return {
    ExpenseService: vi.fn().mockImplementation(() => ({
      getExpenses: mockGetExpenses,
      addExpense: mockAddExpense,
      updateExpense: mockUpdateExpense,
      deleteExpense: mockDeleteExpense,
    })),
  };
});

describe('ExpenseManager', () => {
  let expenseService: ExpenseService;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Create a new instance of ExpenseService
    expenseService = new ExpenseService();
  });

  it('should render the expense form and empty list initially', async () => {
    // Act
    render(<ExpenseManager />);

    // Assert
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vendor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();

    // Wait for the expenses to load
    await waitFor(() => {
      expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
    });

    // Verify the service was called
    expect(expenseService.getExpenses).toHaveBeenCalled();
  });

  it('should add a new expense when the form is submitted', async () => {
    // Act
    render(<ExpenseManager />);

    // Fill out the form
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: today } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/vendor/i), { target: { value: 'Test Vendor' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: ExpenseCategory.OFFICE_SUPPLIES } });
    fireEvent.change(screen.getByLabelText(/notes/i), { target: { value: 'Test notes' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Assert
    await waitFor(() => {
      expect(expenseService.addExpense).toHaveBeenCalledWith({
        date: expect.any(Date),
        amount: 100,
        vendor: 'Test Vendor',
        category: ExpenseCategory.OFFICE_SUPPLIES,
        notes: 'Test notes',
      });
    });

    // Verify the expenses are reloaded
    expect(expenseService.getExpenses).toHaveBeenCalledTimes(2);
  });

  it('should show validation errors when submitting an invalid form', async () => {
    // Act
    render(<ExpenseManager />);

    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/vendor is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });

    // Verify the service was not called
    expect(expenseService.addExpense).not.toHaveBeenCalled();
  });
});
