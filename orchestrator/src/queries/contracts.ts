/**
 * Query contracts from the ledger
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated templates
const { Lending } = require('@daml.js/canton-lending');
const LoanRequest = Lending.LoanRequest.LoanRequest;
const Loan = Lending.Loan.Loan;

import type { LoanRequest as LoanRequestType, Loan as LoanType, ContractInfo } from '../types/index.js';

/**
 * Query all active loan requests visible to the party
 */
export async function queryLoanRequests(
  ledger: any
): Promise<ContractInfo<LoanRequestType>[]> {
  try {
    const contracts = await ledger.query(LoanRequest);
    return contracts.map((c: any) => ({
      contractId: c.contractId,
      payload: c.payload as LoanRequestType,
    }));
  } catch (error) {
    console.error('Failed to query loan requests:', error);
    throw error;
  }
}

/**
 * Query all active loans visible to the party
 */
export async function queryLoans(
  ledger: any
): Promise<ContractInfo<LoanType>[]> {
  try {
    const contracts = await ledger.query(Loan);
    return contracts.map((c: any) => ({
      contractId: c.contractId,
      payload: c.payload as LoanType,
    }));
  } catch (error) {
    console.error('Failed to query loans:', error);
    throw error;
  }
}

/**
 * Query loans filtered by status
 */
export async function queryLoansByStatus(
  ledger: any,
  status: string
): Promise<ContractInfo<LoanType>[]> {
  const loans = await queryLoans(ledger);
  return loans.filter((l) => l.payload.status === status);
}

/**
 * Format loan requests for display
 */
export function formatLoanRequests(requests: ContractInfo<LoanRequestType>[]): void {
  if (requests.length === 0) {
    console.log('No loan requests found.');
    return;
  }

  console.log('\n=== Loan Requests ===\n');
  for (const req of requests) {
    console.log(`Contract ID: ${req.contractId}`);
    console.log(`  Borrower:      ${req.payload.borrower}`);
    console.log(`  Lender:        ${req.payload.lender}`);
    console.log(`  Asset:         ${req.payload.asset}`);
    console.log(`  Principal:     ${req.payload.principal}`);
    console.log(`  Interest Rate: ${req.payload.interestRate}`);
    console.log(`  Term (days):   ${req.payload.termDays}`);
    console.log(`  Request Date:  ${req.payload.requestDate}`);
    console.log('');
  }
}

/**
 * Format loans for display
 */
export function formatLoans(loans: ContractInfo<LoanType>[]): void {
  if (loans.length === 0) {
    console.log('No loans found.');
    return;
  }

  console.log('\n=== Loans ===\n');
  for (const loan of loans) {
    const totalDue = parseFloat(loan.payload.principal) + parseFloat(loan.payload.interest);
    const amountRepaid = parseFloat(loan.payload.amountRepaid || '0');
    const remaining = totalDue - amountRepaid;

    console.log(`Contract ID: ${loan.contractId}`);
    console.log(`  Borrower:      ${loan.payload.borrower}`);
    console.log(`  Lender:        ${loan.payload.lender}`);
    console.log(`  Asset:         ${loan.payload.asset}`);
    console.log(`  Principal:     ${loan.payload.principal}`);
    console.log(`  Interest:      ${loan.payload.interest}`);
    console.log(`  Total Due:     ${totalDue.toFixed(2)}`);
    console.log(`  Amount Repaid: ${amountRepaid.toFixed(2)}`);
    console.log(`  Remaining:     ${remaining.toFixed(2)}`);
    console.log(`  Start Date:    ${loan.payload.startDate}`);
    console.log(`  Due Date:      ${loan.payload.dueDate}`);
    console.log(`  Status:        ${loan.payload.status}`);
    console.log('');
  }
}
