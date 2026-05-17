// Problem-specific implementation for Rotate Matrix by 90 Degrees.
// Approach: Optimal (Transpose + Reverse)
// Time: O(N^2) | Space: O(1)
// Completed from available source languages: JavaScript, Python, C, C++
// This file is executable in the CodeVerse sandbox and includes a small demo runner.

#include <bits/stdc++.h>
using namespace std;

#include <vector>
#include <algorithm>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int r = 0; r < n; ++r) {
        for (int c = r + 1; c < n; ++c) swap(matrix[r][c], matrix[c][r]);
    }
    for (auto& row : matrix) reverse(row.begin(), row.end());
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
    vector<vector<int>> matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    rotate(matrix);
    cout << "rotated matrix = ";
    printMatrix(matrix);
    cout << "
";
    return 0;
}