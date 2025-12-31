/**
 * Fund an approved loan (lender action)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const Loan = Lending.Loan.Loan;

/**
 * Fund a loan (Proposed -> Funded)
 */
export async function fundLoan(
  ledger: any,
  contractId: string
): Promise<string> {
  try {
    const [result] = await ledger.exercise(Loan.Fund, contractId, {});

    console.log(`Funded Loan: ${result}`);
    return result;
  } catch (error) {
    console.error('Failed to fund loan:', error);
    throw error;
  }
}
