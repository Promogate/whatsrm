import * as nanoid from 'nanoid';

const alphabet = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = nanoid.customAlphabet(alphabet, 21);
export function generateNanoID() {
  return generate();
}