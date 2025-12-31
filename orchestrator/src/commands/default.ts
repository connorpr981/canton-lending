/**
 * Default a loan past due date (lender action)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const Loan = Lending.Loan.Loan;

/**
 * Mark a loan as defaulted (Funded -> Defaulted)
 * Can only be exercised after the loan's due date
 */
export async function defaultLoan(
  ledger: any,
  contractId: string,
  currentDate?: string
): Promise<string> {
  try {
    // Use provided date or current date
    const date = currentDate || new Date().toISOString().split('T')[0];

    const [result] = await ledger.exercise(Loan.Default, contractId, {
      currentDate: date,
    });

    console.log(`Loan marked as defaulted: ${result}`);
    return result;
  } catch (error) {
    console.error('Failed to default loan:', error);
    throw error;
  }
}
