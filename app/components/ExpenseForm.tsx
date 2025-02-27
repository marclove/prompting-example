import { useState, useEffect } from 'react';
import { ExpenseCategory } from '../models/expense';

/**
 * Props for the ExpenseForm component
 */
interface ExpenseFormProps {
  /**
   * Callback function called when the form is submitted with valid data
   */
  onSubmit: (data: ExpenseFormData) => void;

  /**
   * Initial values for the form fields (used when editing an expense)
   */
  initialValues?: ExpenseFormData;

  /**
   * Whether the form is currently submitting
   */
  isSubmitting?: boolean;
}

/**
 * Data structure for the expense form
 */
export interface ExpenseFormData {
  /**
   * Date of the expense
   */
  date: Date;

  /**
   * Amount of the expense
   */
  amount: number;

  /**
   * Vendor or merchant name
   */
  vendor: string;

  /**
   * Category of the expense
   */
  category: ExpenseCategory;

  /**
   * Optional notes about the expense
   */
  notes?: string;
}

/**
 * Form for adding or editing an expense
 */
export function ExpenseForm({ onSubmit, initialValues, isSubmitting = false }: ExpenseFormProps) {
  // Form state
  const [date, setDate] = useState<string>(initialValues?.date ? formatDateForInput(initialValues.date) : '');
  const [amount, setAmount] = useState<string>(initialValues?.amount ? initialValues.amount.toString() : '');
  const [vendor, setVendor] = useState<string>(initialValues?.vendor || '');
  const [category, setCategory] = useState<ExpenseCategory | ''>(initialValues?.category || '');
  const [notes, setNotes] = useState<string>(initialValues?.notes || '');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Formats a date object for the date input field
   */
  function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  /**
   * Validates the form fields
   */
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Handles form submission
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      date: new Date(date),
      amount: parseFloat(amount),
      vendor,
      category: category as ExpenseCategory,
      notes: notes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            disabled={isSubmitting}
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
          Vendor
        </label>
        <input
          type="text"
          id="vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="">Select a category</option>
          {Object.values(ExpenseCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
