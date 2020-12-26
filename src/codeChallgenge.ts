// import sha256 from 'sha256';
// import base64url from 'base64url';

// function sha256(plain: string) { 
//   // returns promise ArrayBuffer
//   const encoder = new TextEncoder();
//   const data = encoder.encode(plain);
//   return window.crypto.subtle.digest('SHA-256', data);
// }

// function base64urlencode(a: Uint8Array) {
//   // Convert the ArrayBuffer to string using Uint8 array.
//   // btoa takes chars from 0-255 and base64 encodes.
//   // Then convert the base64 encoded to base64url encoded.
//   // (replace + with -, replace / with _, trim trailing =)
//   return btoa(String.fromCharCode.apply(null, a as unknown as number[]))
//       .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// }

// async function pkce_challenge_from_verifier(v: string) {
//   const hashed = await sha256(v);
//   const arr = new Uint8Array(hashed.byteLength);
//   for (let i = hashed.byteLength; i--;) {
//     arr[i] = hashed.charCodeAt(i);
//   }
//   const base64encoded = base64urlencode(arr);
//   return base64encoded;
// }

// const codeChallenge = pkce_challenge_from_verifier('ANz2ppxOjupHIlUeegvCuBMmsaxKxrIqTV25wZHBLRX0m');
const codeChallenge = 'izYoorSARD-nZzl4xsuoPIwZAVIZ1h-OkIL0eSTu-PA';

export default codeChallenge;
