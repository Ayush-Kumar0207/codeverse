import type { AlgorithmApproach, AlgorithmEntry, CodeImplementation } from "./types";

const REQUIRED_LANGUAGES = ["C++", "Python", "Java", "JavaScript"] as const;
type RequiredLanguage = (typeof REQUIRED_LANGUAGES)[number];
type CodePack = Record<RequiredLanguage, string>;

export function completeAlgorithmImplementations(algorithms: AlgorithmEntry[]): AlgorithmEntry[] {
  return algorithms.map((algorithm) => ({
    ...algorithm,
    approaches: algorithm.approaches.map((approach) => {
      const normalizedApproach = normalizeApproachComplexity(algorithm, approach);
      return {
        ...normalizedApproach,
        implementations: completeApproachImplementations(algorithm, normalizedApproach),
      };
    }),
  }));
}

function completeApproachImplementations(
  algorithm: AlgorithmEntry,
  approach: AlgorithmApproach
): CodeImplementation[] {
  const existingByLanguage = new Map<RequiredLanguage, CodeImplementation>();
  const extras: CodeImplementation[] = [];
  const sourceLanguages =
    approach.implementations?.map((implementation) => implementation.language).join(", ") || "none";
  const specificCodePack = getSpecificCodePack(algorithm, approach);

  for (const implementation of approach.implementations || []) {
    const canonical = canonicalLanguage(implementation.language);
    if (!canonical) {
      if (!hasPlaceholderCode(implementation.code || "")) {
        extras.push(implementation);
      }
      continue;
    }

    const shouldUseVerifiedCppPack = canonical === "C++" && Boolean(specificCodePack);
    if (
      !existingByLanguage.has(canonical)
      && !shouldUseVerifiedCppPack
      && !shouldReplaceImplementation(algorithm, canonical, implementation)
    ) {
      existingByLanguage.set(canonical, {
        ...implementation,
        language: canonical,
      });
    }
  }

  const requiredImplementations = REQUIRED_LANGUAGES.flatMap((language) => {
    const existing = existingByLanguage.get(language);
    if (existing) return [existing];
    if (!specificCodePack) return [];

    return [createGeneratedImplementation(algorithm, approach, language, sourceLanguages, specificCodePack)];
  });

  return [...requiredImplementations, ...extras].filter(
    (implementation) => !hasPlaceholderCode(implementation.code || "")
  );
}

function canonicalLanguage(language: string): RequiredLanguage | undefined {
  const normalized = language.trim().toLowerCase();
  if (normalized === "c++" || normalized === "cpp" || normalized === "cxx") return "C++";
  if (normalized === "python" || normalized === "py") return "Python";
  if (normalized === "java") return "Java";
  if (normalized === "javascript" || normalized === "js" || normalized === "ecmascript") return "JavaScript";
  return undefined;
}

function createGeneratedImplementation(
  algorithm: AlgorithmEntry,
  approach: AlgorithmApproach,
  language: RequiredLanguage,
  sourceLanguages: string,
  specificCodePack: CodePack
): CodeImplementation {
  return {
    language,
    code: withHeader(
      specificCodePack[language],
      algorithm,
      approach,
      language,
      sourceLanguages
    ),
  };
}

function withHeader(
  code: string,
  algorithm: AlgorithmEntry,
  approach: AlgorithmApproach,
  language: RequiredLanguage,
  sourceLanguages: string
) {
  const prefix = language === "Python" ? "#" : "//";
  const runnableCode = makeRunnableSource(code.trim(), language);
  return [
    `${prefix} Problem-specific implementation for ${safeInline(algorithm.title)}.`,
    `${prefix} Approach: ${safeInline(approach.name)}`,
    `${prefix} Time: ${safeInline(approach.timeComplexity)} | Space: ${safeInline(approach.spaceComplexity)}`,
    `${prefix} Completed from available source languages: ${safeInline(sourceLanguages)}`,
    `${prefix} This file is executable in the CodeVerse sandbox and includes a small demo runner.`,
    "",
    runnableCode,
  ].join("\n");
}

function makeRunnableSource(code: string, language: RequiredLanguage) {
  if (language === "C++") return makeRunnableCpp(code);
  if (language === "Python") return makeRunnablePython(code);
  if (language === "Java") return makeRunnableJava(code);
  return makeRunnableJavaScript(code);
}

function makeRunnableCpp(code: string) {
  const body = code.trim();
  const listPrinter = body.includes("ListNode")
    ? `
void printLinkedList(ListNode* head) {
    cout << "[";
    for (ListNode* node = head; node; node = node->next) {
        if (node != head) cout << ", ";
        cout << node->val;
    }
    cout << "]";
}
`
    : "";

  return `#include <bits/stdc++.h>
using namespace std;

${body}

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
${listPrinter}
int main() {
${cppDemoInvocation(body)}
    return 0;
}`;
}

function cppDemoInvocation(code: string) {
  if (code.includes("void sortColors(")) {
    return `    vector<int> nums = {2, 0, 2, 1, 1, 0};
    sortColors(nums);
    cout << "sorted colors = ";
    printVector(nums);
    cout << "\\n";`;
  }
  if (code.includes("void nextPermutation(")) {
    return `    vector<int> nums = {1, 3, 5, 4, 2};
    nextPermutation(nums);
    cout << "next permutation = ";
    printVector(nums);
    cout << "\\n";`;
  }
  if (code.includes("int majorityElement(")) {
    return `    vector<int> nums = {2, 2, 1, 1, 1, 2, 2};
    cout << "majority element = " << majorityElement(nums) << "\\n";`;
  }
  if (code.includes("vector<int> rearrangeArray(")) {
    return `    vector<int> nums = {3, 1, -2, -5, 2, -4};
    cout << "rearranged = ";
    printVector(rearrangeArray(nums));
    cout << "\\n";`;
  }
  if (code.includes("int maxSubArray(")) {
    return `    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "max subarray sum = " << maxSubArray(nums) << "\\n";`;
  }
  if (code.includes("vector<int> twoSum(")) {
    return `    vector<int> nums = {2, 7, 11, 15};
    cout << "two sum indices = ";
    printVector(twoSum(nums, 9));
    cout << "\\n";`;
  }
  if (code.includes("int subarraySum(")) {
    return `    vector<int> nums = {1, 2, 3, -2, 5};
    cout << "subarrays summing to 3 = " << subarraySum(nums, 3) << "\\n";`;
  }
  if (code.includes("vector<vector<int>> merge(")) {
    return `    vector<vector<int>> intervals = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
    cout << "merged intervals = ";
    printMatrix(merge(intervals));
    cout << "\\n";`;
  }
  if (code.includes("int findDuplicate(")) {
    return `    vector<int> nums = {1, 3, 4, 2, 2};
    cout << "duplicate = " << findDuplicate(nums) << "\\n";`;
  }
  if (code.includes("int maxProfit(")) {
    return `    vector<int> prices = {7, 1, 5, 3, 6, 4};
    cout << "max profit = " << maxProfit(prices) << "\\n";`;
  }
  if (code.includes("vector<int> leaders(")) {
    return `    vector<int> nums = {16, 17, 4, 3, 5, 2};
    cout << "leaders = ";
    printVector(leaders(nums));
    cout << "\\n";`;
  }
  if (code.includes("int longestConsecutive(")) {
    return `    vector<int> nums = {100, 4, 200, 1, 3, 2};
    cout << "longest consecutive length = " << longestConsecutive(nums) << "\\n";`;
  }
  if (code.includes("void setZeroes(")) {
    return `    vector<vector<int>> matrix = {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}};
    setZeroes(matrix);
    cout << "zeroed matrix = ";
    printMatrix(matrix);
    cout << "\\n";`;
  }
  if (code.includes("void rotate(")) {
    return `    vector<vector<int>> matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    rotate(matrix);
    cout << "rotated matrix = ";
    printMatrix(matrix);
    cout << "\\n";`;
  }
  if (code.includes("vector<int> spiralOrder(")) {
    return `    vector<vector<int>> matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    cout << "spiral order = ";
    printVector(spiralOrder(matrix));
    cout << "\\n";`;
  }
  if (code.includes("vector<vector<int>> generate(")) {
    return `    cout << "pascal rows = ";
    printMatrix(generate(5));
    cout << "\\n";`;
  }
  if (code.includes("vector<vector<int>> threeSum(")) {
    return `    vector<int> nums = {-1, 0, 1, 2, -1, -4};
    cout << "3sum triplets = ";
    printMatrix(threeSum(nums));
    cout << "\\n";`;
  }
  if (code.includes("int lowerBound(")) {
    return `    vector<int> nums = {1, 3, 3, 5, 8};
    cout << "lower bound for 4 = " << lowerBound(nums, 4) << "\\n";`;
  }
  if (code.includes("int longestWindowAtMostK(")) {
    return `    vector<int> nums = {2, 1, 3, 2, 4, 1};
    cout << "longest window at most 6 = " << longestWindowAtMostK(nums, 6) << "\\n";`;
  }
  if (code.includes("int maxDepth(TreeNode*")) {
    return `    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->left = new TreeNode(4);
    cout << "max depth = " << maxDepth(root) << "\\n";`;
  }
  if (code.includes("ListNode* reverseList(")) {
    return `    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    head->next->next = new ListNode(3);
    cout << "reversed list = ";
    printLinkedList(reverseList(head));
    cout << "\\n";`;
  }
  if (code.includes("vector<int> bfs(")) {
    return `    vector<vector<int>> adj = {{1, 2}, {0, 3}, {0}, {1}};
    cout << "bfs order = ";
    printVector(bfs(4, adj, 0));
    cout << "\\n";`;
  }
  if (code.includes("vector<int> nextGreaterElements(")) {
    return `    vector<int> nums = {2, 1, 2, 4, 3};
    cout << "next greater = ";
    printVector(nextGreaterElements(nums));
    cout << "\\n";`;
  }
  if (code.includes("vector<int> topKFrequent(")) {
    return `    vector<int> nums = {1, 1, 1, 2, 2, 3};
    cout << "top frequent = ";
    printVector(topKFrequent(nums, 2));
    cout << "\\n";`;
  }
  if (code.includes("class Trie")) {
    return `    Trie trie;
    trie.insert("code");
    trie.insert("coder");
    cout << boolalpha << "search code = " << trie.search("code") << "\\n";`;
  }
  if (code.includes("bool subsetSum(")) {
    return `    vector<int> nums = {2, 3, 7, 8, 10};
    cout << boolalpha << "subset sum 11 = " << subsetSum(nums, 11) << "\\n";`;
  }
  if (code.includes("vector<vector<int>> subsets(")) {
    return `    vector<int> nums = {1, 2, 3};
    cout << "subsets = ";
    printMatrix(subsets(nums));
    cout << "\\n";`;
  }
  if (code.includes("int maxNonOverlappingIntervals(")) {
    return `    vector<vector<int>> intervals = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};
    cout << "non-overlapping intervals = " << maxNonOverlappingIntervals(intervals) << "\\n";`;
  }
  if (code.includes("int countSetBits(")) {
    return `    cout << "set bits in 29 = " << countSetBits(29) << "\\n";`;
  }
  if (code.includes("string longestCommonPrefix(")) {
    return `    vector<string> words = {"flower", "flow", "flight"};
    cout << "longest common prefix = " << longestCommonPrefix(words) << "\\n";`;
  }
  if (code.includes("int countDigits(")) {
    return `    cout << "digit count = " << countDigits(9876) << "\\n";`;
  }
  return `    vector<int> nums = {3, -2, 5, -1, 6};
    cout << "prefix total = " << prefixTotal(nums) << "\\n";`;
}

function makeRunnablePython(code: string) {
  const body = code.trim();
  return `${body}

${pythonDemoInvocation(body)}`;
}

function pythonDemoInvocation(code: string) {
  if (code.includes("def sort_colors") || code.includes("def sortColors")) {
    return `if __name__ == "__main__":
    nums = [2, 0, 2, 1, 1, 0]
    result = sort_colors(nums) if "sort_colors" in globals() else sortColors(nums)
    print("sorted colors =", result if result is not None else nums)`;
  }
  if (code.includes("def next_permutation")) {
    return `if __name__ == "__main__":
    nums = [1, 3, 5, 4, 2]
    print("next permutation =", next_permutation(nums))`;
  }
  if (code.includes("def majority_element")) {
    return `if __name__ == "__main__":
    print("majority element =", majority_element([2, 2, 1, 1, 1, 2, 2]))`;
  }
  if (code.includes("def rearrange_array")) {
    return `if __name__ == "__main__":
    print("rearranged =", rearrange_array([3, 1, -2, -5, 2, -4]))`;
  }
  if (code.includes("def max_sub_array") || code.includes("def maxSubArray")) {
    return `if __name__ == "__main__":
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    print("max subarray sum =", max_sub_array(nums) if "max_sub_array" in globals() else maxSubArray(nums))`;
  }
  if (code.includes("def two_sum") || code.includes("def twoSum")) {
    return `if __name__ == "__main__":
    print("two sum indices =", two_sum([2, 7, 11, 15], 9) if "two_sum" in globals() else twoSum([2, 7, 11, 15], 9))`;
  }
  if (code.includes("def subarray_sum")) return `if __name__ == "__main__":
    print("subarrays summing to 3 =", subarray_sum([1, 2, 3, -2, 5], 3))`;
  if (code.includes("def merge(")) return `if __name__ == "__main__":
    print("merged intervals =", merge([[1, 3], [2, 6], [8, 10], [15, 18]]))`;
  if (code.includes("def find_duplicate")) return `if __name__ == "__main__":
    print("duplicate =", find_duplicate([1, 3, 4, 2, 2]))`;
  if (code.includes("def max_profit")) return `if __name__ == "__main__":
    print("max profit =", max_profit([7, 1, 5, 3, 6, 4]))`;
  if (code.includes("def leaders(")) return `if __name__ == "__main__":
    print("leaders =", leaders([16, 17, 4, 3, 5, 2]))`;
  if (code.includes("def longest_consecutive")) return `if __name__ == "__main__":
    print("longest consecutive length =", longest_consecutive([100, 4, 200, 1, 3, 2]))`;
  if (code.includes("def set_zeroes")) return `if __name__ == "__main__":
    matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
    set_zeroes(matrix)
    print("zeroed matrix =", matrix)`;
  if (code.includes("def rotate(")) return `if __name__ == "__main__":
    matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    rotate(matrix)
    print("rotated matrix =", matrix)`;
  if (code.includes("def spiral_order")) return `if __name__ == "__main__":
    print("spiral order =", spiral_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))`;
  if (code.includes("def generate(")) return `if __name__ == "__main__":
    print("pascal rows =", generate(5))`;
  if (code.includes("def three_sum")) return `if __name__ == "__main__":
    print("3sum triplets =", three_sum([-1, 0, 1, 2, -1, -4]))`;
  if (code.includes("def lower_bound")) return `if __name__ == "__main__":
    print("lower bound for 4 =", lower_bound([1, 3, 3, 5, 8], 4))`;
  if (code.includes("def longest_window_at_most_k")) return `if __name__ == "__main__":
    print("longest window at most 6 =", longest_window_at_most_k([2, 1, 3, 2, 4, 1], 6))`;
  if (code.includes("def max_depth")) return `if __name__ == "__main__":
    root = TreeNode(1, TreeNode(2, TreeNode(4)), TreeNode(3))
    print("max depth =", max_depth(root))`;
  if (code.includes("def reverse_list")) return `if __name__ == "__main__":
    head = ListNode(1, ListNode(2, ListNode(3)))
    node = reverse_list(head)
    out = []
    while node:
        out.append(node.val)
        node = node.next
    print("reversed list =", out)`;
  if (code.includes("def bfs(")) return `if __name__ == "__main__":
    print("bfs order =", bfs(4, [[1, 2], [0, 3], [0], [1]], 0))`;
  if (code.includes("def next_greater_elements")) return `if __name__ == "__main__":
    print("next greater =", next_greater_elements([2, 1, 2, 4, 3]))`;
  if (code.includes("def top_k_frequent")) return `if __name__ == "__main__":
    print("top frequent =", top_k_frequent([1, 1, 1, 2, 2, 3], 2))`;
  if (code.includes("class Trie")) return `if __name__ == "__main__":
    trie = Trie()
    trie.insert("code")
    trie.insert("coder")
    print("search code =", trie.search("code"))`;
  if (code.includes("def subset_sum")) return `if __name__ == "__main__":
    print("subset sum 11 =", subset_sum([2, 3, 7, 8, 10], 11))`;
  if (code.includes("def subsets(")) return `if __name__ == "__main__":
    print("subsets =", subsets([1, 2, 3]))`;
  if (code.includes("def max_non_overlapping_intervals")) return `if __name__ == "__main__":
    print("non-overlapping intervals =", max_non_overlapping_intervals([[1, 2], [2, 3], [3, 4], [1, 3]]))`;
  if (code.includes("def count_set_bits")) return `if __name__ == "__main__":
    print("set bits in 29 =", count_set_bits(29))`;
  if (code.includes("def longest_common_prefix")) return `if __name__ == "__main__":
    print("longest common prefix =", longest_common_prefix(["flower", "flow", "flight"]))`;
  if (code.includes("def count_digits")) return `if __name__ == "__main__":
    print("digit count =", count_digits(9876))`;
  return `if __name__ == "__main__":
    print("prefix total =", prefix_total([3, -2, 5, -1, 6]))`;
}

function makeRunnableJava(code: string) {
  const body = code.trim();
  return `import java.util.*;

${body}

public class Main {
    public static void main(String[] args) {
${javaDemoInvocation(body)}
    }
}`;
}

function javaDemoInvocation(code: string) {
  if (code.includes("void sortColors(")) return `        int[] nums = {2, 0, 2, 1, 1, 0};
        new Solution().sortColors(nums);
        System.out.println("sorted colors = " + Arrays.toString(nums));`;
  if (code.includes("void nextPermutation(")) return `        int[] nums = {1, 3, 5, 4, 2};
        new Solution().nextPermutation(nums);
        System.out.println("next permutation = " + Arrays.toString(nums));`;
  if (code.includes("int majorityElement(")) return `        System.out.println("majority element = " + new Solution().majorityElement(new int[] {2, 2, 1, 1, 1, 2, 2}));`;
  if (code.includes("int[] rearrangeArray(")) return `        int[] nums = {3, 1, -2, -5, 2, -4};
        System.out.println("rearranged = " + Arrays.toString(new Solution().rearrangeArray(nums)));`;
  if (code.includes("int maxSubArray(")) return `        System.out.println("max subarray sum = " + new Solution().maxSubArray(new int[] {-2, 1, -3, 4, -1, 2, 1, -5, 4}));`;
  if (code.includes("int[] twoSum(")) return `        System.out.println("two sum indices = " + Arrays.toString(new Solution().twoSum(new int[] {2, 7, 11, 15}, 9)));`;
  if (code.includes("int subarraySum(")) return `        System.out.println("subarrays summing to 3 = " + new Solution().subarraySum(new int[] {1, 2, 3, -2, 5}, 3));`;
  if (code.includes("int[][] merge(")) return `        int[][] intervals = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
        System.out.println("merged intervals = " + Arrays.deepToString(new Solution().merge(intervals)));`;
  if (code.includes("int findDuplicate(")) return `        System.out.println("duplicate = " + new Solution().findDuplicate(new int[] {1, 3, 4, 2, 2}));`;
  if (code.includes("int maxProfit(")) return `        System.out.println("max profit = " + new Solution().maxProfit(new int[] {7, 1, 5, 3, 6, 4}));`;
  if (code.includes("List<Integer> leaders(")) return `        System.out.println("leaders = " + new Solution().leaders(new int[] {16, 17, 4, 3, 5, 2}));`;
  if (code.includes("int longestConsecutive(")) return `        System.out.println("longest consecutive length = " + new Solution().longestConsecutive(new int[] {100, 4, 200, 1, 3, 2}));`;
  if (code.includes("void setZeroes(")) return `        int[][] matrix = {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}};
        new Solution().setZeroes(matrix);
        System.out.println("zeroed matrix = " + Arrays.deepToString(matrix));`;
  if (code.includes("void rotate(")) return `        int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        new Solution().rotate(matrix);
        System.out.println("rotated matrix = " + Arrays.deepToString(matrix));`;
  if (code.includes("List<Integer> spiralOrder(")) return `        int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        System.out.println("spiral order = " + new Solution().spiralOrder(matrix));`;
  if (code.includes("List<List<Integer>> generate(")) return `        System.out.println("pascal rows = " + new Solution().generate(5));`;
  if (code.includes("List<List<Integer>> threeSum(")) return `        System.out.println("3sum triplets = " + new Solution().threeSum(new int[] {-1, 0, 1, 2, -1, -4}));`;
  if (code.includes("int lowerBound(")) return `        System.out.println("lower bound for 4 = " + new Solution().lowerBound(new int[] {1, 3, 3, 5, 8}, 4));`;
  if (code.includes("int longestWindowAtMostK(")) return `        System.out.println("longest window at most 6 = " + new Solution().longestWindowAtMostK(new int[] {2, 1, 3, 2, 4, 1}, 6));`;
  if (code.includes("int maxDepth(TreeNode")) return `        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        System.out.println("max depth = " + new Solution().maxDepth(root));`;
  if (code.includes("ListNode reverseList(")) return `        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        ListNode node = new Solution().reverseList(head);
        List<Integer> out = new ArrayList<>();
        while (node != null) { out.add(node.val); node = node.next; }
        System.out.println("reversed list = " + out);`;
  if (code.includes("List<Integer> bfs(")) return `        List<List<Integer>> adj = new ArrayList<>();
        adj.add(Arrays.asList(1, 2));
        adj.add(Arrays.asList(0, 3));
        adj.add(Arrays.asList(0));
        adj.add(Arrays.asList(1));
        System.out.println("bfs order = " + new Solution().bfs(4, adj, 0));`;
  if (code.includes("int[] nextGreaterElements(")) return `        System.out.println("next greater = " + Arrays.toString(new Solution().nextGreaterElements(new int[] {2, 1, 2, 4, 3})));`;
  if (code.includes("int[] topKFrequent(")) return `        System.out.println("top frequent = " + Arrays.toString(new Solution().topKFrequent(new int[] {1, 1, 1, 2, 2, 3}, 2)));`;
  if (code.includes("class Trie")) return `        Trie trie = new Trie();
        trie.insert("code");
        trie.insert("coder");
        System.out.println("search code = " + trie.search("code"));`;
  if (code.includes("boolean subsetSum(")) return `        System.out.println("subset sum 11 = " + new Solution().subsetSum(new int[] {2, 3, 7, 8, 10}, 11));`;
  if (code.includes("List<List<Integer>> subsets(")) return `        System.out.println("subsets = " + new Solution().subsets(new int[] {1, 2, 3}));`;
  if (code.includes("int maxNonOverlappingIntervals(")) return `        int[][] intervals = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};
        System.out.println("non-overlapping intervals = " + new Solution().maxNonOverlappingIntervals(intervals));`;
  if (code.includes("int countSetBits(")) return `        System.out.println("set bits in 29 = " + new Solution().countSetBits(29));`;
  if (code.includes("String longestCommonPrefix(")) return `        System.out.println("longest common prefix = " + new Solution().longestCommonPrefix(new String[] {"flower", "flow", "flight"}));`;
  if (code.includes("int countDigits(")) return `        System.out.println("digit count = " + new Solution().countDigits(9876));`;
  return `        System.out.println("prefix total = " + new Solution().prefixTotal(new int[] {3, -2, 5, -1, 6}));`;
}

function makeRunnableJavaScript(code: string) {
  const body = code.trim();
  return `${body}

${jsDemoInvocation(body)}`;
}

function jsDemoInvocation(code: string) {
  if (code.includes("function sortColors(")) return `const nums = [2, 0, 2, 1, 1, 0];
console.log("sorted colors =", JSON.stringify(sortColors(nums) ?? nums));`;
  if (code.includes("function nextPermutation(")) return `const nums = [1, 3, 5, 4, 2];
console.log("next permutation =", JSON.stringify(nextPermutation(nums)));`;
  if (code.includes("function majorityElement(")) return `console.log("majority element =", majorityElement([2, 2, 1, 1, 1, 2, 2]));`;
  if (code.includes("function rearrangeArray(")) return `console.log("rearranged =", JSON.stringify(rearrangeArray([3, 1, -2, -5, 2, -4])));`;
  if (code.includes("function maxSubArray(")) return `console.log("max subarray sum =", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`;
  if (code.includes("function twoSum(")) return `console.log("two sum indices =", JSON.stringify(twoSum([2, 7, 11, 15], 9)));`;
  if (code.includes("function subarraySum(")) return `console.log("subarrays summing to 3 =", subarraySum([1, 2, 3, -2, 5], 3));`;
  if (code.includes("function merge(")) return `console.log("merged intervals =", JSON.stringify(merge([[1, 3], [2, 6], [8, 10], [15, 18]])));`;
  if (code.includes("function findDuplicate(")) return `console.log("duplicate =", findDuplicate([1, 3, 4, 2, 2]));`;
  if (code.includes("function maxProfit(")) return `console.log("max profit =", maxProfit([7, 1, 5, 3, 6, 4]));`;
  if (code.includes("function leaders(")) return `console.log("leaders =", JSON.stringify(leaders([16, 17, 4, 3, 5, 2])));`;
  if (code.includes("function longestConsecutive(")) return `console.log("longest consecutive length =", longestConsecutive([100, 4, 200, 1, 3, 2]));`;
  if (code.includes("function setZeroes(")) return `const matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
setZeroes(matrix);
console.log("zeroed matrix =", JSON.stringify(matrix));`;
  if (code.includes("function rotate(")) return `const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
rotate(matrix);
console.log("rotated matrix =", JSON.stringify(matrix));`;
  if (code.includes("function spiralOrder(")) return `console.log("spiral order =", JSON.stringify(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])));`;
  if (code.includes("function generate(")) return `console.log("pascal rows =", JSON.stringify(generate(5)));`;
  if (code.includes("function threeSum(")) return `console.log("3sum triplets =", JSON.stringify(threeSum([-1, 0, 1, 2, -1, -4])));`;
  if (code.includes("function lowerBound(")) return `console.log("lower bound for 4 =", lowerBound([1, 3, 3, 5, 8], 4));`;
  if (code.includes("function longestWindowAtMostK(")) return `console.log("longest window at most 6 =", longestWindowAtMostK([2, 1, 3, 2, 4, 1], 6));`;
  if (code.includes("function maxDepth(")) return `const root = new TreeNode(1, new TreeNode(2, new TreeNode(4)), new TreeNode(3));
console.log("max depth =", maxDepth(root));`;
  if (code.includes("function reverseList(")) return `const head = new ListNode(1, new ListNode(2, new ListNode(3)));
let node = reverseList(head);
const out = [];
while (node) { out.push(node.val); node = node.next; }
console.log("reversed list =", JSON.stringify(out));`;
  if (code.includes("function bfs(")) return `console.log("bfs order =", JSON.stringify(bfs(4, [[1, 2], [0, 3], [0], [1]], 0)));`;
  if (code.includes("function nextGreaterElements(")) return `console.log("next greater =", JSON.stringify(nextGreaterElements([2, 1, 2, 4, 3])));`;
  if (code.includes("function topKFrequent(")) return `console.log("top frequent =", JSON.stringify(topKFrequent([1, 1, 1, 2, 2, 3], 2)));`;
  if (code.includes("class Trie")) return `const trie = new Trie();
trie.insert("code");
trie.insert("coder");
console.log("search code =", trie.search("code"));`;
  if (code.includes("function subsetSum(")) return `console.log("subset sum 11 =", subsetSum([2, 3, 7, 8, 10], 11));`;
  if (code.includes("function subsets(")) return `console.log("subsets =", JSON.stringify(subsets([1, 2, 3])));`;
  if (code.includes("function maxNonOverlappingIntervals(")) return `console.log("non-overlapping intervals =", maxNonOverlappingIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]));`;
  if (code.includes("function countSetBits(")) return `console.log("set bits in 29 =", countSetBits(29));`;
  if (code.includes("function longestCommonPrefix(")) return `console.log("longest common prefix =", longestCommonPrefix(["flower", "flow", "flight"]));`;
  if (code.includes("function countDigits(")) return `console.log("digit count =", countDigits(9876));`;
  return `console.log("prefix total =", prefixTotal([3, -2, 5, -1, 6]));`;
}

function shouldReplaceImplementation(
  algorithm: AlgorithmEntry,
  language: RequiredLanguage,
  implementation: CodeImplementation
) {
  const code = implementation.code || "";
  if (hasPlaceholderCode(code)) return true;
  if (code.includes("Auto-completed") || code.includes("reference scaffold")) return true;
  if (code.includes("Adapt the input/output signature") || code.includes("Implement the selected approach")) return true;
  if (code.includes("// Logic for") || code.includes("High-performance")) return true;

  if (language === "C++") {
    return (
      /\.length(?!\s*\()/.test(code) ||
      code.includes("return candidate if") ||
      code.includes(" if count ") ||
      code.includes("# Check")
    );
  }

  return false;
}

function hasPlaceholderCode(code: string) {
  const trimmed = code.trim();
  return /\{\s*(?:\.{3}|…)\s*\}/.test(trimmed) || /^(?:\/\/|#)\s*(?:\.{3}|…)/m.test(trimmed);
}

function normalizeApproachComplexity(
  algorithm: AlgorithmEntry,
  approach: AlgorithmApproach
): AlgorithmApproach {
  const timeUnknown = isUnknownComplexity(approach.timeComplexity);
  const spaceUnknown = isUnknownComplexity(approach.spaceComplexity);
  if (!timeUnknown && !spaceUnknown) return approach;

  const inferred = inferComplexity(algorithm, approach);
  return {
    ...approach,
    timeComplexity: timeUnknown ? inferred.time : approach.timeComplexity,
    timeComplexityExplanation:
      timeUnknown && !approach.timeComplexityExplanation
        ? inferred.timeExplanation
        : approach.timeComplexityExplanation,
    spaceComplexity: spaceUnknown ? inferred.space : approach.spaceComplexity,
    spaceComplexityExplanation:
      spaceUnknown && !approach.spaceComplexityExplanation
        ? inferred.spaceExplanation
        : approach.spaceComplexityExplanation,
  };
}

function inferComplexity(algorithm: AlgorithmEntry, approach: AlgorithmApproach) {
  const haystack = getSearchText(algorithm, approach);

  if (haystack.includes("kadane") || haystack.includes("maximum subarray")) {
    return {
      time: "O(N)",
      space: "O(1)",
      timeExplanation: "Kadane's algorithm scans the array once and updates the best running sum at each element.",
      spaceExplanation: "Only the current sum and best sum are stored.",
    };
  }

  if (haystack.includes("count digits")) {
    return {
      time: "O(log10 N)",
      space: "O(1)",
      timeExplanation: "Each division by 10 removes one digit, so the loop runs once per digit.",
      spaceExplanation: "The algorithm keeps only a counter and the current number.",
    };
  }

  if (haystack.includes("binary search") || haystack.includes("lower bound") || haystack.includes("upper bound")) {
    return {
      time: "O(log N)",
      space: "O(1)",
      timeExplanation: "The search interval is halved after each comparison.",
      spaceExplanation: "Only boundary pointers and a midpoint are stored.",
    };
  }

  if (haystack.includes("graph") || haystack.includes("bfs") || haystack.includes("dfs")) {
    return {
      time: "O(V + E)",
      space: "O(V)",
      timeExplanation: "Each vertex and edge is processed a bounded number of times.",
      spaceExplanation: "Visited state and the traversal frontier can grow with the number of vertices.",
    };
  }

  return {
    time: "O(N)",
    space: "O(1)",
    timeExplanation: "The approach processes each input item a bounded number of times.",
    spaceExplanation: "The approach keeps only a small fixed set of variables beyond the input and output.",
  };
}

function getSpecificCodePack(algorithm: AlgorithmEntry, approach: AlgorithmApproach): CodePack | undefined {
  const text = getSearchText(algorithm, approach);

  if (algorithm.id === "3-sum") return threeSumCode();
  if (algorithm.id === "4-sum") return undefined;

  if (text.includes("kadane") || text.includes("maximum subarray")) return kadaneCode();
  if (algorithm.id === "two-sum" || text.includes("two sum")) return twoSumCode();
  if (algorithm.id === "sort-an-array-of-0-s-1-s-and-2-s" || text.includes("sort colors") || text.includes("sort 0s")) return sortColorsCode();
  if (text.includes("subarray sum equals k")) return subarraySumKCode();
  if (text.includes("merge intervals")) return mergeIntervalsCode();
  if (text.includes("next permutation")) return nextPermutationCode();
  if (algorithm.id === "find-the-duplicate-number") return findDuplicateCode();
  if (text.includes("majority element") && (text.includes("n/2") || text.includes("n 2") || text.includes(">n/2"))) return majorityElementCode();
  if (text.includes("best time to buy and sell stock") && !text.includes(" ii") && !text.includes(" iii")) return stockOneCode();
  if (text.includes("rearrange array elements by sign")) return rearrangeBySignCode();
  if (text.includes("leaders in an array")) return leadersCode();
  if (text.includes("longest consecutive")) return longestConsecutiveCode();
  if (text.includes("set matrix zero")) return setMatrixZeroesCode();
  if (text.includes("rotate matrix")) return rotateMatrixCode();
  if (text.includes("spiral matrix")) return spiralMatrixCode();
  if (text.includes("pascal")) return pascalTriangleCode();
  if (text.includes("3 sum") || text.includes("3sum")) return threeSumCode();

  return undefined;
}

function getPatternCodePack(algorithm: AlgorithmEntry, approach: AlgorithmApproach): CodePack {
  const text = getSearchText(algorithm, approach);

  if (text.includes("binary search") || text.includes("lower bound") || text.includes("upper bound")) {
    return lowerBoundPatternCode();
  }
  if (text.includes("sliding window") || text.includes("window")) return slidingWindowPatternCode();
  if (text.includes("prefix") || text.includes("subarray") || text.includes("xor")) return prefixHashPatternCode();
  if (text.includes("tree") || text.includes("bst")) return treeDepthPatternCode();
  if (text.includes("linkedlist") || text.includes("linked list") || text.includes(" ll")) return linkedListReversePatternCode();
  if (text.includes("graph") || text.includes("bfs") || text.includes("dfs")) return graphBfsPatternCode();
  if (text.includes("stack") || text.includes("queue") || text.includes("monotonic")) return stackPatternCode();
  if (text.includes("heap") || text.includes("priority queue") || text.includes("top k")) return heapPatternCode();
  if (text.includes("trie")) return triePatternCode();
  if (text.includes("dynamic programming") || text.includes(" dp") || text.includes("knapsack")) return dpSubsetPatternCode();
  if (text.includes("recursion") || text.includes("backtracking") || text.includes("subsets")) return subsetsPatternCode();
  if (text.includes("greedy") || text.includes("interval")) return greedyIntervalsPatternCode();
  if (text.includes("bit")) return bitCountPatternCode();
  if (text.includes("string")) return stringPrefixPatternCode();
  if (text.includes("math") || text.includes("digit")) return countDigitsPatternCode();
  if (text.includes("sort")) return mergeIntervalsCode();

  return arrayScanPatternCode();
}

function kadaneCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int best = nums[0];
    int current = 0;
    for (int x : nums) {
        current = max(x, current + x);
        best = max(best, current);
    }
    return best;
}`,
    Python: `def max_sub_array(nums):
    best = nums[0]
    current = 0
    for x in nums:
        current = max(x, current + x)
        best = max(best, current)
    return best`,
    Java: `class Solution {
    public int maxSubArray(int[] nums) {
        int best = nums[0];
        int current = 0;
        for (int x : nums) {
            current = Math.max(x, current + x);
            best = Math.max(best, current);
        }
        return best;
    }
}`,
    JavaScript: `function maxSubArray(nums) {
  let best = nums[0];
  let current = 0;
  for (const x of nums) {
    current = Math.max(x, current + x);
    best = Math.max(best, current);
  }
  return best;
}`,
  };
}

function twoSumCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    vector<pair<int, int>> values;
    for (int i = 0; i < (int)nums.size(); ++i) values.push_back({nums[i], i});
    sort(values.begin(), values.end());
    int left = 0, right = (int)values.size() - 1;
    while (left < right) {
        long long sum = 1LL * values[left].first + values[right].first;
        if (sum == target) return {values[left].second, values[right].second};
        if (sum < target) ++left;
        else --right;
    }
    return {};
}`,
    Python: `def two_sum(nums, target):
    values = sorted((value, index) for index, value in enumerate(nums))
    left, right = 0, len(values) - 1
    while left < right:
        total = values[left][0] + values[right][0]
        if total == target:
            return [values[left][1], values[right][1]]
        if total < target:
            left += 1
        else:
            right -= 1
    return []`,
    Java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Integer[] order = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) order[i] = i;
        Arrays.sort(order, Comparator.comparingInt(i -> nums[i]));
        int left = 0, right = nums.length - 1;
        while (left < right) {
            long sum = (long) nums[order[left]] + nums[order[right]];
            if (sum == target) return new int[] { order[left], order[right] };
            if (sum < target) left++;
            else right--;
        }
        return new int[0];
    }
}`,
    JavaScript: `function twoSum(nums, target) {
  const values = nums.map((value, index) => [value, index]).sort((a, b) => a[0] - b[0]);
  let left = 0;
  let right = values.length - 1;
  while (left < right) {
    const sum = values[left][0] + values[right][0];
    if (sum === target) return [values[left][1], values[right][1]];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
  };
}

function sortColorsCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = (int)nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`,
    Python: `def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    return nums`,
    Java: `import java.util.*;

class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int temp = nums[mid];
                nums[mid] = nums[high];
                nums[high] = temp;
                high--;
            }
        }
    }
}`,
    JavaScript: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}`,
  };
}

function subarraySumKCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    freq[0] = 1;
    int prefix = 0;
    int count = 0;
    for (int x : nums) {
        prefix += x;
        count += freq[prefix - k];
        freq[prefix]++;
    }
    return count;
}`,
    Python: `from collections import defaultdict

def subarray_sum(nums, k):
    freq = defaultdict(int)
    freq[0] = 1
    prefix = 0
    count = 0
    for x in nums:
        prefix += x
        count += freq[prefix - k]
        freq[prefix] += 1
    return count`,
    Java: `import java.util.*;

class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        freq.put(0, 1);
        int prefix = 0;
        int count = 0;
        for (int x : nums) {
            prefix += x;
            count += freq.getOrDefault(prefix - k, 0);
            freq.put(prefix, freq.getOrDefault(prefix, 0) + 1);
        }
        return count;
    }
}`,
    JavaScript: `function subarraySum(nums, k) {
  const freq = new Map([[0, 1]]);
  let prefix = 0;
  let count = 0;
  for (const x of nums) {
    prefix += x;
    count += freq.get(prefix - k) || 0;
    freq.set(prefix, (freq.get(prefix) || 0) + 1);
  }
  return count;
}`,
  };
}

function mergeIntervalsCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for (auto interval : intervals) {
        if (merged.empty() || interval[0] > merged.back()[1]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}`,
    Python: `def merge(intervals):
    intervals.sort()
    merged = []
    for start, end in intervals:
        if not merged or start > merged[-1][1]:
            merged.append([start, end])
        else:
            merged[-1][1] = max(merged[-1][1], end)
    return merged`,
    Java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] interval : intervals) {
            if (merged.isEmpty() || interval[0] > merged.get(merged.size() - 1)[1]) {
                merged.add(interval);
            } else {
                int[] last = merged.get(merged.size() - 1);
                last[1] = Math.max(last[1], interval[1]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`,
    JavaScript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of intervals) {
    if (!merged.length || start > merged[merged.length - 1][1]) {
      merged.push([start, end]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
    }
  }
  return merged;
}`,
  };
}

function nextPermutationCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

void nextPermutation(vector<int>& nums) {
    int i = (int)nums.size() - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = (int)nums.size() - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums[i], nums[j]);
    }
    reverse(nums.begin() + i + 1, nums.end());
}`,
    Python: `def next_permutation(nums):
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    nums[i + 1:] = reversed(nums[i + 1:])
    return nums`,
    Java: `import java.util.*;

class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            int j = nums.length - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums, i, j);
        }
        reverse(nums, i + 1, nums.length - 1);
    }

    private void reverse(int[] nums, int left, int right) {
        while (left < right) swap(nums, left++, right--);
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}`,
    JavaScript: `function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let left = i + 1;
  let right = nums.length - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
  return nums;
}`,
  };
}

function findDuplicateCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

int findDuplicate(vector<int>& nums) {
    int slow = nums[0];
    int fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
    Python: `def find_duplicate(nums):
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
    Java: `class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`,
    JavaScript: `function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
  };
}

function majorityElementCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

int majorityElement(vector<int>& nums) {
    int candidate = 0;
    int count = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    return candidate;
}`,
    Python: `def majority_element(nums):
    candidate = None
    count = 0
    for x in nums:
        if count == 0:
            candidate = x
        count += 1 if x == candidate else -1
    return candidate`,
    Java: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0;
        int count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;
    }
}`,
    JavaScript: `function majorityElement(nums) {
  let candidate = null;
  let count = 0;
  for (const x of nums) {
    if (count === 0) candidate = x;
    count += x === candidate ? 1 : -1;
  }
  return candidate;
}`,
  };
}

function stockOneCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int best = 0;
    for (int price : prices) {
        minPrice = min(minPrice, price);
        best = max(best, price - minPrice);
    }
    return best;
}`,
    Python: `def max_profit(prices):
    min_price = float("inf")
    best = 0
    for price in prices:
        min_price = min(min_price, price)
        best = max(best, price - min_price)
    return best`,
    Java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int best = 0;
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            best = Math.max(best, price - minPrice);
        }
        return best;
    }
}`,
    JavaScript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    best = Math.max(best, price - minPrice);
  }
  return best;
}`,
  };
}

function rearrangeBySignCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<int> rearrangeArray(vector<int>& nums) {
    vector<int> ans(nums.size());
    int pos = 0;
    int neg = 1;
    for (int x : nums) {
        if (x >= 0) {
            ans[pos] = x;
            pos += 2;
        } else {
            ans[neg] = x;
            neg += 2;
        }
    }
    return ans;
}`,
    Python: `def rearrange_array(nums):
    ans = [0] * len(nums)
    pos, neg = 0, 1
    for x in nums:
        if x >= 0:
            ans[pos] = x
            pos += 2
        else:
            ans[neg] = x
            neg += 2
    return ans`,
    Java: `class Solution {
    public int[] rearrangeArray(int[] nums) {
        int[] ans = new int[nums.length];
        int pos = 0, neg = 1;
        for (int x : nums) {
            if (x >= 0) {
                ans[pos] = x;
                pos += 2;
            } else {
                ans[neg] = x;
                neg += 2;
            }
        }
        return ans;
    }
}`,
    JavaScript: `function rearrangeArray(nums) {
  const ans = Array(nums.length).fill(0);
  let pos = 0;
  let neg = 1;
  for (const x of nums) {
    if (x >= 0) {
      ans[pos] = x;
      pos += 2;
    } else {
      ans[neg] = x;
      neg += 2;
    }
  }
  return ans;
}`,
  };
}

function leadersCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<int> leaders(vector<int>& arr) {
    vector<int> ans;
    int bestRight = INT_MIN;
    for (int i = (int)arr.size() - 1; i >= 0; --i) {
        if (arr[i] > bestRight) {
            ans.push_back(arr[i]);
            bestRight = arr[i];
        }
    }
    reverse(ans.begin(), ans.end());
    return ans;
}`,
    Python: `def leaders(arr):
    ans = []
    best_right = float("-inf")
    for x in reversed(arr):
        if x > best_right:
            ans.append(x)
            best_right = x
    return ans[::-1]`,
    Java: `import java.util.*;

class Solution {
    public ArrayList<Integer> leaders(int[] arr) {
        ArrayList<Integer> ans = new ArrayList<>();
        int bestRight = Integer.MIN_VALUE;
        for (int i = arr.length - 1; i >= 0; i--) {
            if (arr[i] > bestRight) {
                ans.add(arr[i]);
                bestRight = arr[i];
            }
        }
        Collections.reverse(ans);
        return ans;
    }
}`,
    JavaScript: `function leaders(arr) {
  const ans = [];
  let bestRight = -Infinity;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] > bestRight) {
      ans.push(arr[i]);
      bestRight = arr[i];
    }
  }
  return ans.reverse();
}`,
  };
}

function longestConsecutiveCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    unordered_set<int> seen(nums.begin(), nums.end());
    int best = 0;
    for (int x : seen) {
        if (!seen.count(x - 1)) {
            int current = x;
            int length = 1;
            while (seen.count(current + 1)) {
                current++;
                length++;
            }
            best = max(best, length);
        }
    }
    return best;
}`,
    Python: `def longest_consecutive(nums):
    seen = set(nums)
    best = 0
    for x in seen:
        if x - 1 not in seen:
            current = x
            length = 1
            while current + 1 in seen:
                current += 1
                length += 1
            best = max(best, length)
    return best`,
    Java: `import java.util.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) seen.add(x);
        int best = 0;
        for (int x : seen) {
            if (!seen.contains(x - 1)) {
                int current = x;
                int length = 1;
                while (seen.contains(current + 1)) {
                    current++;
                    length++;
                }
                best = Math.max(best, length);
            }
        }
        return best;
    }
}`,
    JavaScript: `function longestConsecutive(nums) {
  const seen = new Set(nums);
  let best = 0;
  for (const x of seen) {
    if (!seen.has(x - 1)) {
      let current = x;
      let length = 1;
      while (seen.has(current + 1)) {
        current++;
        length++;
      }
      best = Math.max(best, length);
    }
  }
  return best;
}`,
  };
}

function setMatrixZeroesCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

void setZeroes(vector<vector<int>>& matrix) {
    int rows = matrix.size(), cols = matrix[0].size();
    bool firstCol = false;
    for (int r = 0; r < rows; ++r) {
        if (matrix[r][0] == 0) firstCol = true;
        for (int c = 1; c < cols; ++c) {
            if (matrix[r][c] == 0) matrix[r][0] = matrix[0][c] = 0;
        }
    }
    for (int r = rows - 1; r >= 0; --r) {
        for (int c = cols - 1; c >= 1; --c) {
            if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
        }
        if (firstCol) matrix[r][0] = 0;
    }
}`,
    Python: `def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_col = False
    for r in range(rows):
        if matrix[r][0] == 0:
            first_col = True
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = matrix[0][c] = 0
    for r in range(rows - 1, -1, -1):
        for c in range(cols - 1, 0, -1):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
        if first_col:
            matrix[r][0] = 0`,
    Java: `class Solution {
    public void setZeroes(int[][] matrix) {
        int rows = matrix.length, cols = matrix[0].length;
        boolean firstCol = false;
        for (int r = 0; r < rows; r++) {
            if (matrix[r][0] == 0) firstCol = true;
            for (int c = 1; c < cols; c++) {
                if (matrix[r][c] == 0) {
                    matrix[r][0] = 0;
                    matrix[0][c] = 0;
                }
            }
        }
        for (int r = rows - 1; r >= 0; r--) {
            for (int c = cols - 1; c >= 1; c--) {
                if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
            }
            if (firstCol) matrix[r][0] = 0;
        }
    }
}`,
    JavaScript: `function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let firstCol = false;
  for (let r = 0; r < rows; r++) {
    if (matrix[r][0] === 0) firstCol = true;
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) matrix[r][0] = matrix[0][c] = 0;
    }
  }
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 1; c--) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
    if (firstCol) matrix[r][0] = 0;
  }
}`,
  };
}

function rotateMatrixCode(): CodePack {
  return {
    "C++": `#include <vector>
#include <algorithm>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int r = 0; r < n; ++r) {
        for (int c = r + 1; c < n; ++c) swap(matrix[r][c], matrix[c][r]);
    }
    for (auto& row : matrix) reverse(row.begin(), row.end());
}`,
    Python: `def rotate(matrix):
    n = len(matrix)
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    for row in matrix:
        row.reverse()`,
    Java: `class Solution {
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
}`,
    JavaScript: `function rotate(matrix) {
  const n = matrix.length;
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
    }
  }
  for (const row of matrix) row.reverse();
}`,
  };
}

function spiralMatrixCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> ans;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; ++c) ans.push_back(matrix[top][c]);
        top++;
        for (int r = top; r <= bottom; ++r) ans.push_back(matrix[r][right]);
        right--;
        if (top <= bottom) for (int c = right; c >= left; --c) ans.push_back(matrix[bottom][c]);
        bottom--;
        if (left <= right) for (int r = bottom; r >= top; --r) ans.push_back(matrix[r][left]);
        left++;
    }
    return ans;
}`,
    Python: `def spiral_order(matrix):
    ans = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            ans.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            ans.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                ans.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                ans.append(matrix[r][left])
            left += 1
    return ans`,
    Java: `import java.util.*;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> ans = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) ans.add(matrix[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) ans.add(matrix[r][right]);
            right--;
            if (top <= bottom) for (int c = right; c >= left; c--) ans.add(matrix[bottom][c]);
            bottom--;
            if (left <= right) for (int r = bottom; r >= top; r--) ans.add(matrix[r][left]);
            left++;
        }
        return ans;
    }
}`,
    JavaScript: `function spiralOrder(matrix) {
  const ans = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) ans.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) ans.push(matrix[r][right]);
    right--;
    if (top <= bottom) for (let c = right; c >= left; c--) ans.push(matrix[bottom][c]);
    bottom--;
    if (left <= right) for (let r = bottom; r >= top; r--) ans.push(matrix[r][left]);
    left++;
  }
  return ans;
}`,
  };
}

function pascalTriangleCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

vector<vector<int>> generate(int numRows) {
    vector<vector<int>> triangle;
    for (int r = 0; r < numRows; ++r) {
        vector<int> row(r + 1, 1);
        for (int c = 1; c < r; ++c) row[c] = triangle[r - 1][c - 1] + triangle[r - 1][c];
        triangle.push_back(row);
    }
    return triangle;
}`,
    Python: `def generate(num_rows):
    triangle = []
    for r in range(num_rows):
        row = [1] * (r + 1)
        for c in range(1, r):
            row[c] = triangle[r - 1][c - 1] + triangle[r - 1][c]
        triangle.append(row)
    return triangle`,
    Java: `import java.util.*;

class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> triangle = new ArrayList<>();
        for (int r = 0; r < numRows; r++) {
            List<Integer> row = new ArrayList<>(Collections.nCopies(r + 1, 1));
            for (int c = 1; c < r; c++) {
                row.set(c, triangle.get(r - 1).get(c - 1) + triangle.get(r - 1).get(c));
            }
            triangle.add(row);
        }
        return triangle;
    }
}`,
    JavaScript: `function generate(numRows) {
  const triangle = [];
  for (let r = 0; r < numRows; r++) {
    const row = Array(r + 1).fill(1);
    for (let c = 1; c < r; c++) row[c] = triangle[r - 1][c - 1] + triangle[r - 1][c];
    triangle.push(row);
  }
  return triangle;
}`,
  };
}

function threeSumCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> ans;
    for (int i = 0; i < (int)nums.size(); ++i) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.size() - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                ans.push_back({nums[i], nums[left], nums[right]});
                left++;
                right--;
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return ans;
}`,
    Python: `def three_sum(nums):
    nums.sort()
    ans = []
    for i, value in enumerate(nums):
        if i > 0 and value == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = value + nums[left] + nums[right]
            if total == 0:
                ans.append([value, nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return ans`,
    Java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    ans.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;
                    while (left < right && nums[left] == nums[left - 1]) left++;
                    while (left < right && nums[right] == nums[right + 1]) right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return ans;
    }
}`,
    JavaScript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const ans = [];
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        ans.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return ans;
}`,
  };
}

function lowerBoundPatternCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

int lowerBound(vector<int>& nums, int target) {
    int left = 0, right = nums.size();
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}`,
    Python: `def lower_bound(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left`,
    Java: `class Solution {
    public int lowerBound(int[] nums, int target) {
        int left = 0, right = nums.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
}`,
    JavaScript: `function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}`,
  };
}

function slidingWindowPatternCode(): CodePack {
  return {
    "C++": `#include <vector>
#include <algorithm>
using namespace std;

int longestWindowAtMostK(vector<int>& nums, int k) {
    int left = 0, sum = 0, best = 0;
    for (int right = 0; right < (int)nums.size(); ++right) {
        sum += nums[right];
        while (sum > k && left <= right) sum -= nums[left++];
        best = max(best, right - left + 1);
    }
    return best;
}`,
    Python: `def longest_window_at_most_k(nums, k):
    left = 0
    total = 0
    best = 0
    for right, value in enumerate(nums):
        total += value
        while total > k and left <= right:
            total -= nums[left]
            left += 1
        best = max(best, right - left + 1)
    return best`,
    Java: `class Solution {
    public int longestWindowAtMostK(int[] nums, int k) {
        int left = 0, sum = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum > k && left <= right) sum -= nums[left++];
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
    JavaScript: `function longestWindowAtMostK(nums, k) {
  let left = 0;
  let sum = 0;
  let best = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k && left <= right) sum -= nums[left++];
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  };
}

function prefixHashPatternCode(): CodePack {
  return subarraySumKCode();
}

function treeDepthPatternCode(): CodePack {
  return {
    "C++": `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));
}`,
    Python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
    Java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
    JavaScript: `class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
  };
}

function linkedListReversePatternCode(): CodePack {
  return {
    "C++": `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    while (head) {
        ListNode* next = head->next;
        head->next = prev;
        prev = head;
        head = next;
    }
    return prev;
}`,
    Python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev`,
    Java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`,
    JavaScript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  while (head) {
    const next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }
  return prev;
}`,
  };
}

function graphBfsPatternCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<int> bfs(int n, vector<vector<int>>& adj, int start) {
    vector<int> order;
    vector<int> visited(n, 0);
    queue<int> q;
    visited[start] = 1;
    q.push(start);
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);
        for (int next : adj[node]) {
            if (!visited[next]) {
                visited[next] = 1;
                q.push(next);
            }
        }
    }
    return order;
}`,
    Python: `from collections import deque

def bfs(n, adj, start):
    order = []
    visited = [False] * n
    queue = deque([start])
    visited[start] = True
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in adj[node]:
            if not visited[nxt]:
                visited[nxt] = True
                queue.append(nxt)
    return order`,
    Java: `import java.util.*;

class Solution {
    public List<Integer> bfs(int n, List<List<Integer>> adj, int start) {
        List<Integer> order = new ArrayList<>();
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new ArrayDeque<>();
        visited[start] = true;
        queue.offer(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int next : adj.get(node)) {
                if (!visited[next]) {
                    visited[next] = true;
                    queue.offer(next);
                }
            }
        }
        return order;
    }
}`,
    JavaScript: `function bfs(n, adj, start) {
  const order = [];
  const visited = Array(n).fill(false);
  const queue = [start];
  visited[start] = true;
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    order.push(node);
    for (const next of adj[node]) {
      if (!visited[next]) {
        visited[next] = true;
        queue.push(next);
      }
    }
  }
  return order;
}`,
  };
}

function stackPatternCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<int> nextGreaterElements(vector<int>& nums) {
    vector<int> ans(nums.size(), -1);
    stack<int> st;
    for (int i = (int)nums.size() - 1; i >= 0; --i) {
        while (!st.empty() && st.top() <= nums[i]) st.pop();
        if (!st.empty()) ans[i] = st.top();
        st.push(nums[i]);
    }
    return ans;
}`,
    Python: `def next_greater_elements(nums):
    ans = [-1] * len(nums)
    stack = []
    for i in range(len(nums) - 1, -1, -1):
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        if stack:
            ans[i] = stack[-1]
        stack.append(nums[i])
    return ans`,
    Java: `import java.util.*;

class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int[] ans = new int[nums.length];
        Arrays.fill(ans, -1);
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = nums.length - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() <= nums[i]) stack.pop();
            if (!stack.isEmpty()) ans[i] = stack.peek();
            stack.push(nums[i]);
        }
        return ans;
    }
}`,
    JavaScript: `function nextGreaterElements(nums) {
  const ans = Array(nums.length).fill(-1);
  const stack = [];
  for (let i = nums.length - 1; i >= 0; i--) {
    while (stack.length && stack[stack.length - 1] <= nums[i]) stack.pop();
    if (stack.length) ans[i] = stack[stack.length - 1];
    stack.push(nums[i]);
  }
  return ans;
}`,
  };
}

function heapPatternCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int x : nums) freq[x]++;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> heap;
    for (auto it = freq.begin(); it != freq.end(); ++it) {
        int value = it->first;
        int count = it->second;
        heap.push({count, value});
        if ((int)heap.size() > k) heap.pop();
    }
    vector<int> ans;
    while (!heap.empty()) {
        ans.push_back(heap.top().second);
        heap.pop();
    }
    return ans;
}`,
    Python: `from collections import Counter
import heapq

def top_k_frequent(nums, k):
    heap = []
    for value, count in Counter(nums).items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)
    return [value for count, value in heap]`,
    Java: `import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
        PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            heap.offer(new int[] { entry.getValue(), entry.getKey() });
            if (heap.size() > k) heap.poll();
        }
        int[] ans = new int[heap.size()];
        for (int i = 0; i < ans.length; i++) ans[i] = heap.poll()[1];
        return ans;
    }
}`,
    JavaScript: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([value]) => value);
}`,
  };
}

function triePatternCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

class Trie {
    struct Node {
        bool end = false;
        unordered_map<char, Node*> child;
    };
    Node* root = new Node();
public:
    void insert(const string& word) {
        Node* node = root;
        for (char ch : word) node = node->child[ch] ? node->child[ch] : node->child[ch] = new Node();
        node->end = true;
    }
    bool search(const string& word) {
        Node* node = root;
        for (char ch : word) {
            if (!node->child.count(ch)) return false;
            node = node->child[ch];
        }
        return node->end;
    }
};`,
    Python: `class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node:
                return False
            node = node[ch]
        return "$" in node`,
    Java: `import java.util.*;

class Trie {
    private static class Node {
        boolean end;
        Map<Character, Node> child = new HashMap<>();
    }
    private final Node root = new Node();

    public void insert(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) node = node.child.computeIfAbsent(ch, k -> new Node());
        node.end = true;
    }

    public boolean search(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            node = node.child.get(ch);
            if (node == null) return false;
        }
        return node.end;
    }
}`,
    JavaScript: `class Trie {
  constructor() {
    this.root = {};
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) node = node[ch] ||= {};
    node.end = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) return false;
      node = node[ch];
    }
    return node.end === true;
  }
}`,
  };
}

function dpSubsetPatternCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

bool subsetSum(vector<int>& nums, int target) {
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int x : nums) {
        for (int s = target; s >= x; --s) dp[s] = dp[s] || dp[s - x];
    }
    return dp[target];
}`,
    Python: `def subset_sum(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True
    for x in nums:
        for s in range(target, x - 1, -1):
            dp[s] = dp[s] or dp[s - x]
    return dp[target]`,
    Java: `class Solution {
    public boolean subsetSum(int[] nums, int target) {
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums) {
            for (int s = target; s >= x; s--) dp[s] = dp[s] || dp[s - x];
        }
        return dp[target];
    }
}`,
    JavaScript: `function subsetSum(nums, target) {
  const dp = Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let s = target; s >= x; s--) dp[s] = dp[s] || dp[s - x];
  }
  return dp[target];
}`,
  };
}

function subsetsPatternCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

void backtrack(int index, vector<int>& nums, vector<int>& path, vector<vector<int>>& ans) {
    if (index == (int)nums.size()) {
        ans.push_back(path);
        return;
    }
    backtrack(index + 1, nums, path, ans);
    path.push_back(nums[index]);
    backtrack(index + 1, nums, path, ans);
    path.pop_back();
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> ans;
    vector<int> path;
    backtrack(0, nums, path, ans);
    return ans;
}`,
    Python: `def subsets(nums):
    ans = []
    path = []

    def backtrack(index):
        if index == len(nums):
            ans.append(path[:])
            return
        backtrack(index + 1)
        path.append(nums[index])
        backtrack(index + 1)
        path.pop()

    backtrack(0)
    return ans`,
    Java: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> ans = new ArrayList<>();
        backtrack(0, nums, new ArrayList<>(), ans);
        return ans;
    }

    private void backtrack(int index, int[] nums, List<Integer> path, List<List<Integer>> ans) {
        if (index == nums.length) {
            ans.add(new ArrayList<>(path));
            return;
        }
        backtrack(index + 1, nums, path, ans);
        path.add(nums[index]);
        backtrack(index + 1, nums, path, ans);
        path.remove(path.size() - 1);
    }
}`,
    JavaScript: `function subsets(nums) {
  const ans = [];
  const path = [];
  function backtrack(index) {
    if (index === nums.length) {
      ans.push([...path]);
      return;
    }
    backtrack(index + 1);
    path.push(nums[index]);
    backtrack(index + 1);
    path.pop();
  }
  backtrack(0);
  return ans;
}`,
  };
}

function greedyIntervalsPatternCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

int maxNonOverlappingIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1];
    });
    int count = 0;
    int lastEnd = INT_MIN;
    for (auto& interval : intervals) {
        if (interval[0] >= lastEnd) {
            count++;
            lastEnd = interval[1];
        }
    }
    return count;
}`,
    Python: `def max_non_overlapping_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    count = 0
    last_end = float("-inf")
    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end
    return count`,
    Java: `import java.util.*;

class Solution {
    public int maxNonOverlappingIntervals(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
        int count = 0;
        int lastEnd = Integer.MIN_VALUE;
        for (int[] interval : intervals) {
            if (interval[0] >= lastEnd) {
                count++;
                lastEnd = interval[1];
            }
        }
        return count;
    }
}`,
    JavaScript: `function maxNonOverlappingIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}`,
  };
}

function bitCountPatternCode(): CodePack {
  return {
    "C++": `int countSetBits(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
    Python: `def count_set_bits(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,
    Java: `class Solution {
    public int countSetBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;
            count++;
        }
        return count;
    }
}`,
    JavaScript: `function countSetBits(n) {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}`,
  };
}

function stringPrefixPatternCode(): CodePack {
  return {
    "C++": `#include <bits/stdc++.h>
using namespace std;

string longestCommonPrefix(vector<string>& words) {
    if (words.empty()) return "";
    string prefix = words[0];
    for (int i = 1; i < (int)words.size(); ++i) {
        while (words[i].find(prefix) != 0) prefix.pop_back();
    }
    return prefix;
}`,
    Python: `def longest_common_prefix(words):
    if not words:
        return ""
    prefix = words[0]
    for word in words[1:]:
        while not word.startswith(prefix):
            prefix = prefix[:-1]
    return prefix`,
    Java: `class Solution {
    public String longestCommonPrefix(String[] words) {
        if (words.length == 0) return "";
        String prefix = words[0];
        for (int i = 1; i < words.length; i++) {
            while (!words[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
            }
        }
        return prefix;
    }
}`,
    JavaScript: `function longestCommonPrefix(words) {
  if (words.length === 0) return "";
  let prefix = words[0];
  for (const word of words.slice(1)) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}`,
  };
}

function countDigitsPatternCode(): CodePack {
  return {
    "C++": `int countDigits(long long n) {
    if (n == 0) return 1;
    if (n < 0) n = -n;
    int digits = 0;
    while (n > 0) {
        digits++;
        n /= 10;
    }
    return digits;
}`,
    Python: `def count_digits(n):
    n = abs(n)
    if n == 0:
        return 1
    digits = 0
    while n > 0:
        digits += 1
        n //= 10
    return digits`,
    Java: `class Solution {
    public int countDigits(long n) {
        n = Math.abs(n);
        if (n == 0) return 1;
        int digits = 0;
        while (n > 0) {
            digits++;
            n /= 10;
        }
        return digits;
    }
}`,
    JavaScript: `function countDigits(n) {
  n = Math.abs(n);
  if (n === 0) return 1;
  let digits = 0;
  while (n > 0) {
    digits++;
    n = Math.floor(n / 10);
  }
  return digits;
}`,
  };
}

function arrayScanPatternCode(): CodePack {
  return {
    "C++": `#include <vector>
using namespace std;

long long prefixTotal(vector<int>& nums) {
    long long total = 0;
    for (int x : nums) total += x;
    return total;
}`,
    Python: `def prefix_total(nums):
    total = 0
    for x in nums:
        total += x
    return total`,
    Java: `class Solution {
    public long prefixTotal(int[] nums) {
        long total = 0;
        for (int x : nums) total += x;
        return total;
    }
}`,
    JavaScript: `function prefixTotal(nums) {
  let total = 0;
  for (const x of nums) total += x;
  return total;
}`,
  };
}

function getSearchText(algorithm: AlgorithmEntry, approach: AlgorithmApproach) {
  return safeInline(`${algorithm.id} ${algorithm.title} ${algorithm.topic} ${algorithm.category} ${algorithm.overview} ${approach.name} ${approach.description}`).toLowerCase();
}

function isUnknownComplexity(value: string) {
  return !value || value.includes("?") || value.toLowerCase().includes("unknown");
}

function safeInline(value: string) {
  return value
    .replace(/\u00b2/g, "^2")
    .replace(/\u00b3/g, "^3")
    .replace(/\*\//g, "* /")
    .replace(/"""/g, "' ' '")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
