import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseList } from '../../components/ExpenseList';
import { Expense, ExpenseCategory } from '../../models/expense';

describe('ExpenseList', () => {
  const mockExpenses: Expense[] = [
    new Expense({
      id: '1',
      date: new Date('2023-01-01'),
      amount: 100,
      vendor: 'Vendor 1',
      category: ExpenseCategory.OFFICE_SUPPLIES,
      notes: 'Note 1',
    }),
    new Expense({
      id: '2',
      date: new Date('2023-01-02'),
      amount: 200,
      vendor: 'Vendor 2',
      category: ExpenseCategory.TRAVEL,
      notes: 'Note 2',
    }),
  ];

  it('should render a list of expenses', () => {
    // Arrange
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    // Act
    render(
      <ExpenseList
        expenses={mockExpenses}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Assert
    expect(screen.getByText('Vendor 1')).toBeInTheDocument();
    expect(screen.getByText('Vendor 2')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
    expect(screen.getByText(ExpenseCategory.OFFICE_SUPPLIES)).toBeInTheDocument();
    expect(screen.getByText(ExpenseCategory.TRAVEL)).toBeInTheDocument();
  });

  it('should display a message when there are no expenses', () => {
    // Arrange
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    // Act
    render(
      <ExpenseList
        expenses={[]}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Assert
    expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    // Arrange
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    // Act
    render(
      <ExpenseList
        expenses={mockExpenses}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Find all edit buttons and click the first one
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    // Assert
    expect(onEdit).toHaveBeenCalledWith(mockExpenses[0]);
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    // Arrange
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    // Act
    render(
      <ExpenseList
        expenses={mockExpenses}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Find all delete buttons and click the first one
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Assert
    expect(window.confirm).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith(mockExpenses[0].id);

    // Restore original window.confirm
    window.confirm = originalConfirm;
  });

  it('should not call onDelete when delete is not confirmed', () => {
    // Arrange
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    // Act
    render(
      <ExpenseList
        expenses={mockExpenses}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Find all delete buttons and click the first one
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Assert
    expect(window.confirm).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();

    // Restore original window.confirm
    window.confirm = originalConfirm;
  });
});
