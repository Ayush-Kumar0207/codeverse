# 🔥 Day 18 – Heaps / Priority Queues | FAANG Interview Deep Dive – Part 1

> **Rules**: C++ only. No mercy. Every edge case, every trap, every follow-up a FAANG interviewer would throw at you.

---

# THE PARADIGM: HEAPS / PRIORITY QUEUES

Heaps are the **go-to** when you need to repeatedly extract the min/max element efficiently. If you see "Kth," "top K," "median," "scheduling," or "merging sorted" — think heap.

```
HEAP PROPERTIES:
  - Complete binary tree stored as an array
  - Max-Heap: parent ≥ children (root = maximum)
  - Min-Heap: parent ≤ children (root = minimum)

OPERATIONS:
  insert(x):     O(log n) — add at end, bubble UP
  extractTop():  O(log n) — remove root, bubble DOWN
  top():         O(1)     — peek at root
  heapify(arr):  O(n)     — build heap from array (NOT O(n log n)!)

C++ STL:
  priority_queue<int>                     → MAX-HEAP (top = largest)
  priority_queue<int, vector<int>, greater<int>>  → MIN-HEAP (top = smallest)
```

**When to use which:**
```
MAX-HEAP: When you need the LARGEST element quickly
  - Kth SMALLEST (keep k largest, top = kth largest from bottom = kth smallest? No!)
  - Actually: Kth SMALLEST → MIN-HEAP of all, pop k times
           OR → MAX-HEAP of size k (top = kth smallest)

MIN-HEAP: When you need the SMALLEST element quickly
  - Merge K sorted lists
  - Connect ropes with min cost
  - Kth LARGEST → MIN-HEAP of size k (top = kth largest)

TWO HEAPS: Median tracking
  - Max-heap (lower half) + Min-heap (upper half)
```

---

# 1. INTRODUCTION TO PRIORITY QUEUE

## Q1.1: Implement a Min-Heap from scratch

```cpp
class MinHeap {
    vector<int> heap;
    
    int parent(int i) { return (i - 1) / 2; }
    int left(int i) { return 2 * i + 1; }
    int right(int i) { return 2 * i + 2; }
    
    void bubbleUp(int i) {
        while (i > 0 && heap[parent(i)] > heap[i]) {
            swap(heap[parent(i)], heap[i]);
            i = parent(i);
        }
    }
    
    void bubbleDown(int i) {
        int n = heap.size();
        while (true) {
            int smallest = i;
            int l = left(i), r = right(i);
            
            if (l < n && heap[l] < heap[smallest]) smallest = l;
            if (r < n && heap[r] < heap[smallest]) smallest = r;
            
            if (smallest == i) break;
            swap(heap[i], heap[smallest]);
            i = smallest;
        }
    }
    
public:
    void insert(int val) {
        heap.push_back(val);
        bubbleUp(heap.size() - 1);
    }
    
    int extractMin() {
        if (heap.empty()) throw runtime_error("Heap empty");
        int minVal = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) bubbleDown(0);
        return minVal;
    }
    
    int top() {
        if (heap.empty()) throw runtime_error("Heap empty");
        return heap[0];
    }
    
    bool empty() { return heap.empty(); }
    int size() { return heap.size(); }
};
```

### 🔴 Counter-Question 1: "Why is `heapify` O(n) and not O(n log n)?"

**Answer:** Building a heap bottom-up:
```cpp
void buildHeap(vector<int>& arr) {
    int n = arr.size();
    // Start from last non-leaf node
    for (int i = n / 2 - 1; i >= 0; i--) {
        bubbleDown(arr, i, n);
    }
}
```

**Proof:** Most nodes are near the bottom. Leaf nodes (n/2 of them) do 0 work. Nodes at height h do O(h) work. Sum = Σ (n/2^(h+1)) × h for h=0..log n = O(n).

```
Height 0 (leaves):     n/2 nodes × 0 swaps = 0
Height 1:              n/4 nodes × 1 swap  = n/4
Height 2:              n/8 nodes × 2 swaps = n/4
Height 3:              n/16 nodes × 3 swaps = 3n/16
...
Total = n × Σ(h/2^(h+1)) = n × 1 = O(n)   (geometric series)
```

### 🔴 Counter-Question 2: "Why `(i-1)/2` for parent and not `i/2`?"

**Answer:** 0-indexed array! In 1-indexed: parent = i/2, left = 2i, right = 2i+1. In 0-indexed: parent = (i-1)/2, left = 2i+1, right = 2i+2. Most implementations use 0-indexed.

### 🔴 Counter-Question 3: "C++ `priority_queue` is a MAX-HEAP by default. How to make it a MIN-HEAP?"

```cpp
// MAX-HEAP (default):
priority_queue<int> maxPQ;  // top() = largest

// MIN-HEAP:
priority_queue<int, vector<int>, greater<int>> minPQ;  // top() = smallest

// Custom comparator (e.g., sort by second element):
auto cmp = [](pair<int,int>& a, pair<int,int>& b) {
    return a.second > b.second;  // min-heap by second
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);

// TRAP: The comparator for priority_queue is REVERSED from sort!
// sort: return a < b  → ascending
// pq:   return a < b  → MAX-HEAP (larger values have higher priority)
// pq:   return a > b  → MIN-HEAP (smaller values have higher priority)
```

### 🔴 Counter-Question 4: "Heap vs BST vs Sorted Array — when to use which?"

| Operation | Heap | BST (balanced) | Sorted Array |
|---|---|---|---|
| Insert | O(log n) | O(log n) | O(n) |
| Find Min/Max | O(1) | O(log n)* | O(1) |
| Extract Min/Max | O(log n) | O(log n) | O(1) or O(n) |
| Find Kth | O(n) | O(log n)** | O(1) |
| Delete arbitrary | O(n)† | O(log n) | O(n) |
| Space | O(n) | O(n) | O(n) |

*BST can cache min/max for O(1). **Order-statistics tree. †Need to find element first.

**Rule of thumb:** Use heap when you ONLY need min or max. Use BST when you need arbitrary search/delete. Use sorted array when data is static.

### 🔴 Counter-Question 5: "What's the difference between `make_heap` and `priority_queue` in C++?"

```cpp
// make_heap: operates on existing vector, gives you control
vector<int> v = {3, 1, 4, 1, 5};
make_heap(v.begin(), v.end());         // max-heap
pop_heap(v.begin(), v.end());          // moves max to back
v.pop_back();                          // remove it
v.push_back(6);                        // add element
push_heap(v.begin(), v.end());         // restore heap property

// priority_queue: wrapper, cleaner API but less flexible
priority_queue<int> pq(v.begin(), v.end());
pq.top();    // peek
pq.pop();    // remove top
pq.push(6);  // add

// Key difference: make_heap lets you access underlying vector
// priority_queue does NOT expose the underlying container
```

---

# 2. KTH LARGEST ELEMENT (LC 215) ⭐⭐⭐⭐⭐

## Q2.1: Find the kth largest element in an unsorted array

```
Input:  [3,2,1,5,6,4], k = 2
Output: 5  (sorted: [1,2,3,4,5,6] → 2nd largest = 5)
```

### Approach 1: Sort → O(n log n)
```cpp
int findKthLargest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end());
    return nums[nums.size() - k];
}
```

### Approach 2: Min-Heap of size K → O(n log k)
```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minPQ; // min-heap
    
    for (int num : nums) {
        minPQ.push(num);
        if (minPQ.size() > k) minPQ.pop(); // evict smallest
    }
    return minPQ.top(); // kth largest is the smallest in the heap
}
// TC: O(n log k) | SC: O(k)
```

### Approach 3: QuickSelect (optimal average case) → O(n) average
```cpp
int partition(vector<int>& nums, int lo, int hi) {
    int pivot = nums[hi];
    int i = lo;
    
    for (int j = lo; j < hi; j++) {
        if (nums[j] <= pivot) {
            swap(nums[i], nums[j]);
            i++;
        }
    }
    swap(nums[i], nums[hi]);
    return i;
}

int quickSelect(vector<int>& nums, int lo, int hi, int k) {
    int pivotIdx = partition(nums, lo, hi);
    
    if (pivotIdx == k) return nums[pivotIdx];
    if (pivotIdx < k) return quickSelect(nums, pivotIdx + 1, hi, k);
    return quickSelect(nums, lo, pivotIdx - 1, k);
}

int findKthLargest(vector<int>& nums, int k) {
    int n = nums.size();
    return quickSelect(nums, 0, n - 1, n - k); // kth largest = (n-k)th smallest
}
// TC: O(n) average, O(n²) worst | SC: O(log n) recursion
```

### Approach 4: QuickSelect with random pivot (avoids worst case)
```cpp
int findKthLargest(vector<int>& nums, int k) {
    int n = nums.size();
    int target = n - k;
    
    function<int(int, int)> quickSelect = [&](int lo, int hi) -> int {
        // Random pivot
        int randIdx = lo + rand() % (hi - lo + 1);
        swap(nums[randIdx], nums[hi]);
        
        int pivot = nums[hi], i = lo;
        for (int j = lo; j < hi; j++) {
            if (nums[j] <= pivot) swap(nums[i++], nums[j]);
        }
        swap(nums[i], nums[hi]);
        
        if (i == target) return nums[i];
        if (i < target) return quickSelect(i + 1, hi);
        return quickSelect(lo, i - 1);
    };
    
    return quickSelect(0, n - 1);
}
// TC: O(n) expected | SC: O(log n) expected
```

### 🔴 Counter-Question 1: "QuickSelect vs Heap — when to use which?"

| Criteria | Min-Heap | QuickSelect |
|---|---|---|
| TC | O(n log k) | O(n) avg, O(n²) worst |
| SC | O(k) | O(1) iterative / O(log n) recursive |
| Modifies input? | No | Yes (partitions in-place) |
| Online (stream)? | ✅ Yes | ❌ No (need all data upfront) |
| Stability | Deterministic | Randomized (or worst-case with median-of-medians) |

**Rule:** Use heap for streams or when k is small. Use QuickSelect for one-shot on static data.

### 🔴 Counter-Question 2: "What's the median-of-medians algorithm?"

**Answer:** Guarantees O(n) WORST case for QuickSelect by choosing a good pivot:
1. Divide array into groups of 5
2. Find median of each group (sort 5 elements → O(1) per group)
3. Recursively find median of medians
4. Use as pivot

This gives O(n) worst case but with a LARGE constant (≈40n). In practice, random pivot is faster.

### 🔴 Counter-Question 3: "Kth largest in a matrix with sorted rows and columns (LC 378)."

```cpp
int kthSmallest(vector<vector<int>>& matrix, int k) {
    int n = matrix.size();
    
    // Min-heap: {value, row, col}
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    
    // Push first element from each row
    for (int i = 0; i < min(n, k); i++) {
        pq.push({matrix[i][0], i, 0});
    }
    
    int result = 0;
    for (int i = 0; i < k; i++) {
        auto [val, r, c] = pq.top(); pq.pop();
        result = val;
        
        if (c + 1 < n) {
            pq.push({matrix[r][c + 1], r, c + 1});
        }
    }
    return result;
}
// TC: O(k log min(n,k)) | SC: O(min(n,k))
```

**Alternative:** Binary search on value range → O(n log(max-min))

### 🔴 Counter-Question 4: "Top K Frequent Elements (LC 347)."

```cpp
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int n : nums) freq[n]++;
    
    // Min-heap of size k by frequency
    auto cmp = [](pair<int,int>& a, pair<int,int>& b) {
        return a.second > b.second; // min-heap by frequency
    };
    priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);
    
    for (auto& [num, cnt] : freq) {
        pq.push({num, cnt});
        if ((int)pq.size() > k) pq.pop();
    }
    
    vector<int> result;
    while (!pq.empty()) {
        result.push_back(pq.top().first);
        pq.pop();
    }
    return result;
}
// TC: O(n log k) | SC: O(n)

// OPTIMAL: Bucket sort by frequency → O(n)
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int n : nums) freq[n]++;
    
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& [num, cnt] : freq) buckets[cnt].push_back(num);
    
    vector<int> result;
    for (int i = buckets.size() - 1; i >= 0 && (int)result.size() < k; i--) {
        for (int num : buckets[i]) {
            result.push_back(num);
            if ((int)result.size() == k) break;
        }
    }
    return result;
}
// TC: O(n) | SC: O(n)
```

---

# 3. KTH SMALLEST ELEMENT

## Q3.1: Find the kth smallest element

```cpp
int findKthSmallest(vector<int>& nums, int k) {
    // Approach 1: Max-heap of size k
    priority_queue<int> maxPQ; // max-heap
    
    for (int num : nums) {
        maxPQ.push(num);
        if ((int)maxPQ.size() > k) maxPQ.pop(); // evict largest
    }
    return maxPQ.top(); // kth smallest = largest in heap of size k
    
    // Approach 2: QuickSelect
    // return quickSelect(nums, 0, nums.size()-1, k-1);
}
// TC: O(n log k) | SC: O(k)
```

### 🔴 Counter-Question 1: "Kth largest uses MIN-heap. Kth smallest uses MAX-heap. WHY the reversal?"

**Answer:**
```
Kth LARGEST → keep the K largest elements → evict smallest → MIN-HEAP
  Heap top = smallest among K largest = Kth largest ✅

Kth SMALLEST → keep the K smallest elements → evict largest → MAX-HEAP
  Heap top = largest among K smallest = Kth smallest ✅

MNEMONIC: "Opposite heap" — use the OPPOSITE type to evict the unwanted extreme.
```

### 🔴 Counter-Question 2: "Kth Smallest in a sorted matrix — can you use binary search?"

```cpp
int kthSmallest(vector<vector<int>>& matrix, int k) {
    int n = matrix.size();
    int lo = matrix[0][0], hi = matrix[n-1][n-1];
    
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        
        // Count elements <= mid
        int count = 0, j = n - 1;
        for (int i = 0; i < n; i++) {
            while (j >= 0 && matrix[i][j] > mid) j--;
            count += j + 1;
        }
        
        if (count < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
// TC: O(n log(max - min)) | SC: O(1) — no extra space!
```

---

# 4. MERGE K SORTED LISTS (LC 23) ⭐⭐⭐⭐⭐

## Q4.1: Merge k sorted linked lists into one sorted list

```
Input:  [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
```

### Approach 1: Min-Heap
```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) {
        return a->val > b->val; // min-heap
    };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    
    for (auto* list : lists) {
        if (list) pq.push(list);
    }
    
    ListNode dummy(0);
    ListNode* tail = &dummy;
    
    while (!pq.empty()) {
        ListNode* node = pq.top(); pq.pop();
        tail->next = node;
        tail = tail->next;
        
        if (node->next) pq.push(node->next);
    }
    
    return dummy.next;
}
// TC: O(N log k) where N = total nodes, k = number of lists
// SC: O(k) for the heap
```

### Approach 2: Divide and Conquer
```cpp
ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    if (!l1) return l2;
    if (!l2) return l1;
    
    if (l1->val < l2->val) {
        l1->next = mergeTwoLists(l1->next, l2);
        return l1;
    }
    l2->next = mergeTwoLists(l1, l2->next);
    return l2;
}

ListNode* mergeKLists(vector<ListNode*>& lists) {
    if (lists.empty()) return nullptr;
    
    int interval = 1;
    while (interval < (int)lists.size()) {
        for (int i = 0; i + interval < (int)lists.size(); i += interval * 2) {
            lists[i] = mergeTwoLists(lists[i], lists[i + interval]);
        }
        interval *= 2;
    }
    return lists[0];
}
// TC: O(N log k) | SC: O(1) (iterative merge) or O(N) (recursive merge)
```

### 🔴 Counter-Question 1: "Heap vs Divide-and-Conquer — which is better?"

| | Heap | Divide & Conquer |
|---|---|---|
| TC | O(N log k) | O(N log k) |
| SC | O(k) | O(1) iterative / O(N) recursive |
| Code complexity | Simple | Medium |
| Cache performance | Poor (pointer chasing) | Better (fewer allocations) |
| For arrays | Use merge directly | Better |
| For linked lists | Both work | Slightly better |

### 🔴 Counter-Question 2: "Merge K sorted ARRAYS (not linked lists)."

```cpp
vector<int> mergeKSortedArrays(vector<vector<int>>& arrays) {
    // Min-heap: {value, array_index, element_index}
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    
    for (int i = 0; i < (int)arrays.size(); i++) {
        if (!arrays[i].empty()) pq.push({arrays[i][0], i, 0});
    }
    
    vector<int> result;
    while (!pq.empty()) {
        auto [val, ai, ei] = pq.top(); pq.pop();
        result.push_back(val);
        
        if (ei + 1 < (int)arrays[ai].size()) {
            pq.push({arrays[ai][ei + 1], ai, ei + 1});
        }
    }
    return result;
}
```

### 🔴 Counter-Question 3: "What if lists are sorted in DESCENDING order?"

**Answer:** Use a MAX-HEAP instead, or reverse each list first, or change the comparator:
```cpp
auto cmp = [](ListNode* a, ListNode* b) {
    return a->val < b->val; // max-heap for descending lists
};
```

### 🔴 Counter-Question 4: "What if k = 2? Optimize."

**Answer:** Just use the standard merge of two sorted lists — O(n+m), no heap needed. The heap adds O(log 2) = O(1) overhead per element, so it's the same complexity, but the direct merge has lower constant.

---

# 5. REPLACE ELEMENTS BY ITS RANK IN THE ARRAY

## Q5.1: Replace each element with its rank (1-indexed, smallest = rank 1)

```
Input:  [40, 10, 20, 30]
Output: [4, 1, 2, 3]

Input:  [100, 100, 100]
Output: [1, 1, 1]  (equal elements get same rank)
```

```cpp
vector<int> replaceWithRank(vector<int>& arr) {
    int n = arr.size();
    
    // Create sorted pairs {value, original_index}
    vector<pair<int, int>> sorted_arr(n);
    for (int i = 0; i < n; i++) sorted_arr[i] = {arr[i], i};
    sort(sorted_arr.begin(), sorted_arr.end());
    
    vector<int> result(n);
    int rank = 1;
    
    for (int i = 0; i < n; i++) {
        if (i > 0 && sorted_arr[i].first != sorted_arr[i-1].first) {
            rank = i + 1; // or rank++ for dense ranking
        }
        result[sorted_arr[i].second] = rank;
    }
    
    // For DENSE ranking (1, 2, 3, not 1, 1, 3):
    // rank++ only when value changes
    
    return result;
}
// TC: O(n log n) | SC: O(n)
```

### Alternative: Using a map
```cpp
vector<int> replaceWithRank(vector<int>& arr) {
    set<int> sorted_vals(arr.begin(), arr.end()); // unique sorted values
    unordered_map<int, int> rank_map;
    
    int rank = 1;
    for (int val : sorted_vals) {
        rank_map[val] = rank++;
    }
    
    vector<int> result;
    for (int val : arr) result.push_back(rank_map[val]);
    return result;
}
```

### 🔴 Counter-Question 1: "Dense rank vs Standard rank vs Ordinal rank — what's the difference?"

```
Values: [10, 30, 30, 50]

Dense rank:    [1, 2, 2, 3]  (skip no ranks)
Standard rank: [1, 2, 2, 4]  (skip ranks for ties)
Ordinal rank:  [1, 2, 3, 4]  (no ties, first occurrence gets lower rank)

Each has different use cases. Dense ranking is most common in interviews.
```

### 🔴 Counter-Question 2: "Can you do this with a heap?"

```cpp
vector<int> replaceWithRankHeap(vector<int>& arr) {
    int n = arr.size();
    
    // Min-heap: {value, index}
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    for (int i = 0; i < n; i++) pq.push({arr[i], i});
    
    vector<int> result(n);
    int rank = 0, prevVal = INT_MIN;
    
    while (!pq.empty()) {
        auto [val, idx] = pq.top(); pq.pop();
        if (val != prevVal) rank++;
        result[idx] = rank;
        prevVal = val;
    }
    return result;
}
// TC: O(n log n) | SC: O(n)
```

---

# 6. TASK SCHEDULER (LC 621) ⭐⭐⭐⭐

## Q6.1: Schedule tasks with cooldown period n between same tasks

```
Input:  tasks = ["A","A","A","B","B","B"], n = 2
Output: 8  (A B idle A B idle A B)

Input:  tasks = ["A","A","A","B","B","B"], n = 0
Output: 6  (no cooldown needed)
```

### Approach 1: Greedy with Math
```cpp
int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {};
    for (char t : tasks) freq[t - 'A']++;
    
    int maxFreq = *max_element(freq, freq + 26);
    int maxCount = count(freq, freq + 26, maxFreq); // how many tasks have max freq
    
    // (maxFreq - 1) groups of (n + 1) slots + maxCount for last group
    int result = (maxFreq - 1) * (n + 1) + maxCount;
    
    return max(result, (int)tasks.size()); // can't be less than total tasks
}
// TC: O(n) | SC: O(1)
```

### Approach 2: Max-Heap + Queue Simulation
```cpp
int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {};
    for (char t : tasks) freq[t - 'A']++;
    
    priority_queue<int> pq; // max-heap of remaining counts
    for (int f : freq) if (f > 0) pq.push(f);
    
    queue<pair<int, int>> cooldown; // {remaining_count, available_time}
    
    int time = 0;
    while (!pq.empty() || !cooldown.empty()) {
        time++;
        
        if (!pq.empty()) {
            int cnt = pq.top() - 1; pq.pop();
            if (cnt > 0) cooldown.push({cnt, time + n});
        }
        
        if (!cooldown.empty() && cooldown.front().second == time) {
            pq.push(cooldown.front().first);
            cooldown.pop();
        }
    }
    return time;
}
// TC: O(total × log 26) = O(total) | SC: O(26) = O(1)
```

### 🔴 Counter-Question 1: "Explain the math formula `(maxFreq - 1) × (n + 1) + maxCount`."

```
tasks = [A,A,A,B,B,B], n = 2

Arrange most frequent task with gaps:
  A _ _ A _ _ A
  
Fill gaps with other tasks:
  A B _ A B _ A B
  
(maxFreq - 1) = 2 groups, each of size (n+1) = 3:
  [A B _] [A B _]  = 2 × 3 = 6 slots
  
Plus the last group: only the max-frequency tasks:
  A B  = maxCount = 2

Total = 6 + 2 = 8 ✅

BUT if there are many tasks, they fill all gaps with no idle:
  tasks = [A,A,A,B,B,B,C,C,C,D,D,D], n = 2
  Formula: (3-1)×3 + 4 = 10. But 12 tasks exist → answer = 12!
  Hence: max(formula, tasks.size())
```

### 🔴 Counter-Question 2: "What if tasks must maintain their relative order?"

**Answer:** This becomes a much harder problem. You can't rearrange tasks — just insert idles. Use a queue to track cooldowns:

```cpp
int leastIntervalOrdered(vector<char>& tasks, int n) {
    unordered_map<char, int> lastUsed;
    int time = 0;
    
    for (char t : tasks) {
        if (lastUsed.count(t) && time - lastUsed[t] <= n) {
            time = lastUsed[t] + n + 1; // wait for cooldown
        }
        lastUsed[t] = time;
        time++;
    }
    return time;
}
```

### 🔴 Counter-Question 3: "Rearrange String K Distance Apart (LC 358)."

```cpp
string rearrangeString(string s, int k) {
    if (k <= 1) return s;
    
    int freq[26] = {};
    for (char c : s) freq[c - 'a']++;
    
    priority_queue<pair<int, char>> pq; // max-heap {freq, char}
    for (int i = 0; i < 26; i++) {
        if (freq[i] > 0) pq.push({freq[i], 'a' + i});
    }
    
    queue<pair<int, char>> cooldown;
    string result;
    
    while (!pq.empty()) {
        auto [f, c] = pq.top(); pq.pop();
        result += c;
        cooldown.push({f - 1, c});
        
        if ((int)cooldown.size() >= k) {
            auto [rf, rc] = cooldown.front(); cooldown.pop();
            if (rf > 0) pq.push({rf, rc});
        }
    }
    
    return result.size() == s.size() ? result : "";
}
```

---

## 📊 Part 1 — Heap Type Selector

| Problem | Heap Type | Size | Why |
|---|---|---|---|
| Kth Largest | MIN-heap | k | Top = kth largest |
| Kth Smallest | MAX-heap | k | Top = kth smallest |
| Top K Frequent | MIN-heap by freq | k | Evict least frequent |
| Merge K Lists | MIN-heap | k | Always extract global min |
| Task Scheduler | MAX-heap | 26 | Schedule most frequent first |
| Rank in Array | MIN-heap | n | Process in sorted order |

---

*Continued in Part 2: Hands of Straights, Design Twitter, Connect Ropes, Kth Largest in Stream, Maximum Sum Combinations, Find Median from Data Stream...*
