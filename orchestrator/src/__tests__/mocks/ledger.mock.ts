import { vi } from 'vitest';

/**
 * Mock implementation of @daml/ledger
 */
export const createMockLedger = () => ({
  create: vi.fn().mockResolvedValue({ contractId: 'mock-contract-id' }),
  exercise: vi.fn().mockResolvedValue([{ contractId: 'mock-result-id' }]),
  query: vi.fn().mockResolvedValue([]),
  streamQueries: vi.fn().mockReturnValue({
    on: vi.fn(),
    close: vi.fn(),
  }),
});

/**
 * Mock contract data for testing
 */
export const mockLoanRequest = {
  contractId: 'loan-request-001',
  payload: {
    borrower: 'alice',
    lender: 'bank',
    asset: 'USD',
    principal: '10000.0',
    interestRate: '0.05',
    termDays: '30',
    requestDate: '2024-01-01',
  },
};

export const mockLoan = {
  contractId: 'loan-001',
  payload: {
    borrower: 'alice',
    lender: 'bank',
    asset: 'USD',
    principal: '10000.0',
    interest: '500.0',
    startDate: '2024-01-01',
    dueDate: '2024-01-31',
    status: 'Funded',
    amountRepaid: '0.0',
  },
};
