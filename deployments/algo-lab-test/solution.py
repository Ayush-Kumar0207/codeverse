# Problem-specific implementation for Kadane's Algorithm (Max Subarray Sum).
# Approach: Optimal (Kadane's Dynamic Approach)
# Time: O(N) | Space: O(1)
# Completed from available source languages: Python, JavaScript
# This file is executable in the CodeVerse sandbox and includes a small demo runner.

def max_sub_array(nums):
    best = nums[0]
    current = 0
    for x in nums:
        current = max(x, current + x)
        best = max(best, current)
    return best

if __name__ == "__main__":
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    print("max subarray sum =", max_sub_array(nums) if "max_sub_array" in globals() else maxSubArray(nums))