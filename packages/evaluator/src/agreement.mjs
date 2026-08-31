const SCORE_MINIMUM = 1;
const SCORE_MAXIMUM = 5;

function assertScore(value, label) {
  if (!Number.isSafeInteger(value) || value < SCORE_MINIMUM || value > SCORE_MAXIMUM) {
    throw new TypeError(`${label} must be an integer from ${SCORE_MINIMUM} through ${SCORE_MAXIMUM}`);
  }
}

export function normalizeRatingPairs(pairs) {
  if (!Array.isArray(pairs) || pairs.length < 2) {
    throw new TypeError("at least two rating pairs are required");
  }
  return pairs.map((pair, index) => {
    if (!Array.isArray(pair) || pair.length !== 2) {
      throw new TypeError(`pair ${index} must contain exactly two ratings`);
    }
    assertScore(pair[0], `pair ${index} left rating`);
    assertScore(pair[1], `pair ${index} right rating`);
    return [pair[0], pair[1]];
  });
}

export function exactAgreement(pairs) {
  const normalized = normalizeRatingPairs(pairs);
  const matches = normalized.filter(([left, right]) => left === right).length;
  return { matches, total: normalized.length, proportion: matches / normalized.length };
}

/**
 * Quadratic weighted kappa for two independent 1..5 ordinal rating streams.
 * `null` denotes an undefined value when expected disagreement is zero.
 */
export function quadraticWeightedKappa(pairs) {
  const normalized = normalizeRatingPairs(pairs);
  const categories = SCORE_MAXIMUM - SCORE_MINIMUM + 1;
  const matrix = Array.from({ length: categories }, () => Array(categories).fill(0));
  for (const [left, right] of normalized) matrix[left - SCORE_MINIMUM][right - SCORE_MINIMUM] += 1;

  const rows = matrix.map((row) => row.reduce((total, value) => total + value, 0));
  const columns = Array.from({ length: categories }, (_, column) =>
    matrix.reduce((total, row) => total + row[column], 0));
  let observed = 0;
  let expected = 0;
  for (let left = 0; left < categories; left += 1) {
    for (let right = 0; right < categories; right += 1) {
      const weight = ((left - right) / (categories - 1)) ** 2;
      observed += weight * matrix[left][right];
      expected += weight * ((rows[left] * columns[right]) / normalized.length);
    }
  }
  return expected === 0 ? null : 1 - (observed / expected);
}
