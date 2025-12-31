/**
 * Close a repaid loan (lender action)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const Loan = Lending.Loan.Loan;

/**
 * Close a loan (Repaid -> Closed, archives the contract)
 */
export async function closeLoan(
  ledger: any,
  contractId: string
): Promise<void> {
  try {
    await ledger.exercise(Loan.Close, contractId, {});
    console.log(`Closed Loan: ${contractId}`);
  } catch (error) {
    console.error('Failed to close loan:', error);
    throw error;
  }
}
