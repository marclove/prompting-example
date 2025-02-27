import { Expense, ExpenseParams } from './expense';

/**
 * Service for managing expenses
 */
export class ExpenseService {
  private expenses: Map<string, Expense>;

  /**
   * Creates a new ExpenseService instance
   */
  constructor() {
    this.expenses = new Map<string, Expense>();
  }

  /**
   * Adds a new expense
   * @param expenseData - The expense data
   * @returns The created expense
   */
  async addExpense(expenseData: Omit<ExpenseParams, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const expense = new Expense(expenseData);
    this.expenses.set(expense.id, expense);
    return expense;
  }

  /**
   * Gets all expenses
   * @returns Array of all expenses
   */
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  /**
   * Gets an expense by ID
   * @param id - The expense ID
   * @returns The expense if found, null otherwise
   */
  async getExpenseById(id: string): Promise<Expense | null> {
    return this.expenses.get(id) || null;
  }

  /**
   * Updates an expense
   * @param id - The expense ID
   * @param updateData - The data to update
   * @returns The updated expense if found, null otherwise
   */
  async updateExpense(id: string, updateData: Partial<ExpenseParams>): Promise<Expense | null> {
    const expense = this.expenses.get(id);

    if (!expense) {
      return null;
    }

    expense.update(updateData);
    return expense;
  }

  /**
   * Deletes an expense
   * @param id - The expense ID
   * @returns True if the expense was deleted, false otherwise
   */
  async deleteExpense(id: string): Promise<boolean> {
    return this.expenses.delete(id);
  }
}
