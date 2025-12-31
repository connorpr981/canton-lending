/**
 * Create a new loan request (borrower action)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const LoanRequest = Lending.LoanRequest.LoanRequest;

export interface CreateLoanRequestParams {
  lenderPartyId: string;
  asset: string;
  principal: string;
  interestRate: string;
  termDays: string;
  requestDate: string;
}

/**
 * Create a new loan request
 */
export async function createLoanRequest(
  ledger: any,
  borrowerPartyId: string,
  params: CreateLoanRequestParams
): Promise<string> {
  try {
    const result = await ledger.create(LoanRequest, {
      borrower: borrowerPartyId,
      lender: params.lenderPartyId,
      asset: params.asset,
      principal: params.principal,
      interestRate: params.interestRate,
      termDays: params.termDays,
      requestDate: params.requestDate,
    });

    console.log(`Created LoanRequest: ${result.contractId}`);
    return result.contractId;
  } catch (error) {
    console.error('Failed to create loan request:', error);
    throw error;
  }
}
