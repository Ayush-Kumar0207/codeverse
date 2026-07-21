const fs = require("fs");
const path = require("path");
const filename = path.resolve(__dirname, "../data/algos/curated_cpp_variants.json");
const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));
function add(id, name, description, timeComplexity, spaceComplexity, code) {
  const approaches = catalog[id] || (catalog[id] = []);
  if (!approaches.some((approach) => approach.name === name)) approaches.push({ name, description, timeComplexity, spaceComplexity, code: code.trim() });
}

add("top-view-of-binary-tree", "Better (Depth-First Column Map)", "Traverse with column and depth coordinates, retaining the shallowest node seen in each vertical column.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void visit(Node*node,int column,int depth,map<int,pair<int,int>>&view){if(!node)return;if(!view.count(column)||depth<view[column].first)view[column]={depth,node->value};visit(node->left,column-1,depth+1,view);visit(node->right,column+1,depth+1,view);}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;map<int,pair<int,int>>view;visit(&root,0,0,view);for(auto [column,item]:view)cout<<item.second<<" ";return 0;}
`);

add("morris-preorder-traversal", "Better (Explicit Stack Preorder)", "Use a stack and push right before left so the next popped node follows preorder.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
vector<int> preorder(Node*root){vector<int>order;if(!root)return order;stack<Node*>pending;pending.push(root);while(!pending.empty()){Node*node=pending.top();pending.pop();order.push_back(node->value);if(node->right)pending.push(node->right);if(node->left)pending.push(node->left);}return order;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;for(int value:preorder(&root))cout<<value<<" ";return 0;}
`);

add("print-longest-common-subsequence", "Brute Force (Enumerate Subsequences)", "Enumerate every subsequence of the shorter string and retain the longest one that is also a subsequence of the other string.", "O(2^N * M)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool subsequence(const string&candidate,const string&text){int index=0;for(char ch:text)if(index<(int)candidate.size()&&candidate[index]==ch)++index;return index==(int)candidate.size();}
string lcs(const string&first,const string&second){const string&small=first.size()<=second.size()?first:second;const string&large=first.size()<=second.size()?second:first;string best;for(int mask=0;mask<(1<<(int)small.size());++mask){string candidate;for(int bit=0;bit<(int)small.size();++bit)if(mask&(1<<bit))candidate+=small[bit];if(candidate.size()>best.size()&&subsequence(candidate,large))best=candidate;}return best;}
int main(){cout<<lcs("abcde","ace");return 0;}
`);

add("reverse-nodes-in-k-group", "Better (Stack per Group)", "Collect each full group in a stack, append it in reverse order, and leave a final incomplete group unchanged.", "O(N)", "O(K)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*next;explicit Node(int x):value(x),next(nullptr){}};
Node* reverseGroups(Node*head,int k){Node dummy(0),*tail=&dummy,*node=head;while(node){vector<Node*>group;Node*cursor=node;for(int i=0;i<k&&cursor;++i){group.push_back(cursor);cursor=cursor->next;}if((int)group.size()<k){tail->next=node;break;}for(int i=k-1;i>=0;--i){tail->next=group[i];tail=tail->next;}tail->next=cursor;node=cursor;}return dummy.next;}
int main(){Node a(1),b(2),c(3),d(4);a.next=&b;b.next=&c;c.next=&d;for(Node*n=reverseGroups(&a,2);n;n=n->next)cout<<n->value<<" ";return 0;}
`);

add("flattening-of-ll", "Better (Min-Heap K-Way Merge)", "Push the head of every vertical sorted chain into a min-heap and repeatedly append the smallest node.", "O(N log K)", "O(K)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*next;Node*down;explicit Node(int x):value(x),next(nullptr),down(nullptr){}};
Node* flatten(Node*head){priority_queue<pair<int,Node*>,vector<pair<int,Node*>>,greater<pair<int,Node*>>>pending;for(Node*node=head;node;node=node->next)pending.push({node->value,node});Node dummy(0),*tail=&dummy;while(!pending.empty()){Node*node=pending.top().second;pending.pop();tail->down=node;tail=node;if(node->down)pending.push({node->down->value,node->down});tail->next=nullptr;}return dummy.down;}
int main(){Node a(1),b(4),c(2),d(3);a.next=&c;a.down=&b;c.down=&d;for(Node*n=flatten(&a);n;n=n->down)cout<<n->value<<" ";return 0;}
`);

add("bridges-in-graph-tarjan-s-algorithm", "Brute Force (Remove Every Edge)", "Remove each edge in turn and test whether its endpoints remain connected.", "O(E * (V + E))", "O(V + E)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool connected(int start,int target,const vector<vector<int>>&graph,pair<int,int>removed){queue<int>pending;vector<bool>seen(graph.size());pending.push(start);seen[start]=true;while(!pending.empty()){int node=pending.front();pending.pop();if(node==target)return true;for(int next:graph[node])if(!seen[next]&&!((node==removed.first&&next==removed.second)||(node==removed.second&&next==removed.first))){seen[next]=true;pending.push(next);}}return false;}
vector<pair<int,int>> bridges(const vector<vector<int>>&graph){vector<pair<int,int>>answer;for(int node=0;node<(int)graph.size();++node)for(int next:graph[node])if(node<next&&!connected(node,next,graph,{node,next}))answer.push_back({node,next});return answer;}
int main(){vector<vector<int>>graph={{1},{0,2},{1}};for(auto [a,b]:bridges(graph))cout<<a<<"-"<<b<<" ";return 0;}
`);

add("articulation-point", "Brute Force (Remove Every Vertex)", "Temporarily exclude each vertex and compare the number of remaining connected components with the original graph.", "O(V * (V + E))", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int components(const vector<vector<int>>&graph,int removed){vector<bool>seen(graph.size());int count=0;for(int start=0;start<(int)graph.size();++start)if(start!=removed&&!seen[start]){++count;stack<int>pending;pending.push(start);seen[start]=true;while(!pending.empty()){int node=pending.top();pending.pop();for(int next:graph[node])if(next!=removed&&!seen[next]){seen[next]=true;pending.push(next);}}}return count;}
vector<int> articulation(const vector<vector<int>>&graph){int baseline=components(graph,-1);vector<int>answer;for(int node=0;node<(int)graph.size();++node)if(components(graph,node)>baseline)answer.push_back(node);return answer;}
int main(){vector<vector<int>>graph={{1},{0,2,3},{1},{1}};for(int node:articulation(graph))cout<<node<<" ";return 0;}
`);

add("armstrong-numbers", "Better (String Digit Extraction)", "Use the decimal representation to obtain both the digit count and each digit before summing powers.", "O(D)", "O(D)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool armstrong(int value){string digits=to_string(value);long long sum=0;for(char ch:digits)sum+=llround(pow(ch-'0',digits.size()));return sum==value;}
int main(){cout<<boolalpha<<armstrong(153);return 0;}
`);

add("remove-outermost-parenthesis", "Better (Explicit Stack Depth)", "Use stack depth before push and after pop to omit exactly the first opening and final closing bracket of each primitive.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
string removeOuter(const string&text){string answer;stack<char>open;for(char ch:text){if(ch=='('){if(!open.empty())answer+=ch;open.push(ch);}else{open.pop();if(!open.empty())answer+=ch;}}return answer;}
int main(){cout<<removeOuter("(()())(())");return 0;}
`);

add("largest-odd-number-in-a-string", "Brute Force (Test Every Prefix)", "Inspect every prefix, retaining the longest one whose final digit is odd.", "O(N^2)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
string largestOdd(const string&digits){string answer;for(int length=1;length<=(int)digits.size();++length)if((digits[length-1]-'0')%2)answer=digits.substr(0,length);return answer;}
int main(){cout<<largestOdd("35427");return 0;}
`);

add("maximum-nesting-depth-of-parentheses", "Better (Stack Depth)", "Push every opening parenthesis, pop every closing one, and track the maximum stack size.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int maximumDepth(const string&text){stack<char>open;int answer=0;for(char ch:text){if(ch=='('){open.push(ch);answer=max(answer,(int)open.size());}else if(ch==')')open.pop();}return answer;}
int main(){cout<<maximumDepth("(1+(2*3)+((8)/4))+1");return 0;}
`);

add("word-break", "Brute Force (Plain Recursion)", "Try every dictionary word as the next prefix without caching repeated suffixes.", "O(2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool breakable(const string&text,int start,const unordered_set<string>&dictionary){if(start==(int)text.size())return true;for(int end=start+1;end<=(int)text.size();++end)if(dictionary.count(text.substr(start,end-start))&&breakable(text,end,dictionary))return true;return false;}
int main(){unordered_set<string>dictionary={"leet","code"};cout<<boolalpha<<breakable("leetcode",0,dictionary);return 0;}
`);

add("delete-node-in-a-bst", "Brute Force (Rebuild Without Key)", "Collect all values except the deleted key and insert them into a fresh BST.", "O(N * H)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void collect(Node*node,int key,vector<int>&values){if(!node)return;collect(node->left,key,values);if(node->value!=key)values.push_back(node->value);collect(node->right,key,values);}
Node* insert(Node*root,int value){if(!root)return new Node(value);if(value<root->value)root->left=insert(root->left,value);else root->right=insert(root->right,value);return root;}
Node* erase(Node*root,int key){vector<int>values;collect(root,key,values);Node*answer=nullptr;for(int value:values)answer=insert(answer,value);return answer;}
int main(){Node root(2),a(1),b(3);root.left=&a;root.right=&b;cout<<erase(&root,2)->value;return 0;}
`);

add("ceil-in-a-bst", "Brute Force (Full Inorder Scan)", "Traverse every BST value and retain the smallest value not less than the target.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void scan(Node*node,int target,int&answer){if(!node)return;scan(node->left,target,answer);if(node->value>=target)answer=min(answer,node->value);scan(node->right,target,answer);}
int main(){Node root(4),a(2),b(6);root.left=&a;root.right=&b;int answer=INT_MAX;scan(&root,5,answer);cout<<answer;return 0;}
`);

add("floor-in-a-bst", "Brute Force (Full Inorder Scan)", "Traverse every BST value and retain the greatest value not exceeding the target.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void scan(Node*node,int target,int&answer){if(!node)return;scan(node->left,target,answer);if(node->value<=target)answer=max(answer,node->value);scan(node->right,target,answer);}
int main(){Node root(4),a(2),b(6);root.left=&a;root.right=&b;int answer=INT_MIN;scan(&root,5,answer);cout<<answer;return 0;}
`);

add("recover-bst", "Brute Force (Sort Inorder Values)", "Collect inorder node pointers and their values, sort the values, then write the sorted order back.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void collect(Node*node,vector<Node*>&nodes){if(!node)return;collect(node->left,nodes);nodes.push_back(node);collect(node->right,nodes);}
void recover(Node*root){vector<Node*>nodes;collect(root,nodes);vector<int>values;for(Node*node:nodes)values.push_back(node->value);sort(values.begin(),values.end());for(int i=0;i<(int)nodes.size();++i)nodes[i]->value=values[i];}
int main(){Node root(1),a(3),b(2);root.left=&a;a.right=&b;recover(&root);cout<<root.value;return 0;}
`);

add("largest-bst-in-binary-tree", "Brute Force (Validate Every Subtree)", "Treat every node as a candidate root, validate its subtree against bounds, and count it when valid.", "O(N^2)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
bool valid(Node*node,long long low,long long high){return !node||(node->value>low&&node->value<high&&valid(node->left,low,node->value)&&valid(node->right,node->value,high));}
int size(Node*node){return node?1+size(node->left)+size(node->right):0;}
int largest(Node*node){if(!node)return 0;if(valid(node,LLONG_MIN,LLONG_MAX))return size(node);return max(largest(node->left),largest(node->right));}
int main(){Node root(5),a(2),b(4);root.left=&a;root.right=&b;cout<<largest(&root);return 0;}
`);

add("n-meetings-in-one-room", "Brute Force (Enumerate Subsets)", "Enumerate every meeting subset, sort it by finish time, and keep the largest conflict-free selection.", "O(2^N * N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int maximumMeetings(const vector<pair<int,int>>&meetings){int best=0,n=meetings.size();for(int mask=0;mask<(1<<n);++mask){vector<pair<int,int>>chosen;for(int i=0;i<n;++i)if(mask&(1<<i))chosen.push_back(meetings[i]);sort(chosen.begin(),chosen.end(),[](auto&a,auto&b){return a.second<b.second;});bool valid=true;int finish=INT_MIN;for(auto [start,end]:chosen){if(start<=finish){valid=false;break;}finish=end;}if(valid)best=max(best,(int)chosen.size());}return best;}
int main(){cout<<maximumMeetings({{1,2},{3,4},{0,6},{5,7}});return 0;}
`);

add("job-sequencing-problem", "Better (Backward Slot Scan)", "Sort jobs by profit and scan backward for the latest free slot before each deadline.", "O(N log N + N * D)", "O(D)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Job{int deadline;int profit;};
pair<int,int> schedule(vector<Job>jobs){sort(jobs.begin(),jobs.end(),[](auto&a,auto&b){return a.profit>b.profit;});int limit=0;for(auto job:jobs)limit=max(limit,job.deadline);vector<bool>used(limit+1);int count=0,profit=0;for(auto job:jobs)for(int slot=min(limit,job.deadline);slot>0;--slot)if(!used[slot]){used[slot]=true;++count;profit+=job.profit;break;}return {count,profit};}
int main(){auto answer=schedule({{2,100},{1,19},{2,27},{1,25},{3,15}});cout<<answer.first<<" "<<answer.second;return 0;}
`);

add("surrounded-regions", "Better (Disjoint Set Boundary Component)", "Union adjacent open cells and protect every open cell connected to a virtual boundary node.", "O(R * C * alpha(RC))", "O(R * C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct DSU{vector<int>parent,size;explicit DSU(int n):parent(n),size(n,1){iota(parent.begin(),parent.end(),0);}int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}void unite(int a,int b){a=find(a);b=find(b);if(a==b)return;if(size[a]<size[b])swap(a,b);parent[b]=a;size[a]+=size[b];}};
void solve(vector<vector<char>>&board){int rows=board.size(),columns=board[0].size(),outside=rows*columns,moves[5]={-1,0,1,0,-1};DSU dsu(outside+1);for(int r=0;r<rows;++r)for(int c=0;c<columns;++c)if(board[r][c]=='O'){int id=r*columns+c;if(r==0||c==0||r+1==rows||c+1==columns)dsu.unite(id,outside);for(int d=0;d<4;++d){int nr=r+moves[d],nc=c+moves[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&board[nr][nc]=='O')dsu.unite(id,nr*columns+nc);}}for(int r=0;r<rows;++r)for(int c=0;c<columns;++c)if(board[r][c]=='O'&&dsu.find(r*columns+c)!=dsu.find(outside))board[r][c]='X';}
int main(){vector<vector<char>>board={{'X','X','X'},{'X','O','X'},{'X','X','X'}};solve(board);cout<<board[1][1];return 0;}
`);

add("number-of-enclaves", "Brute Force (Inspect Every Land Component)", "Explore each unvisited land component, record whether it touches a boundary, and count its cells only when fully enclosed.", "O(R * C)", "O(R * C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int enclaves(const vector<vector<int>>&grid){int rows=grid.size(),columns=grid[0].size(),answer=0,moves[5]={-1,0,1,0,-1};vector<vector<bool>>seen(rows,vector<bool>(columns));for(int sr=0;sr<rows;++sr)for(int sc=0;sc<columns;++sc)if(grid[sr][sc]&&!seen[sr][sc]){queue<pair<int,int>>pending;pending.push({sr,sc});seen[sr][sc]=true;int cells=0;bool boundary=false;while(!pending.empty()){auto [r,c]=pending.front();pending.pop();++cells;boundary=boundary||r==0||c==0||r+1==rows||c+1==columns;for(int d=0;d<4;++d){int nr=r+moves[d],nc=c+moves[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&grid[nr][nc]&&!seen[nr][nc]){seen[nr][nc]=true;pending.push({nr,nc});}}}if(!boundary)answer+=cells;}return answer;}
int main(){cout<<enclaves({{0,0,0,0},{1,0,1,0},{0,1,1,0},{0,0,0,0}});return 0;}
`);

add("word-ladder-i", "Brute Force (Explicit Word Graph)", "Connect every pair of dictionary words that differ in one position, then run BFS on the constructed graph.", "O(W^2 * L)", "O(W^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool adjacent(const string&a,const string&b){int differences=0;for(int i=0;i<(int)a.size();++i)differences+=a[i]!=b[i];return differences==1;}
int ladder(string begin,string end,vector<string>words){words.push_back(begin);int n=words.size(),start=n-1,target=find(words.begin(),words.end(),end)-words.begin();if(target==n)return 0;vector<vector<int>>graph(n);for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)if(adjacent(words[i],words[j])){graph[i].push_back(j);graph[j].push_back(i);}queue<int>pending;vector<int>distance(n,-1);pending.push(start);distance[start]=1;while(!pending.empty()){int node=pending.front();pending.pop();if(node==target)return distance[node];for(int next:graph[node])if(distance[next]<0){distance[next]=distance[node]+1;pending.push(next);}}return 0;}
int main(){cout<<ladder("hit","cog",{"hot","dot","dog","lot","log","cog"});return 0;}
`);

add("power-set", "Better (Recursive Include-or-Skip)", "Build every subset with one recursive exclusion branch and one inclusion branch per element.", "O(N * 2^N)", "O(N * 2^N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void build(int index,const vector<int>&values,vector<int>&current,vector<vector<int>>&answer){if(index==(int)values.size()){answer.push_back(current);return;}build(index+1,values,current,answer);current.push_back(values[index]);build(index+1,values,current,answer);current.pop_back();}
int main(){vector<int>current;vector<vector<int>>answer;build(0,{1,2,3},current,answer);cout<<answer.size();return 0;}
`);

add("reverse-every-word-in-a-string", "Better (String Stream Tokens)", "Tokenize words with a stream, reverse each token, and join them with single spaces.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
string reverseWords(const string&text){istringstream input(text);ostringstream output;string word;bool first=true;while(input>>word){reverse(word.begin(),word.end());if(!first)output<<' ';output<<word;first=false;}return output.str();}
int main(){cout<<reverseWords("Code Verse learns");return 0;}
`);

add("segregate-even-and-odd-nodes-in-ll", "Brute Force (Value Buffer)", "Copy even values followed by odd values into a buffer, then rewrite the list nodes.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*next;explicit Node(int x):value(x),next(nullptr){}};
void segregate(Node*head){vector<int>values;for(Node*n=head;n;n=n->next)if(n->value%2==0)values.push_back(n->value);for(Node*n=head;n;n=n->next)if(n->value%2)values.push_back(n->value);int index=0;for(Node*n=head;n;n=n->next)n->value=values[index++];}
int main(){Node a(1),b(2),c(3),d(4);a.next=&b;b.next=&c;c.next=&d;segregate(&a);for(Node*n=&a;n;n=n->next)cout<<n->value<<" ";return 0;}
`);

add("add-two-numbers-represented-by-ll", "Better (Two Digit Stacks)", "Push both forward-order lists into stacks and build the result from the least-significant digits toward the front.", "O(N + M)", "O(N + M)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*next;explicit Node(int x):value(x),next(nullptr){}};
Node* add(Node*first,Node*second){stack<int>a,b;for(;first;first=first->next)a.push(first->value);for(;second;second=second->next)b.push(second->value);Node*head=nullptr;int carry=0;while(!a.empty()||!b.empty()||carry){int sum=carry;if(!a.empty()){sum+=a.top();a.pop();}if(!b.empty()){sum+=b.top();b.pop();}Node*node=new Node(sum%10);node->next=head;head=node;carry=sum/10;}return head;}
int main(){Node a(7),b(2),c(4),d(3),e(5),f(6),g(4);a.next=&b;b.next=&c;c.next=&d;e.next=&f;f.next=&g;for(Node*n=add(&a,&e);n;n=n->next)cout<<n->value;return 0;}
`);

add("reverse-ll-in-groups-of-size-k", "Better (Stack per Full Group)", "Use a stack to reverse each complete group while connecting a final short group without reversal.", "O(N)", "O(K)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*next;explicit Node(int x):value(x),next(nullptr){}};
Node* reverseK(Node*head,int k){Node dummy(0),*tail=&dummy,*node=head;while(node){vector<Node*>group;Node*cursor=node;for(int i=0;i<k&&cursor;++i){group.push_back(cursor);cursor=cursor->next;}if((int)group.size()<k){tail->next=node;break;}for(int i=k-1;i>=0;--i){tail->next=group[i];tail=tail->next;}tail->next=cursor;node=cursor;}return dummy.next;}
int main(){Node a(1),b(2),c(3);a.next=&b;b.next=&c;for(Node*n=reverseK(&a,2);n;n=n->next)cout<<n->value<<" ";return 0;}
`);

add("subset-sum-ii", "Brute Force (Bitmasks and Set Deduplication)", "Generate every subset by bitmask and store sorted subsets in an ordered set to remove duplicates.", "O(N * 2^N log 2^N)", "O(N * 2^N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> uniqueSubsets(vector<int>values){sort(values.begin(),values.end());set<vector<int>>unique;for(int mask=0;mask<(1<<(int)values.size());++mask){vector<int>subset;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit))subset.push_back(values[bit]);unique.insert(subset);}return {unique.begin(),unique.end()};}
int main(){cout<<uniqueSubsets({1,2,2}).size();return 0;}
`);

add("combination-sum-iii", "Brute Force (Nine-Bit Masks)", "Enumerate all subsets of digits one through nine and retain those with K digits and the requested sum.", "O(2^9 * 9)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> combinations(int k,int target){vector<vector<int>>answer;for(int mask=0;mask<(1<<9);++mask)if(__builtin_popcount((unsigned)mask)==k){vector<int>current;int sum=0;for(int bit=0;bit<9;++bit)if(mask&(1<<bit)){current.push_back(bit+1);sum+=bit+1;}if(sum==target)answer.push_back(current);}return answer;}
int main(){cout<<combinations(3,9).size();return 0;}
`);

add("letter-combinations-of-a-phone-number", "Better (Iterative Cartesian Product)", "Start with an empty prefix and append every letter for each digit to form the next prefix layer.", "O(4^N)", "O(4^N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<string> combinations(const string&digits){if(digits.empty())return {};vector<string>mapping={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"},answer={""};for(char digit:digits){vector<string>next;for(const string&prefix:answer)for(char letter:mapping[digit-'0'])next.push_back(prefix+letter);answer.swap(next);}return answer;}
int main(){for(auto&text:combinations("23"))cout<<text<<" ";return 0;}
`);

add("m-coloring-problem", "Brute Force (All Color Assignments)", "Enumerate all M^V complete color assignments and validate every graph edge.", "O(M^V * E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool colorable(const vector<vector<int>>&graph,int colors){int vertices=graph.size(),total=1;for(int i=0;i<vertices;++i)total*=colors;vector<int>assignment(vertices);for(int code=0;code<total;++code){int value=code;for(int i=0;i<vertices;++i){assignment[i]=value%colors;value/=colors;}bool valid=true;for(int node=0;node<vertices;++node)for(int next:graph[node])if(assignment[node]==assignment[next])valid=false;if(valid)return true;}return false;}
int main(){cout<<boolalpha<<colorable({{1,2},{0,2},{0,1}},3);return 0;}
`);

add("number-of-nges-to-the-right", "Brute Force (Right-Side Scan)", "For each query index, scan all elements to its right and count those strictly greater.", "O(Q * N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> counts(const vector<int>&values,const vector<int>&queries){vector<int>answer;for(int index:queries){int count=0;for(int right=index+1;right<(int)values.size();++right)count+=values[right]>values[index];answer.push_back(count);}return answer;}
int main(){for(int value:counts({3,4,2,7,5,8,10,6},{0,5}))cout<<value<<" ";return 0;}
`);

add("maximal-rectangle", "Brute Force (Every Rectangle)", "Enumerate top, bottom, left, and right boundaries and verify that every enclosed matrix cell is one.", "O(R^3 * C^3)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int maximal(const vector<vector<char>>&matrix){int rows=matrix.size(),columns=matrix[0].size(),best=0;for(int top=0;top<rows;++top)for(int bottom=top;bottom<rows;++bottom)for(int left=0;left<columns;++left)for(int right=left;right<columns;++right){bool valid=true;for(int r=top;r<=bottom&&valid;++r)for(int c=left;c<=right;++c)if(matrix[r][c]=='0'){valid=false;break;}if(valid)best=max(best,(bottom-top+1)*(right-left+1));}return best;}
int main(){cout<<maximal({{'1','0','1'},{'1','1','1'}});return 0;}
`);

add("minimum-window-subsequence", "Brute Force (All Starting Points)", "From every source index, scan forward until the target becomes a subsequence and retain the shortest successful window.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
string minimumWindow(const string&source,const string&target){int bestStart=-1,bestLength=INT_MAX;for(int left=0;left<(int)source.size();++left){int matched=0;for(int right=left;right<(int)source.size();++right){if(source[right]==target[matched])++matched;if(matched==(int)target.size()){if(right-left+1<bestLength){bestStart=left;bestLength=right-left+1;}break;}}}return bestStart<0?"":source.substr(bestStart,bestLength);}
int main(){cout<<minimumWindow("abcdebdde","bde");return 0;}
`);

add("check-if-an-array-is-a-min-heap", "Better (Recursive Parent Validation)", "Recursively verify both child relationships for every internal node.", "O(N)", "O(log N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool minHeap(const vector<int>&values,int index=0){int left=2*index+1,right=left+1;if(left>=(int)values.size())return true;if(values[index]>values[left])return false;if(right<(int)values.size()&&values[index]>values[right])return false;return minHeap(values,left)&&(right>=(int)values.size()||minHeap(values,right));}
int main(){cout<<boolalpha<<minHeap({1,3,2,7,6,4});return 0;}
`);

add("sort-k-sorted-array", "Brute Force (Full Comparison Sort)", "Ignore the displacement promise and sort the complete array with a general comparison sort.", "O(N log N)", "O(log N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void sortK(vector<int>&values){sort(values.begin(),values.end());}
int main(){vector<int>values={6,5,3,2,8,10,9};sortK(values);for(int value:values)cout<<value<<" ";return 0;}
`);

add("find-minimum-number-of-coins", "Better (Unbounded Coin DP)", "Compute the minimum coins for every amount, supporting arbitrary coin systems where greedy choice is not guaranteed.", "O(N * Amount)", "O(Amount)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int minimumCoins(const vector<int>&coins,int amount){vector<int>dp(amount+1,amount+1);dp[0]=0;for(int value=1;value<=amount;++value)for(int coin:coins)if(coin<=value)dp[value]=min(dp[value],1+dp[value-coin]);return dp[amount]>amount?-1:dp[amount];}
int main(){cout<<minimumCoins({1,3,4},6);return 0;}
`);

add("preorder-traversal", "Better (Explicit Stack)", "Pop a node, record it, then push right and left children so left is processed next.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
vector<int> preorder(Node*root){vector<int>order;if(!root)return order;stack<Node*>pending;pending.push(root);while(!pending.empty()){Node*node=pending.top();pending.pop();order.push_back(node->value);if(node->right)pending.push(node->right);if(node->left)pending.push(node->left);}return order;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;for(int value:preorder(&root))cout<<value<<" ";return 0;}
`);

add("postorder-traversal", "Better (Two Explicit Stacks)", "Build root-right-left order in one stack and reverse it through a second stack to obtain left-right-root.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
vector<int> postorder(Node*root){vector<int>order;if(!root)return order;stack<Node*>first,second;first.push(root);while(!first.empty()){Node*node=first.top();first.pop();second.push(node);if(node->left)first.push(node->left);if(node->right)first.push(node->right);}while(!second.empty()){order.push_back(second.top()->value);second.pop();}return order;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;for(int value:postorder(&root))cout<<value<<" ";return 0;}
`);

add("vertical-order-traversal", "Better (DFS Coordinates and Sorting)", "Collect column, row, and value triples during DFS, then sort them by the required vertical-order keys.", "O(N log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void collect(Node*node,int row,int column,vector<tuple<int,int,int>>&items){if(!node)return;items.push_back({column,row,node->value});collect(node->left,row+1,column-1,items);collect(node->right,row+1,column+1,items);}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;vector<tuple<int,int,int>>items;collect(&root,0,0,items);sort(items.begin(),items.end());for(auto [column,row,value]:items)cout<<value<<" ";return 0;}
`);

add("root-to-node-path", "Better (Parent Map Reconstruction)", "Traverse once to record every parent, then walk from the target back to the root and reverse that chain.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
vector<int> path(Node*root,int target){unordered_map<Node*,Node*>parent;queue<Node*>pending;pending.push(root);parent[root]=nullptr;Node*found=nullptr;while(!pending.empty()){Node*node=pending.front();pending.pop();if(node->value==target){found=node;break;}for(Node*next:{node->left,node->right})if(next){parent[next]=node;pending.push(next);}}vector<int>answer;for(Node*node=found;node;node=parent[node])answer.push_back(node->value);reverse(answer.begin(),answer.end());return answer;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;for(int value:path(&root,3))cout<<value<<" ";return 0;}
`);

add("lca-in-binary-tree", "Brute Force (Two Root Paths)", "Find root-to-node paths independently and return their final common position.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
bool findPath(Node*node,int target,vector<Node*>&path){if(!node)return false;path.push_back(node);if(node->value==target)return true;if(findPath(node->left,target,path)||findPath(node->right,target,path))return true;path.pop_back();return false;}
Node* lca(Node*root,int first,int second){vector<Node*>a,b;findPath(root,first,a);findPath(root,second,b);Node*answer=nullptr;for(int i=0;i<(int)min(a.size(),b.size())&&a[i]==b[i];++i)answer=a[i];return answer;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;cout<<lca(&root,2,3)->value;return 0;}
`);

add("maximum-width-of-a-binary-tree", "Brute Force (Unnormalized Complete Indices)", "Carry complete-tree indices across each level and compute last minus first plus one.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
unsigned long long width(Node*root){if(!root)return 0;queue<pair<Node*,unsigned long long>>pending;pending.push({root,1});unsigned long long best=0;while(!pending.empty()){int count=pending.size();unsigned long long first=pending.front().second,last=first;while(count--){auto [node,index]=pending.front();pending.pop();last=index;if(node->left)pending.push({node->left,index*2});if(node->right)pending.push({node->right,index*2+1});}best=max(best,last-first+1);}return best;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;cout<<width(&root);return 0;}
`);

add("print-all-the-nodes-at-a-distance-of-k-in-a-binary-tree", "Better (Parent Graph BFS)", "Record parent links, then BFS outward from the target through left, right, and parent edges for exactly K layers.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
vector<int> distanceK(Node*root,Node*target,int k){unordered_map<Node*,Node*>parent;queue<Node*>build;build.push(root);parent[root]=nullptr;while(!build.empty()){Node*node=build.front();build.pop();for(Node*next:{node->left,node->right})if(next){parent[next]=node;build.push(next);}}queue<Node*>pending;unordered_set<Node*>seen;pending.push(target);seen.insert(target);while(k--){int count=pending.size();while(count--){Node*node=pending.front();pending.pop();for(Node*next:{node->left,node->right,parent[node]})if(next&&!seen.count(next)){seen.insert(next);pending.push(next);}}}vector<int>answer;while(!pending.empty()){answer.push_back(pending.front()->value);pending.pop();}return answer;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;for(int value:distanceK(&root,&root,1))cout<<value<<" ";return 0;}
`);

add("minimum-time-taken-to-burn-the-binary-tree", "Better (Parent Graph Multi-Direction BFS)", "Record parent links and spread fire one layer per minute through parent and child edges.", "O(N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
int burnTime(Node*root,int start){unordered_map<Node*,Node*>parent;queue<Node*>build;build.push(root);parent[root]=nullptr;Node*source=nullptr;while(!build.empty()){Node*node=build.front();build.pop();if(node->value==start)source=node;for(Node*next:{node->left,node->right})if(next){parent[next]=node;build.push(next);}}queue<Node*>fire;unordered_set<Node*>burned;fire.push(source);burned.insert(source);int minutes=-1;while(!fire.empty()){++minutes;int count=fire.size();while(count--){Node*node=fire.front();fire.pop();for(Node*next:{node->left,node->right,parent[node]})if(next&&!burned.count(next)){burned.insert(next);fire.push(next);}}}return minutes;}
int main(){Node root(1),a(2),b(3);root.left=&a;root.right=&b;cout<<burnTime(&root,2);return 0;}
`);

fs.writeFileSync(filename, `${JSON.stringify(catalog, null, 2)}\n`);
console.log("Expanded the C++ catalog with alternate strategy pack 2.");
