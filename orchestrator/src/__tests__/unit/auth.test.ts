import { describe, it, expect } from 'vitest';
import { createPartyToken } from '../../client/auth.js';

describe('Auth', () => {
  describe('createPartyToken', () => {
    it('should create a valid JWT token for a party', () => {
      const token = createPartyToken('alice');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should create different tokens for different parties', () => {
      const aliceToken = createPartyToken('alice');
      const bankToken = createPartyToken('bank');

      expect(aliceToken).not.toBe(bankToken);
    });

    it('should include the party in the token payload', () => {
      const token = createPartyToken('alice');
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

      expect(payload.sub).toBe('alice');
      expect(payload['https://daml.com/ledger-api'].actAs).toContain('alice');
      expect(payload['https://daml.com/ledger-api'].readAs).toContain('alice');
    });
  });
});
