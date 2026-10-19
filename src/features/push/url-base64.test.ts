import { describe, expect, it } from 'vitest';

import { urlBase64ToUint8Array } from './url-base64';

describe('urlBase64ToUint8Array', () => {
  it('decodes unpadded base64url', () => {
    const bytes = new Uint8Array([251, 255, 191]);
    const encoded = Buffer.from(bytes).toString('base64url');
    expect(urlBase64ToUint8Array(encoded)).toEqual(bytes);
  });

  it('decodes a real VAPID public key to 65 bytes', () => {
    const key =
      'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM';
    expect(urlBase64ToUint8Array(key)).toHaveLength(65);
  });
});
