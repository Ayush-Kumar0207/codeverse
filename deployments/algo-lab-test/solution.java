// Problem-specific implementation for Kadane's Algorithm (Max Subarray Sum).
// Approach: Optimal (Kadane's Dynamic Approach)
// Time: O(N) | Space: O(1)
// Completed from available source languages: Python, JavaScript
// This file is executable in the CodeVerse sandbox and includes a small demo runner.

import java.util.*;

class Solution {
    public int maxSubArray(int[] nums) {
        int best = nums[0];
        int current = 0;
        for (int x : nums) {
            current = Math.max(x, current + x);
            best = Math.max(best, current);
        }
        return best;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("max subarray sum = " + new Solution().maxSubArray(new int[] {-2, 1, -3, 4, -1, 2, 1, -5, 4}));
    }
}