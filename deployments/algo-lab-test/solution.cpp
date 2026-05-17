// Problem-specific implementation for Kadane's Algorithm (Max Subarray Sum).
// Approach: Optimal (Kadane's Dynamic Approach)
// Time: O(N) | Space: O(1)
// Completed from available source languages: Python, JavaScript
// This file is executable in the CodeVerse sandbox and includes a small demo runner.

#include <bits/stdc++.h>
using namespace std;

#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int best = nums[0];
    int current = 0;
    for (int x : nums) {
        current = max(x, current + x);
        best = max(best, current);
    }
    return best;
}

template <typename T>
void printVector(const vector<T>& values) {
    cout << "[";
    for (int i = 0; i < (int)values.size(); ++i) {
        if (i) cout << ", ";
        cout << values[i];
    }
    cout << "]";
}

template <typename T>
void printMatrix(const vector<vector<T>>& matrix) {
    cout << "[";
    for (int i = 0; i < (int)matrix.size(); ++i) {
        if (i) cout << ", ";
        printVector(matrix[i]);
    }
    cout << "]";
}

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "max subarray sum = " << maxSubArray(nums) << "
";
    return 0;
}