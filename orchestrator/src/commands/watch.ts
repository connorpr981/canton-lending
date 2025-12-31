/**
 * Watch for contract updates in real-time
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import generated templates
const { Lending } = require('@daml.js/canton-lending');
const LoanRequest = Lending.LoanRequest.LoanRequest;
const Loan = Lending.Loan.Loan;

export type WatchType = 'loans' | 'requests' | 'all';

/**
 * Watch for contract updates and print them as they occur
 */
export async function watchContracts(
  ledger: any,
  watchType: WatchType = 'all'
): Promise<void> {
  console.log(`\nWatching for ${watchType} updates... (Press Ctrl+C to stop)\n`);

  const streams: any[] = [];

  if (watchType === 'loans' || watchType === 'all') {
    const loanStream = ledger.streamQueries(Loan, []);

    loanStream.on('live', () => {
      console.log('[Loans] Stream connected');
    });

    loanStream.on('change', (contracts: any[]) => {
      console.log(`\n[Loans] Update received - ${contracts.length} active contract(s)`);
      for (const contract of contracts) {
        console.log(`  Contract: ${contract.contractId}`);
        console.log(`    Borrower: ${contract.payload.borrower}`);
        console.log(`    Lender: ${contract.payload.lender}`);
        console.log(`    Status: ${contract.payload.status}`);
        console.log(`    Principal: ${contract.payload.principal}`);
        console.log(`    Remaining: ${parseFloat(contract.payload.principal) + parseFloat(contract.payload.interest) - parseFloat(contract.payload.amountRepaid || '0')}`);
      }
    });

    loanStream.on('close', () => {
      console.log('[Loans] Stream closed');
    });

    streams.push(loanStream);
  }

  if (watchType === 'requests' || watchType === 'all') {
    const requestStream = ledger.streamQueries(LoanRequest, []);

    requestStream.on('live', () => {
      console.log('[Requests] Stream connected');
    });

    requestStream.on('change', (contracts: any[]) => {
      console.log(`\n[Requests] Update received - ${contracts.length} active request(s)`);
      for (const contract of contracts) {
        console.log(`  Contract: ${contract.contractId}`);
        console.log(`    Borrower: ${contract.payload.borrower}`);
        console.log(`    Lender: ${contract.payload.lender}`);
        console.log(`    Principal: ${contract.payload.principal}`);
        console.log(`    Rate: ${contract.payload.interestRate}`);
      }
    });

    requestStream.on('close', () => {
      console.log('[Requests] Stream closed');
    });

    streams.push(requestStream);
  }

  // Keep the process running until interrupted
  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      console.log('\nClosing streams...');
      for (const stream of streams) {
        stream.close();
      }
      resolve();
    });
  });
}
