import RIPEMD160 from 'ripemd160';

export const getVerifyHash = text =>
  new RIPEMD160().update(text).digest('hex');

export default { getVerifyHash };
