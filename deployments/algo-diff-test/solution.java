// Problem-specific implementation for Rotate Matrix by 90 Degrees.
// Approach: Optimal (Transpose + Reverse)
// Time: O(N^2) | Space: O(1)
// Completed from available source languages: JavaScript, Python, C, C++
// This file is executable in the CodeVerse sandbox and includes a small demo runner.

import java.util.*;

class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int r = 0; r < n; r++) {
            for (int c = r + 1; c < n; c++) {
                int temp = matrix[r][c];
                matrix[r][c] = matrix[c][r];
                matrix[c][r] = temp;
            }
        }
        for (int[] row : matrix) {
            for (int l = 0, h = n - 1; l < h; l++, h--) {
                int temp = row[l];
                row[l] = row[h];
                row[h] = temp;
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        new Solution().rotate(matrix);
        System.out.println("rotated matrix = " + Arrays.deepToString(matrix));
    }
}