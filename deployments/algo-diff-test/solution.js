#include <stdio.h>
#include <stdlib.h>

void rotate_matrix(int **matrix, int n) {
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}
