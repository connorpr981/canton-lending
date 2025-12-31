#!/usr/bin/env node
/**
 * Canton Lending Platform CLI
 *
 * Commands:
 *   request      - Create a new loan request (borrower)
 *   accept       - Accept a loan request (lender)
 *   reject       - Reject a loan request (lender)
 *   fund         - Fund an approved loan (lender)
 *   repay        - Repay a funded loan (borrower)
 *   close        - Close a repaid loan (lender)
 *   list-requests - List all loan requests
 *   list-loans   - List all loans
 */

import { Command } from 'commander';
import { createLedgerClient, getLedgerConfig } from './client/ledger.js';
import { createLoanRequest } from './commands/request.js';
import { acceptLoanRequest, rejectLoanRequest } from './commands/approve.js';
import { fundLoan } from './commands/fund.js';
import { repayLoan } from './commands/repay.js';
import { closeLoan } from './commands/close.js';
import {
  queryLoanRequests,
  queryLoans,
  queryLoansByStatus,
  formatLoanRequests,
  formatLoans,
} from './queries/contracts.js';

const program = new Command();

program
  .name('lending-cli')
  .description('Canton Lending Platform CLI - Bilateral lending on Canton Network')
  .version('0.0.1');

// ============================================
// Borrower Commands
// ============================================

program
  .command('request')
  .description('Create a new loan request (borrower action)')
  .requiredOption('--borrower <partyId>', 'Borrower party ID')
  .requiredOption('--lender <partyId>', 'Lender party ID')
  .requiredOption('--asset <asset>', 'Asset type (e.g., USD, USDCx)')
  .requiredOption('--principal <amount>', 'Principal amount')
  .requiredOption('--rate <rate>', 'Annual interest rate as decimal (e.g., 0.05 for 5%)')
  .requiredOption('--term <days>', 'Loan term in days')
  .option('--date <date>', 'Request date (ISO format, defaults to today)')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.borrower, config);
      const requestDate = options.date || new Date().toISOString().split('T')[0];

      await createLoanRequest(ledger, options.borrower, {
        lenderPartyId: options.lender,
        asset: options.asset,
        principal: options.principal,
        interestRate: options.rate,
        termDays: options.term,
        requestDate,
      });
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

// ============================================
// Lender Commands
// ============================================

program
  .command('accept')
  .description('Accept a loan request (lender action)')
  .requiredOption('--lender <partyId>', 'Lender party ID')
  .requiredOption('--contract <contractId>', 'LoanRequest contract ID')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.lender, config);
      await acceptLoanRequest(ledger, options.contract);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('reject')
  .description('Reject a loan request (lender action)')
  .requiredOption('--lender <partyId>', 'Lender party ID')
  .requiredOption('--contract <contractId>', 'LoanRequest contract ID')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.lender, config);
      await rejectLoanRequest(ledger, options.contract);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('fund')
  .description('Fund an approved loan (lender action)')
  .requiredOption('--lender <partyId>', 'Lender party ID')
  .requiredOption('--contract <contractId>', 'Loan contract ID')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.lender, config);
      await fundLoan(ledger, options.contract);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('close')
  .description('Close a repaid loan (lender action)')
  .requiredOption('--lender <partyId>', 'Lender party ID')
  .requiredOption('--contract <contractId>', 'Loan contract ID')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.lender, config);
      await closeLoan(ledger, options.contract);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

// ============================================
// Borrower Commands (continued)
// ============================================

program
  .command('repay')
  .description('Repay a funded loan (borrower action)')
  .requiredOption('--borrower <partyId>', 'Borrower party ID')
  .requiredOption('--contract <contractId>', 'Loan contract ID')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.borrower, config);
      await repayLoan(ledger, options.contract);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

// ============================================
// Query Commands
// ============================================

program
  .command('list-requests')
  .description('List all loan requests visible to the party')
  .requiredOption('--party <partyId>', 'Party ID to query as')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.party, config);
      const requests = await queryLoanRequests(ledger);
      formatLoanRequests(requests);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program
  .command('list-loans')
  .description('List all loans visible to the party')
  .requiredOption('--party <partyId>', 'Party ID to query as')
  .option('--status <status>', 'Filter by status (Proposed, Funded, Repaid)')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const ledger = createLedgerClient(options.party, config);

      const loans = options.status
        ? await queryLoansByStatus(ledger, options.status)
        : await queryLoans(ledger);

      formatLoans(loans);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

// ============================================
// Demo Command
// ============================================

program
  .command('demo')
  .description('Run a full loan lifecycle demo (requires two parties)')
  .requiredOption('--borrower <partyId>', 'Borrower party ID')
  .requiredOption('--lender <partyId>', 'Lender party ID')
  .action(async (options) => {
    try {
      const config = getLedgerConfig();
      const borrowerLedger = createLedgerClient(options.borrower, config);
      const lenderLedger = createLedgerClient(options.lender, config);
      const today = new Date().toISOString().split('T')[0];

      console.log('\n=== Canton Lending Platform Demo ===\n');

      // Step 1: Create loan request
      console.log('Step 1: Borrower creates loan request...');
      const requestId = await createLoanRequest(borrowerLedger, options.borrower, {
        lenderPartyId: options.lender,
        asset: 'USD',
        principal: '10000',
        interestRate: '0.05',
        termDays: '30',
        requestDate: today,
      });

      // Step 2: Accept request
      console.log('\nStep 2: Lender accepts the request...');
      const loanId = await acceptLoanRequest(lenderLedger, requestId);

      // Step 3: Fund loan
      console.log('\nStep 3: Lender funds the loan...');
      const fundedLoanId = await fundLoan(lenderLedger, loanId);

      // Step 4: Repay loan
      console.log('\nStep 4: Borrower repays the loan...');
      const repaidLoanId = await repayLoan(borrowerLedger, fundedLoanId);

      // Step 5: Close loan
      console.log('\nStep 5: Lender closes the loan...');
      await closeLoan(lenderLedger, repaidLoanId);

      console.log('\n=== Demo Complete ===');
      console.log('Lifecycle: Request -> Accept -> Fund -> Repay -> Close\n');
    } catch (error) {
      console.error('Demo failed:', error);
      process.exit(1);
    }
  });

program.parse();
