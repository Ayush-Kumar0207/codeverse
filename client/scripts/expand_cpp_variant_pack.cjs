const fs = require("fs");
const path = require("path");

const filename = path.resolve(__dirname, "../data/algos/curated_cpp_variants.json");
const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));

function add(id, name, description, timeComplexity, spaceComplexity, code) {
  const approaches = catalog[id] || (catalog[id] = []);
  if (approaches.some((approach) => approach.name === name)) return;
  approaches.push({ name, description, timeComplexity, spaceComplexity, code: code.trim() });
}

add("rearrange-array-elements-by-sign", "Better (Stable Buckets)", "Collect positive and negative values independently, then interleave them while preserving the original order inside each sign group.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> rearrange(const vector<int>& values) {
    vector<int> positive, negative, answer;
    for (int value : values) (value >= 0 ? positive : negative).push_back(value);
    size_t i = 0, j = 0;
    while (i < positive.size() || j < negative.size()) {
        if (i < positive.size()) answer.push_back(positive[i++]);
        if (j < negative.size()) answer.push_back(negative[j++]);
    }
    return answer;
}
int main() {
    for (int value : rearrange({3, 1, -2, -5, 2, -4})) cout << value << " ";
    return 0;
}`);

add("print-the-matrix-in-spiral-manner", "Brute Force (Visited Simulation)", "Walk in the current direction and rotate whenever the next cell is outside the matrix or already visited.", "O(R * C)", "O(R * C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> spiral(const vector<vector<int>>& matrix) {
    if (matrix.empty()) return {};
    int rows = matrix.size(), columns = matrix[0].size();
    int moves[5] = {0, 1, 0, -1, 0}, direction = 0, row = 0, column = 0;
    vector<vector<bool>> seen(rows, vector<bool>(columns));
    vector<int> answer;
    for (int count = 0; count < rows * columns; ++count) {
        answer.push_back(matrix[row][column]);
        seen[row][column] = true;
        int nextRow = row + moves[direction], nextColumn = column + moves[direction + 1];
        if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns || seen[nextRow][nextColumn]) {
            direction = (direction + 1) % 4;
            nextRow = row + moves[direction];
            nextColumn = column + moves[direction + 1];
        }
        row = nextRow;
        column = nextColumn;
    }
    return answer;
}
int main() {
    for (int value : spiral({{1, 2, 3}, {4, 5, 6}, {7, 8, 9}})) cout << value << " ";
    return 0;
}`);

add("pascal-s-triangle", "Better (Direct Binomial Coefficients)", "Build each row from the multiplicative binomial-coefficient recurrence instead of referencing the previous row.", "O(N^2)", "O(N^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<long long>> pascal(int rows) {
    vector<vector<long long>> triangle;
    for (int row = 0; row < rows; ++row) {
        vector<long long> current(row + 1, 1);
        for (int column = 1; column < row; ++column) {
            current[column] = current[column - 1] * (row - column + 1) / column;
        }
        triangle.push_back(current);
    }
    return triangle;
}
int main() {
    for (const auto& row : pascal(5)) {
        for (long long value : row) cout << value << " ";
        cout << "\n";
    }
    return 0;
}`);

add("lowest-common-ancestor-of-a-binary-search-tree", "Better (Root Paths)", "Record the search path from the root to each key, then return the last shared node.", "O(H)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* left; Node* right; explicit Node(int x) : value(x), left(nullptr), right(nullptr) {} };
vector<Node*> path(Node* root, int target) {
    vector<Node*> answer;
    while (root) {
        answer.push_back(root);
        if (root->value == target) break;
        root = target < root->value ? root->left : root->right;
    }
    return answer;
}
Node* lca(Node* root, int first, int second) {
    vector<Node*> left = path(root, first), right = path(root, second);
    Node* answer = nullptr;
    for (size_t i = 0; i < min(left.size(), right.size()) && left[i] == right[i]; ++i) answer = left[i];
    return answer;
}
int main() {
    Node root(6), a(2), b(8), c(4); root.left = &a; root.right = &b; a.right = &c;
    cout << lca(&root, 2, 4)->value << "\n";
    return 0;
}`);

add("iterative-inorder", "Better (Recursive Inorder)", "Use the call stack to visit left subtree, node, and right subtree in inorder sequence.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* left; Node* right; explicit Node(int x) : value(x), left(nullptr), right(nullptr) {} };
void inorder(Node* node, vector<int>& order) {
    if (!node) return;
    inorder(node->left, order);
    order.push_back(node->value);
    inorder(node->right, order);
}
int main() {
    Node root(2), left(1), right(3); root.left = &left; root.right = &right;
    vector<int> order; inorder(&root, order);
    for (int value : order) cout << value << " ";
    return 0;
}`);

add("middle-of-a-linkedlist", "Brute Force (Length Counting)", "Count all nodes, then walk half the length to reach the middle node.", "O(N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* next; explicit Node(int x) : value(x), next(nullptr) {} };
Node* middle(Node* head) {
    int length = 0;
    for (Node* node = head; node; node = node->next) ++length;
    for (int step = 0; step < length / 2; ++step) head = head->next;
    return head;
}
int main() {
    Node a(1), b(2), c(3), d(4), e(5); a.next=&b; b.next=&c; c.next=&d; d.next=&e;
    cout << middle(&a)->value << "\n";
    return 0;
}`);

add("sort-a-ll-of-0-s-1-s-and-2-s", "Better (Counting Rewrite)", "Count zeroes, ones, and twos, then overwrite node values in sorted order.", "O(N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* next; explicit Node(int x) : value(x), next(nullptr) {} };
void sortColors(Node* head) {
    array<int, 3> count{};
    for (Node* node = head; node; node = node->next) ++count[node->value];
    int value = 0;
    for (Node* node = head; node; node = node->next) {
        while (value < 3 && count[value] == 0) ++value;
        node->value = value;
        --count[value];
    }
}
int main() {
    Node a(2), b(1), c(0), d(2); a.next=&b; b.next=&c; c.next=&d; sortColors(&a);
    for (Node* node=&a; node; node=node->next) cout << node->value << " ";
    return 0;
}`);

add("add-1-to-a-number-represented-by-ll", "Better (Digit Buffer)", "Store node addresses, propagate a carry from the tail, and add a new leading node only if necessary.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* next; explicit Node(int x) : value(x), next(nullptr) {} };
Node* addOne(Node* head) {
    vector<Node*> digits;
    for (Node* node = head; node; node = node->next) digits.push_back(node);
    int carry = 1;
    for (int i = (int)digits.size() - 1; i >= 0 && carry; --i) {
        int sum = digits[i]->value + carry;
        digits[i]->value = sum % 10;
        carry = sum / 10;
    }
    if (carry) { Node* node = new Node(carry); node->next = head; return node; }
    return head;
}
int main() {
    Node a(9), b(9); a.next=&b; Node* head=addOne(&a);
    for (Node* node=head; node; node=node->next) cout << node->value;
    return 0;
}`);

add("palindrome-number", "Brute Force (String Mirror)", "Convert the number to text and compare symmetric characters from both ends.", "O(D)", "O(D)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool palindrome(int value) {
    if (value < 0) return false;
    string text = to_string(value);
    return equal(text.begin(), text.begin() + text.size() / 2, text.rbegin());
}
int main() { cout << boolalpha << palindrome(12321) << "\n"; return 0; }
`);

add("pow-x-n", "Brute Force (Repeated Multiplication)", "Multiply the base once per exponent unit and invert the result for a negative exponent.", "O(|N|)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
double power(double base, int exponent) {
    long long count = exponent;
    bool negative = count < 0;
    if (negative) count = -count;
    double answer = 1;
    while (count--) answer *= base;
    return negative ? 1.0 / answer : answer;
}
int main() { cout << power(2, -3) << "\n"; return 0; }
`);

add("reverse-a-number", "Better (String Reversal)", "Reverse the decimal digits as text and restore the original sign.", "O(D)", "O(D)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long reverseNumber(long long value) {
    bool negative = value < 0;
    string digits = to_string(llabs(value));
    reverse(digits.begin(), digits.end());
    long long answer = stoll(digits);
    return negative ? -answer : answer;
}
int main() { cout << reverseNumber(-12040) << "\n"; return 0; }
`);

add("isomorphic-strings", "Better (Last-Seen Arrays)", "Compare the previous positions of corresponding characters, which simultaneously enforces both mapping directions.", "O(N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool isomorphic(const string& first, const string& second) {
    if (first.size() != second.size()) return false;
    array<int, 256> seenFirst{}, seenSecond{};
    for (int i = 0; i < (int)first.size(); ++i) {
        unsigned char a = first[i], b = second[i];
        if (seenFirst[a] != seenSecond[b]) return false;
        seenFirst[a] = seenSecond[b] = i + 1;
    }
    return true;
}
int main() { cout << boolalpha << isomorphic("egg", "add") << "\n"; return 0; }
`);

add("roman-number-to-integer", "Better (Expanded Pair Table)", "Match the six subtractive pairs first; otherwise consume a single Roman symbol.", "O(N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int romanToInt(const string& text) {
    unordered_map<string, int> value{{"I",1},{"V",5},{"X",10},{"L",50},{"C",100},{"D",500},{"M",1000},{"IV",4},{"IX",9},{"XL",40},{"XC",90},{"CD",400},{"CM",900}};
    int answer = 0;
    for (int i = 0; i < (int)text.size();) {
        if (i + 1 < (int)text.size() && value.count(text.substr(i, 2))) { answer += value[text.substr(i, 2)]; i += 2; }
        else { answer += value[text.substr(i, 1)]; ++i; }
    }
    return answer;
}
int main() { cout << romanToInt("MCMXCIV") << "\n"; return 0; }
`);

add("generate-parentheses", "Brute Force (Generate and Validate)", "Generate every length-2N parenthesis string and retain only strings whose running balance never becomes negative and ends at zero.", "O(2^(2N) * N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool valid(const string& text) {
    int balance = 0;
    for (char ch : text) { balance += ch == '(' ? 1 : -1; if (balance < 0) return false; }
    return balance == 0;
}
void generate(int length, string& current, vector<string>& answer) {
    if ((int)current.size() == length) { if (valid(current)) answer.push_back(current); return; }
    current.push_back('('); generate(length, current, answer); current.back() = ')'; generate(length, current, answer); current.pop_back();
}
int main() { vector<string> answer; string current; generate(6, current, answer); for (auto& text : answer) cout << text << " "; return 0; }
`);

add("subsets", "Better (Bitmask Enumeration)", "Treat each bit of a mask as the include-or-exclude decision for one array element.", "O(N * 2^N)", "O(N * 2^N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> subsets(const vector<int>& values) {
    vector<vector<int>> answer;
    for (int mask = 0; mask < (1 << values.size()); ++mask) {
        vector<int> subset;
        for (int bit = 0; bit < (int)values.size(); ++bit) if (mask & (1 << bit)) subset.push_back(values[bit]);
        answer.push_back(subset);
    }
    return answer;
}
int main() { for (auto& subset : subsets({1,2,3})) { for (int value : subset) cout << value; cout << "\n"; } return 0; }
`);

add("fibonacci-number", "Brute Force (Recursive Definition)", "Evaluate the mathematical recurrence directly to expose its overlapping subproblems.", "O(2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long fibonacci(int n) { return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2); }
int main() { cout << fibonacci(10) << "\n"; return 0; }
`);

add("validate-bst", "Better (Inorder Materialization)", "Store the inorder traversal and verify that it is strictly increasing.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* left; Node* right; explicit Node(int x) : value(x), left(nullptr), right(nullptr) {} };
void inorder(Node* node, vector<int>& values) { if (!node) return; inorder(node->left, values); values.push_back(node->value); inorder(node->right, values); }
bool valid(Node* root) { vector<int> values; inorder(root, values); return adjacent_find(values.begin(), values.end(), greater_equal<int>()) == values.end(); }
int main() { Node root(2), a(1), b(3); root.left=&a; root.right=&b; cout << boolalpha << valid(&root); return 0; }
`);

add("kth-smallest-element-in-a-bst", "Better (Iterative Inorder Stack)", "Simulate inorder traversal with an explicit stack and stop when the K-th node is popped.", "O(H + K)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* left; Node* right; explicit Node(int x) : value(x), left(nullptr), right(nullptr) {} };
int kthSmallest(Node* root, int k) {
    stack<Node*> pending;
    while (root || !pending.empty()) {
        while (root) { pending.push(root); root = root->left; }
        root = pending.top(); pending.pop();
        if (--k == 0) return root->value;
        root = root->right;
    }
    throw out_of_range("k");
}
int main() { Node root(2), a(1), b(3); root.left=&a; root.right=&b; cout << kthSmallest(&root, 2); return 0; }
`);

add("assign-cookies", "Brute Force (Backtracking Matching)", "Try every unused cookie for each child and maximize the number of satisfied children.", "O(M^N)", "O(M)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int match(int child, const vector<int>& greed, const vector<int>& cookies, vector<bool>& used) {
    if (child == (int)greed.size()) return 0;
    int best = match(child + 1, greed, cookies, used);
    for (int i = 0; i < (int)cookies.size(); ++i) if (!used[i] && cookies[i] >= greed[child]) {
        used[i] = true; best = max(best, 1 + match(child + 1, greed, cookies, used)); used[i] = false;
    }
    return best;
}
int main() { vector<int> greed={1,2,3}, cookies={1,1,3}; vector<bool> used(cookies.size()); cout << match(0, greed, cookies, used); return 0; }
`);

add("maximum-xor-of-two-numbers-in-an-array", "Brute Force (All Pairs)", "Evaluate XOR for every unordered pair and retain the maximum.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int maximumXor(const vector<int>& values) {
    int answer = 0;
    for (int i = 0; i < (int)values.size(); ++i) for (int j = i + 1; j < (int)values.size(); ++j) answer = max(answer, values[i] ^ values[j]);
    return answer;
}
int main() { cout << maximumXor({3,10,5,25,2,8}) << "\n"; return 0; }
`);

add("merge-sort", "Better (Bottom-Up Iterative Merge Sort)", "Merge runs of width 1, 2, 4, and so on, avoiding recursion while retaining stable O(N log N) merging.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void mergeSort(vector<int>& values) {
    vector<int> buffer(values.size());
    for (int width = 1; width < (int)values.size(); width *= 2) {
        for (int left = 0; left < (int)values.size(); left += 2 * width) {
            int middle = min(left + width, (int)values.size()), right = min(left + 2 * width, (int)values.size());
            merge(values.begin()+left, values.begin()+middle, values.begin()+middle, values.begin()+right, buffer.begin()+left);
        }
        values.swap(buffer);
    }
}
int main() { vector<int> values={5,2,4,1,3}; mergeSort(values); for(int value:values) cout<<value<<" "; return 0; }
`);

add("bubble-sort", "Brute Force (Classic Passes)", "Run all adjacent-comparison passes without early termination to show the direct baseline.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void bubbleSort(vector<int>& values) {
    for (int end = values.size() - 1; end > 0; --end) for (int i = 0; i < end; ++i) if (values[i] > values[i + 1]) swap(values[i], values[i + 1]);
}
int main() { vector<int> values={5,1,4,2,8}; bubbleSort(values); for(int value:values) cout<<value<<" "; return 0; }
`);

add("min-stack", "Better (Value-Minimum Pairs)", "Store the minimum-so-far beside every pushed value so all operations remain constant time.", "O(1) per operation", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class MinStack {
    vector<pair<int,int>> data;
public:
    void push(int value) { data.push_back({value, data.empty() ? value : min(value, data.back().second)}); }
    void pop() { if (!data.empty()) data.pop_back(); }
    int top() const { return data.back().first; }
    int minimum() const { return data.back().second; }
};
int main() { MinStack stack; stack.push(3); stack.push(1); stack.push(2); cout << stack.minimum(); return 0; }
`);

add("implement-queue-using-stacks", "Better (Costly Push)", "Move existing elements during push so the oldest element is always on top of the primary stack.", "O(N) push, O(1) pop", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class Queue {
    stack<int> ready, buffer;
public:
    void push(int value) { while(!ready.empty()){buffer.push(ready.top());ready.pop();} ready.push(value); while(!buffer.empty()){ready.push(buffer.top());buffer.pop();} }
    int pop() { int value=ready.top(); ready.pop(); return value; }
    int front() const { return ready.top(); }
};
int main() { Queue queue; queue.push(1); queue.push(2); cout << queue.pop() << " " << queue.front(); return 0; }
`);

add("lru-cache", "Brute Force (Recency Timestamps)", "Keep values and last-used timestamps in a map, scanning for the least-recently-used key only when eviction is required.", "O(N) put, O(1) get", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class LRUCache {
    int capacity, clock = 0; unordered_map<int, pair<int,int>> data;
public:
    explicit LRUCache(int size) : capacity(size) {}
    int get(int key) { if(!data.count(key)) return -1; data[key].second=++clock; return data[key].first; }
    void put(int key,int value) { if(!data.count(key)&&data.size()==(size_t)capacity){auto victim=min_element(data.begin(),data.end(),[](auto& a,auto& b){return a.second.second<b.second.second;});data.erase(victim);} data[key]={value,++clock}; }
};
int main() { LRUCache cache(2); cache.put(1,10); cache.put(2,20); cache.get(1); cache.put(3,30); cout<<cache.get(2); return 0; }
`);

add("01-matrix-bipartite-graph", "Brute Force (BFS From Every Cell)", "For each non-zero cell, run a fresh breadth-first search until the nearest zero is reached.", "O((R*C)^2)", "O(R*C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> distanceToZero(const vector<vector<int>>& grid) {
    int rows=grid.size(), columns=grid[0].size(), move[5]={-1,0,1,0,-1}; vector<vector<int>> answer(rows,vector<int>(columns));
    for(int sr=0;sr<rows;++sr) for(int sc=0;sc<columns;++sc) if(grid[sr][sc]) {
        queue<pair<int,int>> pending; vector<vector<int>> distance(rows,vector<int>(columns,-1)); pending.push({sr,sc}); distance[sr][sc]=0;
        while(!pending.empty()){auto [r,c]=pending.front();pending.pop();if(!grid[r][c]){answer[sr][sc]=distance[r][c];break;}for(int d=0;d<4;++d){int nr=r+move[d],nc=c+move[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&distance[nr][nc]<0){distance[nr][nc]=distance[r][c]+1;pending.push({nr,nc});}}}
    }
    return answer;
}
int main() { for(auto& row:distanceToZero({{0,0,0},{0,1,0},{1,1,1}})){for(int value:row)cout<<value<<" ";cout<<"\n";} return 0; }
`);

add("find-median-from-data-stream", "Brute Force (Sorted Insertion)", "Insert each value at its sorted position, then read the center element or center pair.", "O(N) add, O(1) median", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class MedianFinder {
    vector<int> values;
public:
    void addNum(int value) { values.insert(lower_bound(values.begin(), values.end(), value), value); }
    double findMedian() const { int n=values.size(); return n%2?values[n/2]:(values[n/2-1]+values[n/2])/2.0; }
};
int main() { MedianFinder finder; finder.addNum(1); finder.addNum(2); finder.addNum(3); cout<<finder.findMedian(); return 0; }
`);

add("largest-element-in-an-array", "Brute Force (Sort and Select)", "Sort a copy of the array and select its final element.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int largest(vector<int> values) { if(values.empty()) throw invalid_argument("empty"); sort(values.begin(),values.end()); return values.back(); }
int main() { cout<<largest({3,7,2,9,4}); return 0; }
`);

add("maximum-consecutive-ones", "Brute Force (All Starts)", "Start at every index and count how long the run of ones continues.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int longestOnes(const vector<int>& values) { int best=0; for(int left=0;left<(int)values.size();++left){int length=0;for(int right=left;right<(int)values.size()&&values[right]==1;++right)best=max(best,++length);}return best; }
int main() { cout<<longestOnes({1,1,0,1,1,1}); return 0; }
`);

add("find-the-number-that-appears-once", "Brute Force (Frequency Map)", "Count every value and return the one with frequency one.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int singleNumber(const vector<int>& values){unordered_map<int,int> count;for(int value:values)++count[value];for(auto [value,frequency]:count)if(frequency==1)return value;throw invalid_argument("missing");}
int main(){cout<<singleNumber({4,1,2,1,2});return 0;}
`);

add("find-out-how-many-times-array-has-been-rotated", "Brute Force (Minimum Scan)", "The index of the smallest value equals the rotation count, so scan all positions.", "O(N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int rotations(const vector<int>& values){return min_element(values.begin(),values.end())-values.begin();}
int main(){cout<<rotations({4,5,1,2,3});return 0;}
`);

add("find-square-root-of-a-number-in-log-n", "Brute Force (Linear Candidate Scan)", "Increase the candidate until the next square would exceed the input.", "O(sqrt(N))", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long integerSqrt(long long value){long long root=0;while((root+1)<=value/(root+1))++root;return root;}
int main(){cout<<integerSqrt(27);return 0;}
`);

add("split-array-largest-sum", "Better (Partition Dynamic Programming)", "Try every previous cut and minimize the largest segment sum for each prefix and partition count.", "O(K * N^2)", "O(K * N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long splitArray(const vector<int>& values,int groups){int n=values.size();vector<long long> prefix(n+1);for(int i=0;i<n;++i)prefix[i+1]=prefix[i]+values[i];const long long INF=LLONG_MAX/4;vector<vector<long long>> dp(groups+1,vector<long long>(n+1,INF));dp[0][0]=0;for(int g=1;g<=groups;++g)for(int end=1;end<=n;++end)for(int cut=g-1;cut<end;++cut)dp[g][end]=min(dp[g][end],max(dp[g-1][cut],prefix[end]-prefix[cut]));return dp[groups][n];}
int main(){cout<<splitArray({7,2,5,10,8},2);return 0;}
`);

add("painter-s-partition-problem", "Better (Partition Dynamic Programming)", "Compute the best maximum workload for every prefix and number of painters by trying each last cut.", "O(K * N^2)", "O(K * N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long partition(const vector<int>& boards,int painters){int n=boards.size();vector<long long> prefix(n+1);for(int i=0;i<n;++i)prefix[i+1]=prefix[i]+boards[i];vector<vector<long long>> dp(painters+1,vector<long long>(n+1,LLONG_MAX/4));dp[0][0]=0;for(int p=1;p<=painters;++p)for(int end=1;end<=n;++end)for(int cut=p-1;cut<end;++cut)dp[p][end]=min(dp[p][end],max(dp[p-1][cut],prefix[end]-prefix[cut]));return dp[painters][n];}
int main(){cout<<partition({10,20,30,40},2);return 0;}
`);

add("k-th-element-of-two-sorted-arrays", "Brute Force (Partial Merge)", "Merge the two sorted inputs only until the K-th element is produced.", "O(K)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int kth(const vector<int>& first,const vector<int>& second,int k){int i=0,j=0,value=0;while(k--){if(j==(int)second.size()||(i<(int)first.size()&&first[i]<=second[j]))value=first[i++];else value=second[j++];}return value;}
int main(){cout<<kth({2,3,6,7,9},{1,4,8,10},5);return 0;}
`);

add("count-number-of-substrings", "Brute Force (All Substrings)", "Extend every start position, track distinct characters, and count windows containing exactly K distinct values.", "O(N^2)", "O(Alphabet)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long countExactlyK(const string& text,int k){long long answer=0;for(int left=0;left<(int)text.size();++left){array<int,256> count{};int distinct=0;for(int right=left;right<(int)text.size();++right){unsigned char ch=text[right];if(count[ch]++==0)++distinct;if(distinct==k)++answer;if(distinct>k)break;}}return answer;}
int main(){cout<<countExactlyK("pqpqs",2);return 0;}
`);

add("sum-of-beauty-of-all-substrings", "Brute Force (Recount Every Window)", "Enumerate every substring and rescan its frequency table to compute maximum minus minimum positive frequency.", "O(N^2 * Alphabet)", "O(Alphabet)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int beautySum(const string& text){int answer=0;for(int left=0;left<(int)text.size();++left){array<int,26> count{};for(int right=left;right<(int)text.size();++right){++count[text[right]-'a'];int low=INT_MAX,high=0;for(int frequency:count)if(frequency){low=min(low,frequency);high=max(high,frequency);}answer+=high-low;}}return answer;}
int main(){cout<<beautySum("aabcb");return 0;}
`);

add("delete-the-middle-node-of-ll", "Brute Force (Length Counting)", "Count the nodes, then stop at the predecessor of the middle node and unlink it.", "O(N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*next;explicit Node(int x):value(x),next(nullptr){}};
Node* deleteMiddle(Node* head){if(!head||!head->next)return nullptr;int length=0;for(Node*node=head;node;node=node->next)++length;Node*node=head;for(int step=1;step<length/2;++step)node=node->next;node->next=node->next->next;return head;}
int main(){Node a(1),b(2),c(3),d(4),e(5);a.next=&b;b.next=&c;c.next=&d;d.next=&e;for(Node*n=deleteMiddle(&a);n;n=n->next)cout<<n->value<<" ";return 0;}
`);

add("sort-ll", "Brute Force (Array Buffer)", "Copy node values into an array, sort them, and write them back into the list.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*next;explicit Node(int x):value(x),next(nullptr){}};
void sortList(Node*head){vector<int>values;for(Node*node=head;node;node=node->next)values.push_back(node->value);sort(values.begin(),values.end());int index=0;for(Node*node=head;node;node=node->next)node->value=values[index++];}
int main(){Node a(4),b(2),c(1),d(3);a.next=&b;b.next=&c;c.next=&d;sortList(&a);for(Node*n=&a;n;n=n->next)cout<<n->value<<" ";return 0;}
`);

add("print-all-subsequences", "Better (Bitmask Enumeration)", "Use every bitmask from zero through 2^N minus one as a complete include-or-skip decision set.", "O(N * 2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> subsequences(const vector<int>& values){vector<vector<int>>answer;for(int mask=0;mask<(1<<(int)values.size());++mask){vector<int>current;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit))current.push_back(values[bit]);answer.push_back(current);}return answer;}
int main(){for(auto&part:subsequences({1,2,3})){for(int value:part)cout<<value;cout<<"\n";}return 0;}
`);

add("count-all-subsequences-with-sum-k", "Better (Subset-Sum DP)", "Accumulate how many subsequences produce every reachable sum after each input value.", "O(N * K)", "O(K)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long countSubsequences(const vector<int>&values,int target){vector<long long>ways(target+1);ways[0]=1;for(int value:values)for(int sum=target;sum>=value;--sum)ways[sum]+=ways[sum-value];return ways[target];}
int main(){cout<<countSubsequences({1,2,1},2);return 0;}
`);

add("check-if-there-exists-a-subsequence-with-sum-k", "Better (Boolean Subset DP)", "Carry a boolean table of reachable sums and update it backwards for each value.", "O(N * K)", "O(K)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool exists(const vector<int>&values,int target){vector<bool>reachable(target+1);reachable[0]=true;for(int value:values)for(int sum=target;sum>=value;--sum)reachable[sum]=reachable[sum]||reachable[sum-value];return reachable[target];}
int main(){cout<<boolalpha<<exists({1,2,3},5);return 0;}
`);

add("check-for-balanced-parentheses", "Brute Force (Repeated Pair Removal)", "Repeatedly erase adjacent bracket pairs until no further reduction is possible.", "O(N^2)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool balanced(string text){bool changed=true;while(changed){changed=false;for(const string pair:{"()","[]","{}"}){size_t position;while((position=text.find(pair))!=string::npos){text.erase(position,2);changed=true;}}}return text.empty();}
int main(){cout<<boolalpha<<balanced("{[()]}");return 0;}
`);

add("asteroid-collision", "Brute Force (Repeated Adjacent Resolution)", "Repeatedly scan for one right-moving and left-moving adjacent collision, resolve it, and restart.", "O(N^2)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> collide(vector<int> asteroids){bool changed=true;while(changed){changed=false;for(int i=0;i+1<(int)asteroids.size();++i)if(asteroids[i]>0&&asteroids[i+1]<0){int left=asteroids[i],right=asteroids[i+1];if(abs(left)==abs(right))asteroids.erase(asteroids.begin()+i,asteroids.begin()+i+2);else if(abs(left)>abs(right))asteroids.erase(asteroids.begin()+i+1);else asteroids.erase(asteroids.begin()+i);changed=true;break;}}return asteroids;}
int main(){for(int value:collide({5,10,-5}))cout<<value<<" ";return 0;}
`);

add("sum-of-subarray-ranges", "Brute Force (All Subarrays)", "Extend every subarray while maintaining its minimum and maximum, then add their difference.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long rangeSum(const vector<int>&values){long long answer=0;for(int left=0;left<(int)values.size();++left){int low=values[left],high=values[left];for(int right=left;right<(int)values.size();++right){low=min(low,values[right]);high=max(high,values[right]);answer+=high-low;}}return answer;}
int main(){cout<<rangeSum({1,2,3});return 0;}
`);

add("remove-k-digits", "Brute Force (Choose Remaining Digits)", "Enumerate which N-K digits remain, reject leading zeroes through normalization, and retain the smallest resulting number.", "O(C(N, K) * N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void choose(const string&digits,int index,int need,string&current,string&best){if(need==0){size_t first=current.find_first_not_of('0');string value=first==string::npos?"0":current.substr(first);if(best.empty()||value.size()<best.size()||(value.size()==best.size()&&value<best))best=value;return;}if((int)digits.size()-index<need)return;current.push_back(digits[index]);choose(digits,index+1,need-1,current,best);current.pop_back();choose(digits,index+1,need,current,best);}
string removeK(const string&digits,int k){string current,best;choose(digits,0,digits.size()-k,current,best);return best;}
int main(){cout<<removeK("1432219",3);return 0;}
`);

add("the-celebrity-problem", "Brute Force (Candidate Verification)", "Check every person against every other person until one satisfies both celebrity conditions.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int celebrity(const vector<vector<int>>&knows){int n=knows.size();for(int candidate=0;candidate<n;++candidate){bool valid=true;for(int person=0;person<n;++person)if(person!=candidate&&(knows[candidate][person]||!knows[person][candidate])){valid=false;break;}if(valid)return candidate;}return -1;}
int main(){cout<<celebrity({{0,1,0},{0,0,0},{0,1,0}});return 0;}
`);

add("count-number-of-nice-subarrays", "Brute Force (All Windows)", "Enumerate every subarray and count it when the number of odd elements equals K.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long nice(const vector<int>&values,int k){long long answer=0;for(int left=0;left<(int)values.size();++left){int odd=0;for(int right=left;right<(int)values.size();++right){odd+=values[right]&1;if(odd==k)++answer;if(odd>k)break;}}return answer;}
int main(){cout<<nice({1,1,2,1,1},3);return 0;}
`);

add("maximum-points-you-can-obtain-from-cards", "Brute Force (Every Left-Right Split)", "Try taking X cards from the left and K-X from the right for every possible split.", "O(K^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int maximumScore(const vector<int>&cards,int k){int answer=INT_MIN,n=cards.size();for(int left=0;left<=k;++left){int sum=0;for(int i=0;i<left;++i)sum+=cards[i];for(int i=0;i<k-left;++i)sum+=cards[n-1-i];answer=max(answer,sum);}return answer;}
int main(){cout<<maximumScore({1,2,3,4,5,6,1},3);return 0;}
`);

add("kth-smallest-element-in-an-array", "Brute Force (Full Sort)", "Sort the complete array and read the element at index K-1.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int kthSmallest(vector<int>values,int k){sort(values.begin(),values.end());return values.at(k-1);}
int main(){cout<<kthSmallest({7,10,4,3,20,15},3);return 0;}
`);

add("task-scheduler", "Better (Priority-Queue Simulation)", "At each time unit, run the remaining task with highest frequency while temporarily cooling recently used tasks.", "O(T log A)", "O(A + N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int leastInterval(const vector<char>&tasks,int cooldown){array<int,26>count{};for(char task:tasks)++count[task-'A'];priority_queue<int>ready;for(int frequency:count)if(frequency)ready.push(frequency);queue<pair<int,int>>waiting;int time=0;while(!ready.empty()||!waiting.empty()){++time;if(!ready.empty()){int remaining=ready.top()-1;ready.pop();if(remaining)waiting.push({remaining,time+cooldown});}if(!waiting.empty()&&waiting.front().second==time) {ready.push(waiting.front().first);waiting.pop();}}return time;}
int main(){cout<<leastInterval({'A','A','A','B','B','B'},2);return 0;}
`);

add("hand-of-straights", "Brute Force (Ordered Multiset)", "Repeatedly start from the smallest remaining card and erase one copy of every value required by that group.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool straightHand(const vector<int>&hand,int groupSize){if(hand.size()%groupSize)return false;multiset<int>cards(hand.begin(),hand.end());while(!cards.empty()){int start=*cards.begin();for(int value=start;value<start+groupSize;++value){auto position=cards.find(value);if(position==cards.end())return false;cards.erase(position);}}return true;}
int main(){cout<<boolalpha<<straightHand({1,2,3,6,2,3,4,7,8},3);return 0;}
`);

add("insert-interval", "Brute Force (Append, Sort, Merge)", "Append the new interval, sort all intervals by start, and run the standard full merge pass.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<pair<int,int>> insertInterval(vector<pair<int,int>>intervals,pair<int,int>added){intervals.push_back(added);sort(intervals.begin(),intervals.end());vector<pair<int,int>>answer;for(auto interval:intervals){if(answer.empty()||answer.back().second<interval.first)answer.push_back(interval);else answer.back().second=max(answer.back().second,interval.second);}return answer;}
int main(){for(auto [left,right]:insertInterval({{1,3},{6,9}},{2,5}))cout<<left<<" "<<right<<"\n";return 0;}
`);

add("non-overlapping-intervals", "Better (Longest Compatible Subsequence DP)", "Find the largest non-overlapping subset with dynamic programming; every other interval must be removed.", "O(N^2)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int eraseOverlap(vector<pair<int,int>>intervals){sort(intervals.begin(),intervals.end());int n=intervals.size(),best=0;vector<int>dp(n,1);for(int i=0;i<n;++i){for(int j=0;j<i;++j)if(intervals[j].second<=intervals[i].first)dp[i]=max(dp[i],dp[j]+1);best=max(best,dp[i]);}return n-best;}
int main(){cout<<eraseOverlap({{1,2},{2,3},{3,4},{1,3}});return 0;}
`);

add("check-if-two-trees-are-identical-or-not", "Better (Iterative Pair BFS)", "Traverse corresponding nodes together in a queue and reject the first structural or value mismatch.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
bool identical(Node*first,Node*second){queue<pair<Node*,Node*>>pending;pending.push({first,second});while(!pending.empty()){auto [a,b]=pending.front();pending.pop();if(!a||!b){if(a!=b)return false;continue;}if(a->value!=b->value)return false;pending.push({a->left,b->left});pending.push({a->right,b->right});}return true;}
int main(){Node a(1),b(1);cout<<boolalpha<<identical(&a,&b);return 0;}
`);

add("zig-zag-traversal", "Better (DFS by Depth)", "Collect nodes by depth recursively and reverse the insertion direction on alternating levels.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void collect(Node*node,int depth,vector<deque<int>>&levels){if(!node)return;if(depth==(int)levels.size())levels.push_back({});if(depth%2)levels[depth].push_front(node->value);else levels[depth].push_back(node->value);collect(node->left,depth+1,levels);collect(node->right,depth+1,levels);}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;vector<deque<int>>levels;collect(&root,0,levels);for(auto&level:levels){for(int value:level)cout<<value<<" ";cout<<"\n";}return 0;}
`);

add("bottom-view-of-binary-tree", "Better (DFS with Depth Tracking)", "For each horizontal distance, retain the deepest node encountered during depth-first traversal.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void visit(Node*node,int column,int depth,map<int,pair<int,int>>&view){if(!node)return;if(!view.count(column)||depth>=view[column].first)view[column]={depth,node->value};visit(node->left,column-1,depth+1,view);visit(node->right,column+1,depth+1,view);}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;map<int,pair<int,int>>view;visit(&root,0,0,view);for(auto [column,item]:view)cout<<item.second<<" ";return 0;}
`);

add("symmetric-binary-tree", "Better (Iterative Mirror Queue)", "Compare mirrored node pairs breadth-first, enqueuing outer children together and inner children together.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
bool symmetric(Node*root){if(!root)return true;queue<pair<Node*,Node*>>pending;pending.push({root->left,root->right});while(!pending.empty()){auto [a,b]=pending.front();pending.pop();if(!a||!b){if(a!=b)return false;continue;}if(a->value!=b->value)return false;pending.push({a->left,b->right});pending.push({a->right,b->left});}return true;}
int main(){Node root(1),a(2),b(2);root.left=&a;root.right=&b;cout<<boolalpha<<symmetric(&root);return 0;}
`);

add("count-total-nodes-in-a-complete-binary-tree", "Brute Force (Breadth-First Count)", "Visit every node with a queue and increment the count once per removal.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
int countNodes(Node*root){if(!root)return 0;queue<Node*>pending;pending.push(root);int count=0;while(!pending.empty()){Node*node=pending.front();pending.pop();++count;if(node->left)pending.push(node->left);if(node->right)pending.push(node->right);}return count;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;cout<<countNodes(&root);return 0;}
`);

add("serialize-and-deserialize-binary-tree", "Better (Preorder with Null Markers)", "Serialize a preorder stream containing explicit null markers and rebuild it using the same recursive order.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void encode(Node*node,ostringstream&out){if(!node){out<<"# ";return;}out<<node->value<<" ";encode(node->left,out);encode(node->right,out);}
Node* decode(istringstream&in){string token;if(!(in>>token)||token=="#")return nullptr;Node*node=new Node(stoi(token));node->left=decode(in);node->right=decode(in);return node;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;ostringstream out;encode(&root,out);istringstream in(out.str());cout<<decode(in)->right->value;return 0;}
`);

fs.writeFileSync(filename, `${JSON.stringify(catalog, null, 2)}\n`);
console.log("Expanded the C++ catalog with the standard alternate-strategy pack.");
