/**
 * JWT token generation for Canton Ledger API authentication
 * For sandbox/development only - production requires proper IdP
 */

import jwt from 'jsonwebtoken';

export interface PartyConfig {
  partyId: string;
  displayName: string;
}

/**
 * Generate JWT token for ledger access
 * @param actAs - Parties the token holder can act as
 * @param readAs - Parties the token holder can read as
 * @param secret - JWT signing secret (default: 'secret' for sandbox)
 */
export function generateToken(
  actAs: string[],
  readAs: string[] = [],
  secret: string = 'secret'
): string {
  const payload = {
    sub: actAs[0],
    scope: 'daml_ledger_api',
    actAs,
    readAs: [...new Set([...actAs, ...readAs])], // Combine actAs into readAs
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  };

  return jwt.sign(payload, secret, { algorithm: 'HS256' });
}

/**
 * Create a token for a single party (can act as and read as that party)
 */
export function createPartyToken(partyId: string): string {
  return generateToken([partyId], [partyId]);
}
