const fs = require("fs");
const path = require("path");
const filename = path.resolve(__dirname, "../data/algos/curated_cpp_variants.json");
const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));
function add(id, name, description, timeComplexity, spaceComplexity, code) {
  const approaches = catalog[id] || (catalog[id] = []);
  if (!approaches.some((approach) => approach.name === name)) approaches.push({ name, description, timeComplexity, spaceComplexity, code: code.trim() });
}

add("rat-in-a-maze", "Brute Force (Queue of Complete Paths)", "Carry a visited matrix and path string inside every queue state, exploring every simple route without recursive backtracking.", "O(4^(R*C))", "O(4^(R*C) * R * C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct State{int row;int column;string path;vector<vector<bool>>seen;};
vector<string> routes(const vector<vector<int>>&maze){int n=maze.size(),moves[5]={1,0,-1,0,1};string labels="DLUR";vector<string>answer;if(!n||!maze[0][0])return answer;queue<State>pending;vector<vector<bool>>initial(n,vector<bool>(n));initial[0][0]=true;pending.push({0,0,"",initial});while(!pending.empty()){State state=move(pending.front());pending.pop();if(state.row+1==n&&state.column+1==n){answer.push_back(state.path);continue;}for(int d=0;d<4;++d){int nr=state.row+moves[d],nc=state.column+moves[d+1];if(nr>=0&&nr<n&&nc>=0&&nc<n&&maze[nr][nc]&&!state.seen[nr][nc]){State next=state;next.row=nr;next.column=nc;next.path+=labels[d];next.seen[nr][nc]=true;pending.push(move(next));}}}sort(answer.begin(),answer.end());return answer;}
int main(){for(auto&path:routes({{1,0,0,0},{1,1,0,1},{1,1,0,0},{0,1,1,1}}))cout<<path<<" ";return 0;}
`);

add("word-search", "Brute Force (Enumerate Every Simple Board Path)", "Generate every simple path up to the word length from every board cell and compare the produced string with the target.", "O(R * C * 4^L)", "O(R * C + L)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool explore(const vector<vector<char>>&board,const string&word,int row,int column,string&built,vector<vector<bool>>&seen){if(built.size()==word.size())return built==word;int rows=board.size(),columns=board[0].size(),moves[5]={-1,0,1,0,-1};for(int d=0;d<4;++d){int nr=row+moves[d],nc=column+moves[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&!seen[nr][nc]){seen[nr][nc]=true;built+=board[nr][nc];if(explore(board,word,nr,nc,built,seen))return true;built.pop_back();seen[nr][nc]=false;}}return built==word;}
bool exists(const vector<vector<char>>&board,const string&word){int rows=board.size(),columns=board[0].size();for(int r=0;r<rows;++r)for(int c=0;c<columns;++c){vector<vector<bool>>seen(rows,vector<bool>(columns));seen[r][c]=true;string built(1,board[r][c]);if(explore(board,word,r,c,built,seen))return true;}return false;}
int main(){cout<<boolalpha<<exists({{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}},"ABCCED");return 0;}
`);

add("combination-sum-i", "Brute Force (Bounded Count Enumeration)", "Enumerate how many copies of every candidate are used from zero through target divided by that candidate.", "O(Product(target / candidate))", "O(N + target)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void enumerate(int index,int remaining,const vector<int>&candidates,vector<int>&current,vector<vector<int>>&answer){if(index==(int)candidates.size()){if(remaining==0)answer.push_back(current);return;}int value=candidates[index];for(int count=0;count*value<=remaining;++count){for(int i=0;i<count;++i)current.push_back(value);enumerate(index+1,remaining-count*value,candidates,current,answer);for(int i=0;i<count;++i)current.pop_back();}}
int main(){vector<int>current;vector<vector<int>>answer;enumerate(0,7,{2,3,6,7},current,answer);cout<<answer.size();return 0;}
`);

add("combination-sum-ii", "Brute Force (Bitmask plus Set Deduplication)", "Enumerate every index subset, keep target-sum subsets, sort each one, and deduplicate them with a set.", "O(N * 2^N log 2^N)", "O(N * 2^N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> combinations(const vector<int>&values,int target){set<vector<int>>unique;for(int mask=0;mask<(1<<(int)values.size());++mask){vector<int>current;int sum=0;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit)){current.push_back(values[bit]);sum+=values[bit];}if(sum==target){sort(current.begin(),current.end());unique.insert(current);}}return {unique.begin(),unique.end()};}
int main(){cout<<combinations({10,1,2,7,6,1,5},8).size();return 0;}
`);

add("sudoku-solver", "Optimal 2 (Bitmask Backtracking)", "Track used digits in row, column, and box bitmasks and branch on the empty cell with the fewest candidates.", "O(9^E) worst case", "O(E)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool solve(vector<vector<char>>&board,array<int,9>&rows,array<int,9>&columns,array<int,9>&boxes){int bestRow=-1,bestColumn=-1,bestMask=0,bestCount=10;for(int r=0;r<9;++r)for(int c=0;c<9;++c)if(board[r][c]=='.'){int mask=(~(rows[r]|columns[c]|boxes[(r/3)*3+c/3]))&0x1FF,count=__builtin_popcount((unsigned)mask);if(count<bestCount){bestCount=count;bestRow=r;bestColumn=c;bestMask=mask;}}if(bestRow<0)return true;if(bestCount==0)return false;int box=(bestRow/3)*3+bestColumn/3;for(int mask=bestMask;mask;mask&=mask-1){int bit=mask&-mask,digit=__builtin_ctz((unsigned)bit);board[bestRow][bestColumn]=char('1'+digit);rows[bestRow]|=bit;columns[bestColumn]|=bit;boxes[box]|=bit;if(solve(board,rows,columns,boxes))return true;rows[bestRow]^=bit;columns[bestColumn]^=bit;boxes[box]^=bit;}board[bestRow][bestColumn]='.';return false;}
int main(){vector<vector<char>>board={{'5','3','.','.','7','.','.','.','.'},{'6','.','.','1','9','5','.','.','.'},{'.','9','8','.','.','.','.','6','.'},{'8','.','.','.','6','.','.','.','3'},{'4','.','.','8','.','3','.','.','1'},{'7','.','.','.','2','.','.','.','6'},{'.','6','.','.','.','.','2','8','.'},{'.','.','.','4','1','9','.','.','5'},{'.','.','.','.','8','.','.','7','9'}};array<int,9>rows{},columns{},boxes{};for(int r=0;r<9;++r)for(int c=0;c<9;++c)if(board[r][c]!='.'){int bit=1<<(board[r][c]-'1');rows[r]|=bit;columns[c]|=bit;boxes[(r/3)*3+c/3]|=bit;}solve(board,rows,columns,boxes);cout<<board[0][2];return 0;}
`);

add("implement-trie", "Better (Hash-Map Children)", "Store only existing outgoing characters in hash maps, trading predictable arrays for sparse memory.", "O(L) per operation", "O(total characters)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class Trie{struct Node{unordered_map<char,unique_ptr<Node>>next;bool terminal=false;};Node root;public:void insert(const string&word){Node*node=&root;for(char ch:word){auto&child=node->next[ch];if(!child)child=make_unique<Node>();node=child.get();}node->terminal=true;}bool search(const string&word)const{const Node*node=&root;for(char ch:word){auto it=node->next.find(ch);if(it==node->next.end())return false;node=it->second.get();}return node->terminal;}bool startsWith(const string&prefix)const{const Node*node=&root;for(char ch:prefix){auto it=node->next.find(ch);if(it==node->next.end())return false;node=it->second.get();}return true;}};
int main(){Trie trie;trie.insert("apple");cout<<boolalpha<<trie.search("apple")<<" "<<trie.startsWith("app");return 0;}
`);

add("implement-trie-ii", "Better (Sparse Counted Trie)", "Use hash-map children with prefix and terminal counters to support duplicate insertion and erasure.", "O(L) per operation", "O(total characters)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class Trie{struct Node{unordered_map<char,unique_ptr<Node>>next;int prefix=0,terminal=0;};Node root;public:void insert(const string&word){Node*node=&root;for(char ch:word){auto&child=node->next[ch];if(!child)child=make_unique<Node>();node=child.get();++node->prefix;}++node->terminal;}int countWordsEqualTo(const string&word)const{const Node*node=&root;for(char ch:word){auto it=node->next.find(ch);if(it==node->next.end())return 0;node=it->second.get();}return node->terminal;}void erase(const string&word){Node*node=&root;vector<Node*>path;for(char ch:word){auto it=node->next.find(ch);if(it==node->next.end())return;node=it->second.get();path.push_back(node);}if(!node->terminal)return;--node->terminal;for(Node*part:path)--part->prefix;}};
int main(){Trie trie;trie.insert("apple");trie.insert("apple");trie.erase("apple");cout<<trie.countWordsEqualTo("apple");return 0;}
`);

add("word-ladder-ii", "Better (BFS Parent DAG plus DFS Reconstruction)", "BFS records every predecessor on a shortest layer, then DFS walks the parent DAG backward to emit all shortest sequences.", "O(W * L * Alphabet + output)", "O(W * L + output)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<string>> ladders(string begin,string end,const vector<string>&words){unordered_set<string>dictionary(words.begin(),words.end());if(!dictionary.count(end))return {};unordered_map<string,int>distance;unordered_map<string,vector<string>>parent;queue<string>pending;pending.push(begin);distance[begin]=0;while(!pending.empty()){string word=pending.front();pending.pop();string next=word;for(int i=0;i<(int)word.size();++i){char saved=next[i];for(char ch='a';ch<='z';++ch){next[i]=ch;if(!dictionary.count(next))continue;if(!distance.count(next)){distance[next]=distance[word]+1;parent[next].push_back(word);pending.push(next);}else if(distance[next]==distance[word]+1)parent[next].push_back(word);}next[i]=saved;}}vector<vector<string>>answer;vector<string>path{end};function<void(const string&)>build=[&](const string&word){if(word==begin){auto sequence=path;reverse(sequence.begin(),sequence.end());answer.push_back(sequence);return;}for(auto&previous:parent[word]){path.push_back(previous);build(previous);path.pop_back();}};if(distance.count(end))build(end);return answer;}
int main(){cout<<ladders("hit","cog",{"hot","dot","dog","lot","log","cog"}).size();return 0;}
`);

add("disjoint-set-union-by-rank-size", "Brute Force (Quick Find Labels)", "Store a component label for every element and relabel the entire old component during each union.", "O(N) union, O(1) find", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class QuickFind{vector<int>label;public:explicit QuickFind(int n):label(n){iota(label.begin(),label.end(),0);}int find(int value)const{return label[value];}void unite(int first,int second){int from=label[second],to=label[first];if(from==to)return;for(int&value:label)if(value==from)value=to;}};
int main(){QuickFind dsu(5);dsu.unite(0,1);dsu.unite(1,2);cout<<boolalpha<<(dsu.find(0)==dsu.find(2));return 0;}
`);

add("segment-tree-point-update-range-query", "Better (Iterative Segment Tree)", "Store leaves in the second half of an array, update ancestors upward, and query with two inward-moving indices.", "O(log N) update/query", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class SegmentTree{int size;vector<long long>tree;public:explicit SegmentTree(const vector<int>&values):size(values.size()),tree(2*size){for(int i=0;i<size;++i)tree[size+i]=values[i];for(int i=size-1;i;--i)tree[i]=tree[2*i]+tree[2*i+1];}void update(int index,int value){for(tree[index+=size]=value;index>1;index/=2)tree[index/2]=tree[index]+tree[index^1];}long long query(int left,int right)const{long long answer=0;for(left+=size,right+=size;left<right;left/=2,right/=2){if(left&1)answer+=tree[left++];if(right&1)answer+=tree[--right];}return answer;}};
int main(){SegmentTree tree({1,2,3,4});tree.update(1,5);cout<<tree.query(1,4);return 0;}
`);

add("fenwick-tree-binary-indexed-tree", "Brute Force (Direct Array Range Sum)", "Apply point updates directly and answer each range query by scanning its elements.", "O(1) update, O(N) query", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class RangeArray{vector<long long>values;public:explicit RangeArray(const vector<int>&input):values(input.begin(),input.end()){}void add(int index,int delta){values[index]+=delta;}long long rangeSum(int left,int right)const{return accumulate(values.begin()+left,values.begin()+right+1,0LL);}};
int main(){RangeArray data({1,2,3,4});data.add(1,3);cout<<data.rangeSum(1,3);return 0;}
`);

add("left-rotate-an-array-by-one-place", "Better (Auxiliary Output Array)", "Copy every element to its rotated destination, keeping the input untouched until the result is complete.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> rotateLeft(const vector<int>&values){if(values.empty())return {};vector<int>answer(values.size());for(int i=0;i<(int)values.size();++i)answer[i]=values[(i+1)%values.size()];return answer;}
int main(){for(int value:rotateLeft({1,2,3,4,5}))cout<<value<<" ";return 0;}
`);

add("design-twitter", "Brute Force (Global Tweet Scan)", "Store all tweets chronologically and scan backward at feed time until ten followed-author tweets are found.", "O(T) feed", "O(T + F)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class Twitter{struct Tweet{int user;int id;};vector<Tweet>tweets;unordered_map<int,unordered_set<int>>following;public:void postTweet(int user,int tweet){tweets.push_back({user,tweet});}void follow(int user,int other){following[user].insert(other);}void unfollow(int user,int other){following[user].erase(other);}vector<int>getNewsFeed(int user)const{vector<int>feed;for(auto it=tweets.rbegin();it!=tweets.rend()&&feed.size()<10;++it)if(it->user==user||(following.count(user)&&following.at(user).count(it->user)))feed.push_back(it->id);return feed;}};
int main(){Twitter twitter;twitter.postTweet(1,5);twitter.follow(1,2);twitter.postTweet(2,6);for(int tweet:twitter.getNewsFeed(1))cout<<tweet<<" ";return 0;}
`);

add("iterative-preorder", "Better (Recursive Preorder)", "Use the call stack to visit root, left subtree, and right subtree.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};void preorder(Node*node,vector<int>&order){if(!node)return;order.push_back(node->value);preorder(node->left,order);preorder(node->right,order);}int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;vector<int>order;preorder(&root,order);for(int value:order)cout<<value<<" ";return 0;}
`);

add("iterative-postorder-using-2-stacks", "Better (Recursive Postorder)", "Use recursion to visit both children before recording their parent.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};void postorder(Node*node,vector<int>&order){if(!node)return;postorder(node->left,order);postorder(node->right,order);order.push_back(node->value);}int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;vector<int>order;postorder(&root,order);for(int value:order)cout<<value<<" ";return 0;}
`);

add("iterative-postorder-using-1-stack", "Better (Recursive Postorder)", "Use the recursive call stack as the pending-state structure for left-right-root order.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};void postorder(Node*node,vector<int>&order){if(!node)return;postorder(node->left,order);postorder(node->right,order);order.push_back(node->value);}int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;vector<int>order;postorder(&root,order);for(int value:order)cout<<value<<" ";return 0;}
`);

add("preorder-inorder-postorder-in-a-single-traversal", "Brute Force (Three Independent Traversals)", "Run separate recursive preorder, inorder, and postorder traversals instead of sharing one stateful pass.", "O(3N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};void preorder(Node*n,vector<int>&o){if(!n)return;o.push_back(n->value);preorder(n->left,o);preorder(n->right,o);}void inorder(Node*n,vector<int>&o){if(!n)return;inorder(n->left,o);o.push_back(n->value);inorder(n->right,o);}void postorder(Node*n,vector<int>&o){if(!n)return;postorder(n->left,o);postorder(n->right,o);o.push_back(n->value);}int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;vector<int>pre,in,post;preorder(&root,pre);inorder(&root,in);postorder(&root,post);cout<<pre.size()+in.size()+post.size();return 0;}
`);

add("maximum-path-sum", "Brute Force (Every Simple Node Pair)", "Convert the tree to an undirected graph and DFS from every node to evaluate every simple path sum.", "O(N^2)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};void graph(Node*node,unordered_map<Node*,vector<Node*>>&edges,vector<Node*>&nodes){if(!node)return;nodes.push_back(node);for(Node*child:{node->left,node->right})if(child){edges[node].push_back(child);edges[child].push_back(node);graph(child,edges,nodes);}}void explore(Node*node,Node*parent,long long sum,const unordered_map<Node*,vector<Node*>>&edges,long long&best){sum+=node->value;best=max(best,sum);auto it=edges.find(node);if(it!=edges.end())for(Node*next:it->second)if(next!=parent)explore(next,node,sum,edges,best);}long long maximumPath(Node*root){unordered_map<Node*,vector<Node*>>edges;vector<Node*>nodes;graph(root,edges,nodes);long long best=LLONG_MIN;for(Node*start:nodes)explore(start,nullptr,0,edges,best);return best;}
int main(){Node root(-10),a(9),b(20),c(15),d(7);root.left=&a;root.right=&b;b.left=&c;b.right=&d;cout<<maximumPath(&root);return 0;}
`);

add("check-for-children-sum-property", "Better (Iterative Breadth-First Check)", "Visit every internal node with a queue and compare it to the sum of its existing children.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};bool childrenSum(Node*root){if(!root)return true;queue<Node*>pending;pending.push(root);while(!pending.empty()){Node*node=pending.front();pending.pop();if(!node->left&&!node->right)continue;int sum=0;if(node->left){sum+=node->left->value;pending.push(node->left);}if(node->right){sum+=node->right->value;pending.push(node->right);}if(sum!=node->value)return false;}return true;}
int main(){Node root(10),a(4),b(6);root.left=&a;root.right=&b;cout<<boolalpha<<childrenSum(&root);return 0;}
`);

add("graph-representation-in-c-java", "Better (Adjacency Matrix)", "Store one matrix cell per possible edge, providing constant-time edge lookup at quadratic memory cost.", "O(1) edge lookup", "O(V^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class Graph{vector<vector<int>>matrix;public:explicit Graph(int vertices):matrix(vertices,vector<int>(vertices)){}void addEdge(int from,int to,int weight=1,bool undirected=true){matrix[from][to]=weight;if(undirected)matrix[to][from]=weight;}int edge(int from,int to)const{return matrix[from][to];}};
int main(){Graph graph(3);graph.addEdge(0,2,7);cout<<graph.edge(2,0);return 0;}
`);

add("number-of-ways-to-arrive-at-destination", "Brute Force (Enumerate Simple Paths)", "Enumerate every simple source-to-destination path, track the minimum total weight, and count paths achieving it.", "O(V!)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void explore(int node,int target,long long cost,const vector<vector<pair<int,int>>>&graph,vector<bool>&seen,long long&best,long long&ways){if(cost>best)return;if(node==target){if(cost<best){best=cost;ways=1;}else if(cost==best)++ways;return;}seen[node]=true;for(auto [next,weight]:graph[node])if(!seen[next])explore(next,target,cost+weight,graph,seen,best,ways);seen[node]=false;}long long countPaths(int vertices,const vector<tuple<int,int,int>>&roads){vector<vector<pair<int,int>>>graph(vertices);for(auto [a,b,w]:roads){graph[a].push_back({b,w});graph[b].push_back({a,w});}vector<bool>seen(vertices);long long best=LLONG_MAX,ways=0;explore(0,vertices-1,0,graph,seen,best,ways);return ways;}
int main(){cout<<countPaths(4,{{0,1,1},{1,3,1},{0,2,1},{2,3,1}});return 0;}
`);

fs.writeFileSync(filename, `${JSON.stringify(catalog, null, 2)}\n`);
console.log("Expanded the C++ catalog with alternate strategy pack 4.");
