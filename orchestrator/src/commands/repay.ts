/**
 * Repay a funded loan (borrower action)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const Loan = Lending.Loan.Loan;

/**
 * Repay a loan (Funded -> Repaid)
 */
export async function repayLoan(
  ledger: any,
  contractId: string
): Promise<string> {
  try {
    const [result] = await ledger.exercise(Loan.Repay, contractId, {});

    console.log(`Repaid Loan: ${result}`);
    return result;
  } catch (error) {
    console.error('Failed to repay loan:', error);
    throw error;
  }
}
