import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockLedger, mockLoanRequest, mockLoan } from '../mocks/ledger.mock.js';

// Mock the require for @daml.js/canton-lending
vi.mock('@daml.js/canton-lending', () => ({
  Lending: {
    LoanRequest: { LoanRequest: {} },
    Loan: { Loan: {} },
  },
}));

describe('Contract Queries', () => {
  let mockLedger: ReturnType<typeof createMockLedger>;

  beforeEach(() => {
    mockLedger = createMockLedger();
    vi.clearAllMocks();
  });

  describe('queryLoanRequests', () => {
    it('should return formatted loan requests', async () => {
      mockLedger.query.mockResolvedValue([mockLoanRequest]);

      const { queryLoanRequests } = await import('../../queries/contracts.js');
      const results = await queryLoanRequests(mockLedger);

      expect(mockLedger.query).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].contractId).toBe('loan-request-001');
      expect(results[0].payload.borrower).toBe('alice');
    });

    it('should return empty array when no requests exist', async () => {
      mockLedger.query.mockResolvedValue([]);

      const { queryLoanRequests } = await import('../../queries/contracts.js');
      const results = await queryLoanRequests(mockLedger);

      expect(results).toHaveLength(0);
    });
  });

  describe('queryLoans', () => {
    it('should return formatted loans', async () => {
      mockLedger.query.mockResolvedValue([mockLoan]);

      const { queryLoans } = await import('../../queries/contracts.js');
      const results = await queryLoans(mockLedger);

      expect(mockLedger.query).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].contractId).toBe('loan-001');
      expect(results[0].payload.status).toBe('Funded');
    });
  });

  describe('queryLoansByStatus', () => {
    it('should filter loans by status', async () => {
      const fundedLoan = { ...mockLoan };
      const repaidLoan = { ...mockLoan, contractId: 'loan-002', payload: { ...mockLoan.payload, status: 'Repaid' } };
      mockLedger.query.mockResolvedValue([fundedLoan, repaidLoan]);

      const { queryLoansByStatus } = await import('../../queries/contracts.js');
      const results = await queryLoansByStatus(mockLedger, 'Funded');

      expect(results).toHaveLength(1);
      expect(results[0].payload.status).toBe('Funded');
    });
  });
});
