/**
 * Enum representing expense categories for an S-Corp
 */
export enum ExpenseCategory {
  OFFICE_SUPPLIES = 'Office Supplies',
  TRAVEL = 'Travel',
  MEALS = 'Meals',
  UTILITIES = 'Utilities',
  RENT = 'Rent',
  SOFTWARE = 'Software',
  HARDWARE = 'Hardware',
  PROFESSIONAL_SERVICES = 'Professional Services',
  MARKETING = 'Marketing',
  OTHER = 'Other',
}

/**
 * Interface for expense creation parameters
 */
export interface ExpenseParams {
  id?: string;
  date: Date;
  amount: number;
  vendor: string;
  category: ExpenseCategory;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Expense model representing a business expense
 */
export class Expense {
  id: string;
  date: Date;
  amount: number;
  vendor: string;
  category: ExpenseCategory;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Creates a new Expense instance
   * @param params - The expense parameters
   */
  constructor(params: ExpenseParams) {
    this.validateParams(params);

    this.id = params.id || crypto.randomUUID();
    this.date = params.date;
    this.amount = params.amount;
    this.vendor = params.vendor;
    this.category = params.category;
    this.notes = params.notes;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  /**
   * Validates the expense parameters
   * @param params - The expense parameters to validate
   * @throws Error if any validation fails
   */
  private validateParams(params: ExpenseParams): void {
    if (!params.vendor || params.vendor.trim() === '') {
      throw new Error('Vendor name is required');
    }

    if (params.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!params.date) {
      throw new Error('Date is required');
    }

    if (!params.category) {
      throw new Error('Category is required');
    }
  }

  /**
   * Updates the expense with new values
   * @param params - The new expense parameters
   */
  update(params: Partial<ExpenseParams>): void {
    if (params.vendor !== undefined) {
      if (!params.vendor || params.vendor.trim() === '') {
        throw new Error('Vendor name is required');
      }
      this.vendor = params.vendor;
    }

    if (params.amount !== undefined) {
      if (params.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      this.amount = params.amount;
    }

    if (params.date !== undefined) {
      this.date = params.date;
    }

    if (params.category !== undefined) {
      this.category = params.category;
    }

    if (params.notes !== undefined) {
      this.notes = params.notes;
    }

    // Ensure updatedAt is at least 1ms later than createdAt
    const now = new Date();
    if (now.getTime() <= this.createdAt.getTime()) {
      now.setTime(this.createdAt.getTime() + 1);
    }
    this.updatedAt = now;
  }
}
