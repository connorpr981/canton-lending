# Canton Lending Platform - Task Runner
# Install just: brew install just (macOS) or cargo install just

# Default: show available commands
default:
    @just --list

# One-command setup: build everything
setup: build test codegen install
    @echo ""
    @echo "Setup complete! Next steps:"
    @echo "  1. just sandbox    (start Canton sandbox)"
    @echo "  2. just demo       (run full lifecycle demo)"

# Build DAML contracts
build:
    @echo "Building DAML contracts..."
    cd daml && daml build

# Run DAML tests
test:
    @echo "Running DAML tests..."
    cd daml && daml test

# Generate TypeScript bindings from DAML
codegen:
    @echo "Generating TypeScript bindings..."
    cd daml && daml codegen js -o ../orchestrator/daml.js .daml/dist/canton-lending-0.0.1.dar

# Install orchestrator dependencies
install:
    @echo "Installing orchestrator dependencies..."
    cd orchestrator && npm install

# Start Canton sandbox (gRPC only)
sandbox:
    @echo "Starting Canton sandbox..."
    @echo "  gRPC API: localhost:6865"
    @echo ""
    @echo "In another terminal, run: just json-api"
    @echo ""
    cd daml && daml sandbox --wall-clock-time

# Start JSON API (requires sandbox running)
json-api:
    @echo "Starting JSON API..."
    @echo "  HTTP API: localhost:7575"
    @echo ""
    daml json-api --ledger-host localhost --ledger-port 6865 --http-port 7575 --allow-insecure-tokens

# Start both sandbox and JSON API (use this for demo)
start:
    @echo "Starting sandbox + JSON API..."
    @echo ""
    @echo "This will start the sandbox. Once it's ready, open another terminal and run:"
    @echo "  just json-api"
    @echo ""
    @echo "Then in a third terminal, run:"
    @echo "  just demo"
    @echo ""
    cd daml && daml sandbox --wall-clock-time

# Run full lifecycle demo (requires sandbox running)
demo borrower="alice" lender="bank":
    cd orchestrator && npm run cli -- demo --borrower {{borrower}} --lender {{lender}}

# CLI shortcut
cli *args:
    cd orchestrator && npm run cli -- {{args}}

# === Individual Loan Commands ===

# Create a loan request (borrower action)
request borrower lender principal rate="0.05" term="30" asset="USD":
    cd orchestrator && npm run cli -- request \
        --borrower {{borrower}} \
        --lender {{lender}} \
        --asset {{asset}} \
        --principal {{principal}} \
        --rate {{rate}} \
        --term {{term}}

# Accept a loan request (lender action)
accept lender contract:
    cd orchestrator && npm run cli -- accept --lender {{lender}} --contract {{contract}}

# Reject a loan request (lender action)
reject lender contract:
    cd orchestrator && npm run cli -- reject --lender {{lender}} --contract {{contract}}

# Fund an approved loan (lender action)
fund lender contract:
    cd orchestrator && npm run cli -- fund --lender {{lender}} --contract {{contract}}

# Repay a funded loan (borrower action)
repay borrower contract:
    cd orchestrator && npm run cli -- repay --borrower {{borrower}} --contract {{contract}}

# Close a repaid loan (lender action)
close lender contract:
    cd orchestrator && npm run cli -- close --lender {{lender}} --contract {{contract}}

# === Query Commands ===

# List loan requests
list-requests party:
    cd orchestrator && npm run cli -- list-requests --party {{party}}

# List loans (optionally filter by status)
list-loans party status="":
    #!/usr/bin/env bash
    if [ -n "{{status}}" ]; then
        cd orchestrator && npm run cli -- list-loans --party {{party}} --status {{status}}
    else
        cd orchestrator && npm run cli -- list-loans --party {{party}}
    fi

# === Development ===

# Clean build artifacts
clean:
    #!/usr/bin/env bash
    rm -rf daml/.daml
    rm -rf orchestrator/daml.js
    rm -rf orchestrator/node_modules
    rm -rf orchestrator/dist

# Rebuild everything from scratch
rebuild: clean setup

# Type-check TypeScript
typecheck:
    cd orchestrator && npm run typecheck

# === Help ===

# Show quick start guide
quickstart:
    @echo ""
    @echo "Canton Lending Platform - Quick Start"
    @echo "======================================"
    @echo ""
    @echo "1. Setup (first time only):"
    @echo "   just setup"
    @echo ""
    @echo "2. Start sandbox (Terminal 1):"
    @echo "   just sandbox"
    @echo ""
    @echo "3. Run demo (Terminal 2):"
    @echo "   just demo"
    @echo ""
    @echo "Or run individual commands:"
    @echo "   just request alice bank 10000"
    @echo "   just accept bank <contract-id>"
    @echo "   just fund bank <contract-id>"
    @echo "   just repay alice <contract-id>"
    @echo "   just close bank <contract-id>"
    @echo ""
