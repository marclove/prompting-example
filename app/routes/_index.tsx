import type { MetaFunction } from "@remix-run/cloudflare";
import { ExpenseManager } from "../components/ExpenseManager";

export const meta: MetaFunction = () => {
  return [
    { title: "S-Corp Expense Tracker" },
    { name: "description", content: "Track and manage your S-Corp expenses" },
  ];
};

/**
 * Main page of the application
 */
export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExpenseManager />
    </div>
  );
}
