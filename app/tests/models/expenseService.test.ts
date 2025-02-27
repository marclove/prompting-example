import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExpenseService } from '../../models/expenseService';
import { Expense, ExpenseCategory } from '../../models/expense';

describe('ExpenseService', () => {
  let expenseService: ExpenseService;

  beforeEach(() => {
    // Create a new instance of ExpenseService before each test
    expenseService = new ExpenseService();
  });

  it('should add a new expense', async () => {
    // Arrange
    const expenseData = {
      date: new Date(),
      amount: 100,
      vendor: 'Test Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
      notes: 'Test notes',
    };

    // Act
    const expense = await expenseService.addExpense(expenseData);

    // Assert
    expect(expense).toBeInstanceOf(Expense);
    expect(expense.id).toBeDefined();
    expect(expense.vendor).toBe(expenseData.vendor);
    expect(expense.amount).toBe(expenseData.amount);
    expect(expense.category).toBe(expenseData.category);
    expect(expense.notes).toBe(expenseData.notes);

    // Verify the expense was added to the service
    const expenses = await expenseService.getExpenses();
    expect(expenses).toHaveLength(1);
    expect(expenses[0].id).toBe(expense.id);
  });

  it('should get all expenses', async () => {
    // Arrange
    const expense1 = await expenseService.addExpense({
      date: new Date(),
      amount: 100,
      vendor: 'Vendor 1',
      category: ExpenseCategory.OFFICE_SUPPLIES,
    });

    const expense2 = await expenseService.addExpense({
      date: new Date(),
      amount: 200,
      vendor: 'Vendor 2',
      category: ExpenseCategory.TRAVEL,
    });

    // Act
    const expenses = await expenseService.getExpenses();

    // Assert
    expect(expenses).toHaveLength(2);
    expect(expenses.map(e => e.id)).toContain(expense1.id);
    expect(expenses.map(e => e.id)).toContain(expense2.id);
  });

  it('should get an expense by id', async () => {
    // Arrange
    const expense = await expenseService.addExpense({
      date: new Date(),
      amount: 100,
      vendor: 'Test Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
    });

    // Act
    const retrievedExpense = await expenseService.getExpenseById(expense.id);

    // Assert
    expect(retrievedExpense).toBeDefined();
    expect(retrievedExpense?.id).toBe(expense.id);
  });

  it('should return null when getting a non-existent expense', async () => {
    // Act
    const retrievedExpense = await expenseService.getExpenseById('non-existent-id');

    // Assert
    expect(retrievedExpense).toBeNull();
  });

  it('should update an expense', async () => {
    // Arrange
    const expense = await expenseService.addExpense({
      date: new Date(),
      amount: 100,
      vendor: 'Original Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
    });

    const updateData = {
      amount: 200,
      vendor: 'Updated Vendor',
      category: ExpenseCategory.TRAVEL,
    };

    // Act
    const updatedExpense = await expenseService.updateExpense(expense.id, updateData);

    // Assert
    expect(updatedExpense).toBeDefined();
    expect(updatedExpense?.amount).toBe(updateData.amount);
    expect(updatedExpense?.vendor).toBe(updateData.vendor);
    expect(updatedExpense?.category).toBe(updateData.category);

    // Verify the expense was updated in the service
    const retrievedExpense = await expenseService.getExpenseById(expense.id);
    expect(retrievedExpense?.amount).toBe(updateData.amount);
  });

  it('should return null when updating a non-existent expense', async () => {
    // Act
    const updatedExpense = await expenseService.updateExpense('non-existent-id', {
      amount: 200,
    });

    // Assert
    expect(updatedExpense).toBeNull();
  });

  it('should delete an expense', async () => {
    // Arrange
    const expense = await expenseService.addExpense({
      date: new Date(),
      amount: 100,
      vendor: 'Test Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
    });

    // Act
    const result = await expenseService.deleteExpense(expense.id);

    // Assert
    expect(result).toBe(true);

    // Verify the expense was deleted from the service
    const expenses = await expenseService.getExpenses();
    expect(expenses).toHaveLength(0);
  });

  it('should return false when deleting a non-existent expense', async () => {
    // Act
    const result = await expenseService.deleteExpense('non-existent-id');

    // Assert
    expect(result).toBe(false);
  });
});
