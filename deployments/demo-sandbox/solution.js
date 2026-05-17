// Problem-specific implementation for Kadane's Algorithm (Max Subarray Sum).
// Approach: Optimal (Kadane's Dynamic Approach)
// Time: O(N) | Space: O(1)
// Completed from available source languages: Python, JavaScript
// This file is executable in the CodeVerse sandbox and includes a small demo runner.

function maxSubArray(nums) {
  let best = nums[0];
  let current = 0;
  for (const x of nums) {
    current = Math.max(x, current + x);
    best = Math.max(best, current);
  }
  return best;
}

console.log("max subarray sum =", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));