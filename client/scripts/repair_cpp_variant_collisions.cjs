const fs = require("fs");
const path = require("path");
const filename = path.resolve(__dirname, "../data/algos/curated_cpp_variants.json");
const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));

function replaceCode(id, name, code) {
  const approach = catalog[id]?.find((candidate) => candidate.name === name);
  if (!approach) throw new Error(`Missing ${id} / ${name}`);
  approach.code = code.trim();
}

replaceCode("morris-preorder-traversal", "Better (Explicit Stack Preorder)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* left; Node* right; explicit Node(int x) : value(x), left(nullptr), right(nullptr) {} };
vector<int> preorder(Node* root) {
    vector<int> order;
    vector<Node*> pending;
    if (root) pending.push_back(root);
    while (!pending.empty()) {
        Node* node = pending.back();
        pending.pop_back();
        order.push_back(node->value);
        if (node->right) pending.push_back(node->right);
        if (node->left) pending.push_back(node->left);
    }
    return order;
}
int main() {
    Node root(1), left(2), right(3);
    root.left = &left;
    root.right = &right;
    vector<int> order = preorder(&root);
    copy(order.begin(), order.end(), ostream_iterator<int>(cout, " "));
    return 0;
}`);

replaceCode("delete-a-node-in-bst", "Brute Force (Rebuild Remaining Values)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* left; Node* right; explicit Node(int x) : value(x), left(nullptr), right(nullptr) {} };
void collect(Node* node, int key, vector<int>& values) {
    if (!node) return;
    collect(node->left, key, values);
    if (node->value != key) values.push_back(node->value);
    collect(node->right, key, values);
}
Node* balanced(const vector<int>& values, int left, int right) {
    if (left > right) return nullptr;
    int middle = left + (right - left) / 2;
    Node* root = new Node(values[middle]);
    root->left = balanced(values, left, middle - 1);
    root->right = balanced(values, middle + 1, right);
    return root;
}
Node* erase(Node* root, int key) {
    vector<int> values;
    collect(root, key, values);
    return balanced(values, 0, (int)values.size() - 1);
}
int main() {
    Node root(2), left(1), right(3);
    root.left = &left;
    root.right = &right;
    Node* rebuilt = erase(&root, 2);
    cout << rebuilt->value;
    return 0;
}`);

replaceCode("iterative-postorder-using-1-stack", "Better (Recursive Postorder)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node { int value; Node* left; Node* right; explicit Node(int x) : value(x), left(nullptr), right(nullptr) {} };
vector<int> postorder(Node* root) {
    vector<int> order;
    stack<Node*> pending;
    if (root) pending.push(root);
    while (!pending.empty()) {
        Node* node = pending.top();
        pending.pop();
        order.push_back(node->value);
        if (node->left) pending.push(node->left);
        if (node->right) pending.push(node->right);
    }
    reverse(order.begin(), order.end());
    return order;
}
int main() {
    Node root(1), left(2), right(3);
    root.left = &left;
    root.right = &right;
    for (int value : postorder(&root)) cout << value << " ";
    return 0;
}`);
const postorderVariant = catalog["iterative-postorder-using-1-stack"].find(
  (candidate) => candidate.name === "Better (Recursive Postorder)"
);
postorderVariant.name = "Better (Reverse Modified Preorder)";
postorderVariant.description = "Build root-right-left order with one stack, then reverse it to obtain left-right-root postorder.";

fs.writeFileSync(filename, `${JSON.stringify(catalog, null, 2)}\n`);
console.log("Repaired alternate-solution collisions.");
