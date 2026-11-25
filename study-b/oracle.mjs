// Derived only from pilot-spec-v1; see oracle-notes.md.
const fields = {
  discount: ['amount'],
  tax: ['amount', 'rate'],
  refund: ['paid', 'refunded', 'requested'],
  eligibility: ['age', 'tenure', 'suspended'],
};
function integer(input, key, maximum) {
  const value = input[key];
  if (!Number.isInteger(value) || value < 0 || value > maximum) {
    throw new RangeError(`${key} must be an integer in 0..${maximum}`);
  }
  return BigInt(value);
}
export function oracle(task, input) {
  if (!Object.hasOwn(fields, task)) throw new RangeError('Unknown task');
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Input must be a record');
  }
  const keys = Reflect.ownKeys(input);
  if (keys.length !== fields[task].length || !fields[task].every(k => Object.hasOwn(input, k))) {
    throw new TypeError('Input must have exactly the specified fields');
  }
  switch (task) {
    case 'discount': {
      const cents = integer(input, 'amount', 20000);
      return Number(cents < 10000n ? 0n : cents / 10n);
    }
    case 'tax': {
      const cents = integer(input, 'amount', 20000);
      const basisPoints = integer(input, 'rate', 2500);
      const numerator = cents * basisPoints;
      const whole = numerator / 10000n;
      const remainder = numerator % 10000n;
      return Number(whole + (remainder >= 5000n ? 1n : 0n));
    }
    case 'refund': {
      const paid = integer(input, 'paid', 20000);
      const refunded = integer(input, 'refunded', Number(paid));
      const requested = integer(input, 'requested', 20000);
      const available = paid - refunded;
      return Number(available < requested ? available : requested);
    }
    case 'eligibility': {
      const age = integer(input, 'age', 100);
      const tenure = integer(input, 'tenure', 60);
      if (typeof input.suspended !== 'boolean') throw new TypeError('suspended must be boolean');
      return age >= 18n && tenure >= 6n && input.suspended === false;
    }
  }
}
