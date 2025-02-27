import { useState, useEffect } from 'react';
import { ExpenseForm, ExpenseFormData } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Expense } from '../models/expense';
import { ExpenseService } from '../models/expenseService';

/**
 * Component that manages expenses, integrating the form and list
 */
export function ExpenseManager() {
  // State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Create an instance of the ExpenseService
  const expenseService = new ExpenseService();

  /**
   * Loads all expenses from the service
   */
  async function loadExpenses() {
    try {
      setIsLoading(true);
      setError(null);
      const loadedExpenses = await expenseService.getExpenses();
      setExpenses(loadedExpenses);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
      console.error('Error loading expenses:', err);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handles form submission for adding or updating an expense
   */
  async function handleSubmit(data: ExpenseFormData) {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingExpense) {
        // Update existing expense
        await expenseService.updateExpense(editingExpense.id, data);
      } else {
        // Add new expense
        await expenseService.addExpense(data);
      }

      // Reset form and reload expenses
      setEditingExpense(null);
      await loadExpenses();
    } catch (err) {
      setError('Failed to save expense. Please try again.');
      console.error('Error saving expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Handles editing an expense
   */
  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handles canceling the edit
   */
  function handleCancelEdit() {
    setEditingExpense(null);
  }

  /**
   * Handles deleting an expense
   */
  async function handleDelete(id: string) {
    try {
      setError(null);
      await expenseService.deleteExpense(id);
      await loadExpenses();
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error('Error deleting expense:', err);
    }
  }

  // Load expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">S-Corp Expense Tracker</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </h2>

        <ExpenseForm
          onSubmit={handleSubmit}
          initialValues={editingExpense || undefined}
          isSubmitting={isSubmitting}
        />

        {editingExpense && (
          <div className="mt-4">
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-900"
              disabled={isSubmitting}
            >
              Cancel Edit
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense History</h2>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading expenses...</p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
