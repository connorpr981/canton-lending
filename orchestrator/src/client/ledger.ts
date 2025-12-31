/**
 * Canton Ledger API client configuration
 */

import { createRequire } from 'module';
import { createPartyToken } from './auth.js';

// Use createRequire for CJS module compatibility
const require = createRequire(import.meta.url);
const { Ledger } = require('@daml/ledger');

export interface LedgerConfig {
  httpBaseUrl: string;
  wsBaseUrl: string;
}

const DEFAULT_CONFIG: LedgerConfig = {
  httpBaseUrl: 'http://localhost:7575/',
  wsBaseUrl: 'ws://localhost:7575/',
};

/**
 * Create a Ledger client for a specific party
 */
export function createLedgerClient(
  partyId: string,
  config: LedgerConfig = DEFAULT_CONFIG
): any {
  const token = createPartyToken(partyId);

  return new Ledger({
    token,
    httpBaseUrl: config.httpBaseUrl,
    wsBaseUrl: config.wsBaseUrl,
  });
}

/**
 * Get ledger config from environment or use defaults
 */
export function getLedgerConfig(): LedgerConfig {
  return {
    httpBaseUrl: process.env.LEDGER_HTTP_URL || DEFAULT_CONFIG.httpBaseUrl,
    wsBaseUrl: process.env.LEDGER_WS_URL || DEFAULT_CONFIG.wsBaseUrl,
  };
}
