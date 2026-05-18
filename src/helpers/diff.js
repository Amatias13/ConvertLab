/**
 * Line-by-line LCS diff.
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {Array<{t: string, v: string}>} An array of diff objects, where 't' is the type ('=', '+', '-') and 'v' is the line content.
 */
export function diff(a, b) {
  if (!a && !b) return [];
  const la = a.split("\n"),
    lb = b.split("\n");
  const m = la.length,
    n = lb.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = la[i] === lb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  const res = [];
  let i = 0,
    j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && la[i] === lb[j]) {
      res.push({ t: "=", v: la[i] });
      i++;
      j++;
    } else if (j < n && (i >= m || (dp[i + 1] && dp[i][j + 1] >= dp[i + 1][j]))) {
      res.push({ t: "+", v: lb[j] });
      j++;
    } else {
      res.push({ t: "-", v: la[i] });
      i++;
    }
  }
  return res;
}
