import { describe, it, expect } from 'vitest';
import { Expense, ExpenseCategory } from '../../models/expense';

describe('Expense Model', () => {
  it('should create a valid expense with required fields', () => {
    // Arrange
    const date = new Date();
    const amount = 100.50;
    const vendor = 'Office Supplies Inc.';
    const category = ExpenseCategory.OFFICE_SUPPLIES;

    // Act
    const expense = new Expense({
      date,
      amount,
      vendor,
      category,
    });

    // Assert
    expect(expense.id).toBeDefined();
    expect(expense.date).toEqual(date);
    expect(expense.amount).toEqual(amount);
    expect(expense.vendor).toEqual(vendor);
    expect(expense.category).toEqual(category);
    expect(expense.createdAt).toBeInstanceOf(Date);
    expect(expense.updatedAt).toBeInstanceOf(Date);
  });

  it('should validate required fields', () => {
    // Act & Assert
    expect(() => new Expense({
      date: new Date(),
      amount: 0,
      vendor: '',
      category: ExpenseCategory.OFFICE_SUPPLIES,
    })).toThrow('Vendor name is required');

    expect(() => new Expense({
      date: new Date(),
      amount: -1,
      vendor: 'Test Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
    })).toThrow('Amount must be greater than 0');
  });

  it('should allow updating expense properties', () => {
    // Arrange
    const expense = new Expense({
      date: new Date(),
      amount: 100,
      vendor: 'Original Vendor',
      category: ExpenseCategory.OFFICE_SUPPLIES,
    });

    const newDate = new Date();
    const newAmount = 200;
    const newVendor = 'Updated Vendor';
    const newCategory = ExpenseCategory.TRAVEL;

    // Act
    expense.update({
      date: newDate,
      amount: newAmount,
      vendor: newVendor,
      category: newCategory,
    });

    // Assert
    expect(expense.date).toEqual(newDate);
    expect(expense.amount).toEqual(newAmount);
    expect(expense.vendor).toEqual(newVendor);
    expect(expense.category).toEqual(newCategory);
    expect(expense.updatedAt.getTime()).toBeGreaterThan(expense.createdAt.getTime());
  });
});
