/**
 * Query loan balance information
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated template
const { Lending } = require('@daml.js/canton-lending');
const Loan = Lending.Loan.Loan;

/**
 * Get the total amount due on a loan (principal + interest)
 */
export async function getAmountDue(
  ledger: any,
  contractId: string
): Promise<string> {
  try {
    const result = await ledger.exercise(Loan.GetAmountDue, contractId, {});
    return result;
  } catch (error) {
    console.error('Failed to get amount due:', error);
    throw error;
  }
}

/**
 * Get the remaining balance on a loan (total due - amount repaid)
 */
export async function getRemainingBalance(
  ledger: any,
  contractId: string
): Promise<string> {
  try {
    const result = await ledger.exercise(Loan.GetRemainingBalance, contractId, {});
    return result;
  } catch (error) {
    console.error('Failed to get remaining balance:', error);
    throw error;
  }
}

/**
 * Display full balance information for a loan
 */
export async function displayBalance(
  ledger: any,
  contractId: string
): Promise<void> {
  try {
    const amountDue = await getAmountDue(ledger, contractId);
    const remaining = await getRemainingBalance(ledger, contractId);

    console.log('\n=== Loan Balance ===');
    console.log(`Contract ID:     ${contractId}`);
    console.log(`Total Due:       ${amountDue}`);
    console.log(`Remaining:       ${remaining}`);
    console.log(`Amount Paid:     ${parseFloat(amountDue) - parseFloat(remaining)}`);
    console.log('');
  } catch (error) {
    console.error('Failed to display balance:', error);
    throw error;
  }
}
