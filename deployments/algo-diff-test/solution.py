# Problem-specific implementation for Rotate Matrix by 90 Degrees.
# Approach: Optimal (Transpose + Reverse)
# Time: O(N^2) | Space: O(1)
# Completed from available source languages: JavaScript, Python, C, C++
# This file is executable in the CodeVerse sandbox and includes a small demo runner.

def rotate(matrix):
    n = len(matrix)
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    for row in matrix:
        row.reverse()

if __name__ == "__main__":
    matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    rotate(matrix)
    print("rotated matrix =", matrix)