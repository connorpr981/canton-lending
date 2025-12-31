# Canton Bilateral Lending Platform

A bilateral lending platform built on Canton Network using DAML smart contracts.

## Overview

Peer-to-peer lending with:
- **Bilateral agreements** - one lender, one borrower, no pooled funds
- **State machine** - Request → Accept → Fund → Repay → Close
- **Partial repayments** - track cumulative payments toward loan balance
- **Loan defaults** - lenders can mark overdue loans as defaulted
- **Loan amendments** - propose and accept changes to loan terms
- **Authorization controls** - enforced by DAML signatories
- **Audit trail** - immutable ledger records

## Prerequisites

- **DAML SDK 3.4.9**: `curl -sSL https://get.daml.com/ | sh && daml install 3.4.9`
- **Node.js 20**: Use `.nvmrc` with `nvm use`
- **Just** (optional): `brew install just`

## Quick Start

```bash
# Setup
just setup

# Terminal 1: Start sandbox
just sandbox

# Terminal 2: Run demo
just demo
```

## Project Structure

```
canton-lending/
├── .github/workflows/ci.yml   # GitHub Actions CI
├── .nvmrc                     # Node.js version (20)
├── daml/                      # DAML smart contracts
│   ├── src/
│   │   ├── Lending/
│   │   │   ├── Types.daml         # LoanStatus enum
│   │   │   ├── LoanRequest.daml   # Propose-Accept pattern
│   │   │   ├── Loan.daml          # Loan state machine
│   │   │   └── LoanAmendment.daml # Amendment proposals
│   │   └── LendingTest.daml       # DAML Script tests (19 tests)
│   └── daml.yaml
├── orchestrator/              # TypeScript CLI
│   ├── src/
│   │   ├── index.ts           # CLI entry point
│   │   ├── client/            # Ledger API client
│   │   ├── commands/          # Loan operations
│   │   ├── queries/           # Contract queries
│   │   └── __tests__/         # Vitest tests
│   ├── eslint.config.js       # ESLint 9 flat config
│   ├── .prettierrc            # Prettier config
│   └── vitest.config.ts       # Vitest config
├── justfile                   # Task runner
└── README.md
```

## Commands

### Core Workflow

```bash
just                    # Show all commands
just setup              # Build everything
just sandbox            # Start Canton sandbox
just demo               # Run full demo
```

### Loan Operations

```bash
# Borrower actions
just request alice bank 10000     # Create loan request
just repay alice <id>             # Full repayment
just pay alice <id> 5000          # Partial payment

# Lender actions
just accept bank <id>             # Accept request
just reject bank <id>             # Reject request
just fund bank <id>               # Fund loan
just close bank <id>              # Close repaid loan
just default bank <id>            # Mark overdue loan as defaulted
```

### Queries & Monitoring

```bash
just list-requests bank           # View loan requests
just list-loans bank              # View all loans
just list-loans bank Funded       # Filter by status
just balance alice <id>           # Check remaining balance
just watch alice                  # Stream contract updates
```

### Amendment Workflow

```bash
just accept-amendment alice <id>  # Accept proposed amendment
just reject-amendment alice <id>  # Reject proposed amendment
```

### Development

```bash
# Testing
just test                 # Run DAML tests
just test-ts              # Run TypeScript tests
just test-all             # Run all tests

# Code Quality
just lint                 # Run ESLint
just lint-fix             # Fix linting issues
just format               # Format with Prettier
just typecheck            # TypeScript type check

# Build
just build                # Build DAML contracts
just codegen              # Generate TypeScript bindings
just clean                # Clean all artifacts
just rebuild              # Clean and rebuild
```

## Loan Lifecycle

```
                                                    ┌─────────────┐
                                                    │  Defaulted  │
                                                    └─────────────┘
                                                          ▲
                                                          │ Default
                                                          │ (past due)
                                                          │
LoanRequest      Loan (Proposed)      Loan (Funded)      Loan (Repaid)
    │                  │                   │                   │
    │ Accept           │ Fund              │ Repay/            │ Close
    └─────────────────►└──────────────────►│ MakePayment       └──────► (Archived)
                                           │                   ▲
                                           │ partial           │ full
                                           └───────────────────┘
```

### Status Transitions

| From | To | Choice | Controller |
|------|-----|--------|------------|
| LoanRequest | Loan (Proposed) | Accept | lender |
| LoanRequest | (archived) | Reject | lender |
| Proposed | Funded | Fund | lender |
| Funded | Funded | MakePayment (partial) | borrower |
| Funded | Repaid | MakePayment (full) / Repay | borrower |
| Funded | Defaulted | Default | lender |
| Repaid | (archived) | Close | lender |

## Features

### Partial Repayments

Borrowers can make multiple payments toward their loan balance:

```bash
# Make a $5,000 payment on a $10,500 loan
just pay alice <contract-id> 5000

# Check remaining balance
just balance alice <contract-id>
# Output: Remaining: $5,500.00

# Pay off the rest
just pay alice <contract-id> 5500
# Loan transitions to Repaid status
```

### Loan Defaults

Lenders can mark loans as defaulted after the due date:

```bash
# Mark overdue loan as defaulted
just default bank <contract-id>
```

### Real-time Streaming

Monitor contract changes in real-time:

```bash
just watch alice              # Watch all contracts
just watch alice loans        # Watch only loans
just watch alice requests     # Watch only requests
```

## Testing

### DAML Tests

19 tests with 100% template coverage:

```bash
just test
# or
cd daml && daml test
```

Tests cover:
- Full loan lifecycle
- Partial repayments and overpayment rejection
- Loan defaults (valid and invalid)
- Amendment proposals (accept, reject, withdraw)
- Authorization and state guards

### TypeScript Tests

```bash
just test-ts
# or
cd orchestrator && npm test
```

## CI/CD

GitHub Actions runs on every push and PR:

1. **DAML Job**: Build and test DAML contracts
2. **TypeScript Job**: Lint, typecheck, and test orchestrator

## Security

- **No custody** - platform doesn't hold funds
- **Bilateral signatories** - both parties must consent
- **State guards** - can't skip lifecycle steps
- **Controller restrictions** - only right party can act
- **Overpayment protection** - cannot pay more than owed

## Architecture

### DAML Templates

| Template | Purpose | Signatories |
|----------|---------|-------------|
| LoanRequest | Initial loan proposal | borrower |
| Loan | Active loan contract | borrower, lender |
| LoanAmendmentProposal | Proposed term changes | proposer |

### TypeScript Orchestrator

- **Commander.js** - CLI framework
- **@daml/ledger** - Ledger API client
- **JWT auth** - Party-scoped tokens

## Next Steps

1. Deploy to Canton Devnet
2. Integrate USDCx token transfers
3. Apply for Featured App status
4. Build Next.js dashboard
