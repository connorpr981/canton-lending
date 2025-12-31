# Canton Bilateral Lending Platform

A bilateral lending platform built on Canton Network using DAML smart contracts.

## Overview

Peer-to-peer lending with:
- **Bilateral agreements** - one lender, one borrower, no pooled funds
- **State machine** - Request → Accept → Fund → Repay → Close
- **Authorization controls** - enforced by DAML signatories
- **Audit trail** - immutable ledger records

## Prerequisites

- **DAML SDK 2.10+**: `curl -sSL https://get.daml.com/ | sh`
- **Node.js 18+**
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

See [DEMO.md](DEMO.md) for detailed walkthrough.

## Project Structure

```
canton-lending/
├── daml/                      # DAML smart contracts
│   ├── src/Lending/
│   │   ├── Types.daml         # LoanStatus enum
│   │   ├── LoanRequest.daml   # Propose-Accept pattern
│   │   └── Loan.daml          # Loan state machine
│   └── test/LendingTest.daml  # Daml Script tests
├── orchestrator/              # TypeScript CLI
│   └── src/
│       ├── index.ts           # CLI entry point
│       ├── client/            # Ledger API client
│       ├── commands/          # Loan operations
│       └── queries/           # Contract queries
├── justfile                   # Task runner
├── DEMO.md                    # Demo guide
└── CODE_REVIEW.md             # Code review notes
```

## Commands

```bash
just                    # Show all commands
just setup              # Build everything
just sandbox            # Start Canton sandbox
just demo               # Run full demo

# Loan operations
just request alice bank 10000     # Create request
just accept bank <id>             # Accept request
just fund bank <id>               # Fund loan
just repay alice <id>             # Repay loan
just close bank <id>              # Close loan

# Queries
just list-requests bank           # View requests
just list-loans bank              # View loans
```

## Loan Lifecycle

```
LoanRequest          Loan (Proposed)      Loan (Funded)       Loan (Repaid)
    │                     │                    │                   │
    │ Accept              │ Fund               │ Repay             │ Close
    └────────────────────►└───────────────────►└──────────────────►└──────► (Archived)
```

## Security

- **No custody** - platform doesn't hold funds
- **Bilateral signatories** - both parties must consent
- **State guards** - can't skip lifecycle steps
- **Controller restrictions** - only right party can act

## Documentation

- [DEMO.md](DEMO.md) - Step-by-step demo guide
- [CODE_REVIEW.md](CODE_REVIEW.md) - Code review and recommendations

## Next Steps

1. Deploy to Canton Devnet
2. Integrate USDCx token transfers
3. Apply for Featured App status
4. Build Next.js dashboard
