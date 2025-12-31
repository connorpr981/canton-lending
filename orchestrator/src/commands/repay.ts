/**
 * Repay a funded loan (borrower action)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const Loan = Lending.Loan.Loan;

/**
 * Repay a loan in full (Funded -> Repaid)
 * Uses legacy Repay choice for full repayment
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

/**
 * Make a partial or full payment on a loan
 * Uses MakePayment choice which supports partial repayments
 */
export async function makePayment(
  ledger: any,
  contractId: string,
  amount: string
): Promise<string> {
  try {
    const [result] = await ledger.exercise(Loan.MakePayment, contractId, {
      amount,
    });

    console.log(`Payment of ${amount} made. New contract: ${result}`);
    return result;
  } catch (error) {
    console.error('Failed to make payment:', error);
    throw error;
  }
}
