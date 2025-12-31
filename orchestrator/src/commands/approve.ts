/**
 * Accept or reject a loan request (lender actions)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const LoanRequest = Lending.LoanRequest.LoanRequest;

/**
 * Accept a loan request, creating a Loan contract
 */
export async function acceptLoanRequest(
  ledger: any,
  contractId: string
): Promise<string> {
  try {
    const [result] = await ledger.exercise(LoanRequest.Accept, contractId, {});

    console.log(`Accepted LoanRequest, created Loan: ${result}`);
    return result;
  } catch (error) {
    console.error('Failed to accept loan request:', error);
    throw error;
  }
}

/**
 * Reject a loan request
 */
export async function rejectLoanRequest(
  ledger: any,
  contractId: string
): Promise<void> {
  try {
    await ledger.exercise(LoanRequest.Reject, contractId, {});
    console.log(`Rejected LoanRequest: ${contractId}`);
  } catch (error) {
    console.error('Failed to reject loan request:', error);
    throw error;
  }
}
