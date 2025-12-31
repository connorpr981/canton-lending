/**
 * Loan amendment commands
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated templates
const { Lending } = require('@daml.js/canton-lending');
const LoanAmendmentProposal = Lending.LoanAmendment.LoanAmendmentProposal;

export interface AmendmentProposalParams {
  originalLoanId: string;
  proposer: string;
  counterparty: string;
  borrower: string;
  lender: string;
  asset: string;
  originalPrincipal: string;
  originalInterest: string;
  originalDueDate: string;
  startDate: string;
  newPrincipal?: string;
  newInterestRate?: string;
  newTermDays?: string;
}

/**
 * Create an amendment proposal for a loan
 */
export async function proposeAmendment(
  ledger: any,
  params: AmendmentProposalParams
): Promise<string> {
  try {
    const proposal = {
      originalLoanId: params.originalLoanId,
      proposer: params.proposer,
      counterparty: params.counterparty,
      borrower: params.borrower,
      lender: params.lender,
      asset: params.asset,
      originalPrincipal: params.originalPrincipal,
      originalInterest: params.originalInterest,
      originalDueDate: params.originalDueDate,
      startDate: params.startDate,
      newPrincipal: params.newPrincipal ? { tag: 'Some', value: params.newPrincipal } : null,
      newInterestRate: params.newInterestRate ? { tag: 'Some', value: params.newInterestRate } : null,
      newTermDays: params.newTermDays ? { tag: 'Some', value: parseInt(params.newTermDays) } : null,
    };

    const result = await ledger.create(LoanAmendmentProposal, proposal);
    console.log(`Amendment proposal created: ${result.contractId}`);
    return result.contractId;
  } catch (error) {
    console.error('Failed to create amendment proposal:', error);
    throw error;
  }
}

/**
 * Accept an amendment proposal
 */
export async function acceptAmendment(
  ledger: any,
  contractId: string
): Promise<string> {
  try {
    const [result] = await ledger.exercise(
      LoanAmendmentProposal.AcceptAmendment,
      contractId,
      {}
    );

    console.log(`Amendment accepted. New loan: ${result}`);
    return result;
  } catch (error) {
    console.error('Failed to accept amendment:', error);
    throw error;
  }
}

/**
 * Reject an amendment proposal
 */
export async function rejectAmendment(
  ledger: any,
  contractId: string
): Promise<void> {
  try {
    await ledger.exercise(LoanAmendmentProposal.RejectAmendment, contractId, {});
    console.log(`Amendment rejected: ${contractId}`);
  } catch (error) {
    console.error('Failed to reject amendment:', error);
    throw error;
  }
}

/**
 * Withdraw an amendment proposal
 */
export async function withdrawAmendment(
  ledger: any,
  contractId: string
): Promise<void> {
  try {
    await ledger.exercise(LoanAmendmentProposal.WithdrawAmendment, contractId, {});
    console.log(`Amendment withdrawn: ${contractId}`);
  } catch (error) {
    console.error('Failed to withdraw amendment:', error);
    throw error;
  }
}
