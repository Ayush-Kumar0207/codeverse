const fs = require("fs");
const path = require("path");
const filename = path.resolve(__dirname, "../data/algos/curated_cpp_variants.json");
const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));
function add(id, name, description, timeComplexity, spaceComplexity, code) {
  const approaches = catalog[id] || (catalog[id] = []);
  if (!approaches.some((approach) => approach.name === name)) approaches.push({ name, description, timeComplexity, spaceComplexity, code: code.trim() });
}

add("bellman-ford-algorithm", "Better (Edge-Count Dynamic Programming)", "Use a fresh distance layer on each pass so layer K represents shortest paths using at most K edges.", "O(V * E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Edge{int from;int to;int weight;};
vector<long long> bellmanFord(int vertices,const vector<Edge>&edges,int source){const long long INF=LLONG_MAX/4;vector<long long>distance(vertices,INF);distance[source]=0;for(int used=1;used<vertices;++used){vector<long long>next=distance;for(auto edge:edges)if(distance[edge.from]!=INF)next[edge.to]=min(next[edge.to],distance[edge.from]+edge.weight);if(next==distance)break;distance.swap(next);}return distance;}
int main(){for(long long value:bellmanFord(3,{{0,1,4},{0,2,5},{1,2,-2}},0))cout<<value<<" ";return 0;}
`);

add("floyd-warshall-algorithm", "Brute Force (Bellman-Ford From Every Source)", "Run a single-source negative-edge-capable relaxation from every vertex to obtain all-pairs distances.", "O(V^2 * E)", "O(V^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Edge{int from;int to;int weight;};
vector<vector<long long>> allPairs(int vertices,const vector<Edge>&edges){const long long INF=LLONG_MAX/4;vector<vector<long long>>answer(vertices,vector<long long>(vertices,INF));for(int source=0;source<vertices;++source){answer[source][source]=0;for(int pass=1;pass<vertices;++pass){bool changed=false;for(auto edge:edges)if(answer[source][edge.from]!=INF&&answer[source][edge.from]+edge.weight<answer[source][edge.to]){answer[source][edge.to]=answer[source][edge.from]+edge.weight;changed=true;}if(!changed)break;}}return answer;}
int main(){auto distance=allPairs(3,{{0,1,2},{1,2,3},{0,2,10}});cout<<distance[0][2];return 0;}
`);

add("kruskal-s-algorithm", "Brute Force (Enumerate Spanning Edge Sets)", "Enumerate every V-1 edge subset, reject cyclic or disconnected subsets, and retain the minimum total weight.", "O(2^E * (V + E))", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Edge{int from;int to;int weight;};
struct DSU{vector<int>parent;explicit DSU(int n):parent(n){iota(parent.begin(),parent.end(),0);}int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}bool unite(int a,int b){a=find(a);b=find(b);if(a==b)return false;parent[b]=a;return true;}};
int mst(int vertices,const vector<Edge>&edges){int best=INT_MAX;for(int mask=0;mask<(1<<(int)edges.size());++mask)if(__builtin_popcount((unsigned)mask)==vertices-1){DSU dsu(vertices);int cost=0;bool tree=true;for(int i=0;i<(int)edges.size();++i)if(mask&(1<<i)){tree=tree&&dsu.unite(edges[i].from,edges[i].to);cost+=edges[i].weight;}int root=dsu.find(0);for(int node=1;node<vertices;++node)tree=tree&&dsu.find(node)==root;if(tree)best=min(best,cost);}return best;}
int main(){cout<<mst(3,{{0,1,1},{1,2,2},{0,2,4}});return 0;}
`);

add("kosaraju-s-algorithm-strongly-connected-components", "Optimal 2 (Tarjan Low-Link DFS)", "Track discovery times, low links, and an active stack to emit each strongly connected component in one DFS pass.", "O(V + E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void visit(int node,const vector<vector<int>>&graph,vector<int>&time,vector<int>&low,vector<bool>&active,stack<int>&pending,int&clock,vector<vector<int>>&components){time[node]=low[node]=clock++;pending.push(node);active[node]=true;for(int next:graph[node])if(time[next]<0){visit(next,graph,time,low,active,pending,clock,components);low[node]=min(low[node],low[next]);}else if(active[next])low[node]=min(low[node],time[next]);if(low[node]==time[node]){components.push_back({});while(true){int current=pending.top();pending.pop();active[current]=false;components.back().push_back(current);if(current==node)break;}}}
vector<vector<int>> tarjan(const vector<vector<int>>&graph){int clock=0;vector<int>time(graph.size(),-1),low(graph.size());vector<bool>active(graph.size());stack<int>pending;vector<vector<int>>components;for(int node=0;node<(int)graph.size();++node)if(time[node]<0)visit(node,graph,time,low,active,pending,clock,components);return components;}
int main(){cout<<tarjan({{1},{2},{0,3},{}}).size();return 0;}
`);

add("factorial-of-n-numbers", "Better (Iterative Product)", "Multiply the integers from two through N without recursive call-stack overhead.", "O(N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
unsigned long long factorial(unsigned n){unsigned long long answer=1;for(unsigned value=2;value<=n;++value)answer*=value;return answer;}
int main(){cout<<factorial(10);return 0;}
`);

add("generate-all-binary-strings", "Better (Bitmask Generation)", "Format every integer from zero through 2^N minus one as an N-bit binary string.", "O(N * 2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<string> binaries(int length){vector<string>answer;for(int mask=0;mask<(1<<length);++mask){string current(length,'0');for(int bit=0;bit<length;++bit)if(mask&(1<<bit))current[length-1-bit]='1';answer.push_back(current);}return answer;}
int main(){for(auto&text:binaries(3))cout<<text<<" ";return 0;}
`);

add("subset-sum-i", "Better (Bitmask Enumeration)", "Enumerate each subset mask, accumulate its selected values, and collect every resulting sum.", "O(N * 2^N)", "O(2^N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> subsetSums(const vector<int>&values){vector<int>answer;for(int mask=0;mask<(1<<(int)values.size());++mask){int sum=0;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit))sum+=values[bit];answer.push_back(sum);}sort(answer.begin(),answer.end());return answer;}
int main(){for(int sum:subsetSums({1,2,3}))cout<<sum<<" ";return 0;}
`);

add("palindrome-partitioning", "Brute Force (Enumerate Cut Masks)", "Treat each gap as a cut-or-join bit and retain segmentations in which every produced piece is a palindrome.", "O(2^N * N)", "O(N * 2^N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool palindrome(const string&text,int left,int right){while(left<right)if(text[left++]!=text[right--])return false;return true;}
vector<vector<string>> partitions(const string&text){vector<vector<string>>answer;int gaps=max(0,(int)text.size()-1);for(int mask=0;mask<(1<<gaps);++mask){vector<string>parts;int start=0;bool valid=true;for(int gap=0;gap<gaps;++gap)if(mask&(1<<gap)){valid=valid&&palindrome(text,start,gap);parts.push_back(text.substr(start,gap-start+1));start=gap+1;}valid=valid&&palindrome(text,start,text.size()-1);parts.push_back(text.substr(start));if(valid)answer.push_back(parts);}return answer;}
int main(){cout<<partitions("aab").size();return 0;}
`);

add("quick-sort", "Optimal 2 (Hoare Partition)", "Partition with inward-moving pointers around a middle pivot, then recurse on the two resulting ranges.", "O(N log N) average", "O(log N) average", String.raw`
#include <bits/stdc++.h>
using namespace std;
void quickSort(vector<int>&values,int left,int right){if(left>=right)return;int i=left-1,j=right+1,pivot=values[left+(right-left)/2];while(true){do{++i;}while(values[i]<pivot);do{--j;}while(values[j]>pivot);if(i>=j)break;swap(values[i],values[j]);}quickSort(values,left,j);quickSort(values,j+1,right);}
int main(){vector<int>values={5,1,4,2,8};quickSort(values,0,values.size()-1);for(int value:values)cout<<value<<" ";return 0;}
`);

add("insertion-sort", "Better (Binary Insertion)", "Binary-search the insertion position in the sorted prefix, then shift the intervening block once.", "O(N^2)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void insertionSort(vector<int>&values){for(int index=1;index<(int)values.size();++index){int value=values[index];auto position=upper_bound(values.begin(),values.begin()+index,value);move_backward(position,values.begin()+index,values.begin()+index+1);*position=value;}}
int main(){vector<int>values={5,2,4,1};insertionSort(values);for(int value:values)cout<<value<<" ";return 0;}
`);

add("lfu-cache", "Brute Force (Scan on Eviction)", "Store value, frequency, and timestamp per key, scanning all keys for the least-frequent least-recent victim only when full.", "O(N) put, O(1) get", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
class LFUCache{struct Entry{int value;int frequency;int time;};int capacity,clock=0;unordered_map<int,Entry>data;public:explicit LFUCache(int size):capacity(size){}int get(int key){if(!data.count(key))return -1;Entry&entry=data[key];++entry.frequency;entry.time=++clock;return entry.value;}void put(int key,int value){if(!capacity)return;if(data.count(key)){data[key].value=value;get(key);return;}if((int)data.size()==capacity){auto victim=min_element(data.begin(),data.end(),[](auto&a,auto&b){return tie(a.second.frequency,a.second.time)<tie(b.second.frequency,b.second.time);});data.erase(victim);}data[key]={value,1,++clock};}};
int main(){LFUCache cache(2);cache.put(1,10);cache.put(2,20);cache.get(1);cache.put(3,30);cout<<cache.get(2);return 0;}
`);

add("minimize-max-distance-to-gas-station", "Better (Greedy Max-Heap Splitting)", "Repeatedly add a station to the interval whose current largest subsegment is greatest.", "O((N + K) log N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
double minimizeDistance(const vector<int>&stations,int extra){int intervals=stations.size()-1;vector<int>parts(intervals,1);priority_queue<pair<double,int>>pending;for(int i=0;i<intervals;++i)pending.push({double(stations[i+1]-stations[i]),i});while(extra--){int index=pending.top().second;pending.pop();++parts[index];pending.push({double(stations[index+1]-stations[index])/parts[index],index});}return pending.top().first;}
int main(){cout<<fixed<<setprecision(2)<<minimizeDistance({1,2,3,4,5},4);return 0;}
`);

add("construct-binary-tree-from-inorder-and-postorder", "Brute Force (Linear Root Lookup)", "Use the postorder tail as root and linearly find it in each inorder slice before recursing.", "O(N^2)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
Node* build(const vector<int>&inorder,int inLeft,int inRight,const vector<int>&postorder,int postLeft,int postRight){if(inLeft>inRight)return nullptr;int rootValue=postorder[postRight],middle=find(inorder.begin()+inLeft,inorder.begin()+inRight+1,rootValue)-inorder.begin(),leftSize=middle-inLeft;Node*root=new Node(rootValue);root->left=build(inorder,inLeft,middle-1,postorder,postLeft,postLeft+leftSize-1);root->right=build(inorder,middle+1,inRight,postorder,postLeft+leftSize,postRight-1);return root;}
int main(){vector<int>inorder={9,3,15,20,7},postorder={9,15,7,20,3};cout<<build(inorder,0,4,postorder,0,4)->value;return 0;}
`);

add("search-in-a-bst", "Better (Recursive Search)", "Recurse into only the subtree whose value range can contain the target.", "O(H)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
Node* search(Node*root,int target){if(!root||root->value==target)return root;return target<root->value?search(root->left,target):search(root->right,target);}
int main(){Node root(2),a(1),b(3);root.left=&a;root.right=&b;cout<<search(&root,3)->value;return 0;}
`);

add("find-min-max-in-bst", "Better (Recursive Extremes)", "Follow only left children for the minimum and only right children for the maximum using recursion.", "O(H)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
int minimum(Node*node){return node->left?minimum(node->left):node->value;}int maximum(Node*node){return node->right?maximum(node->right):node->value;}
int main(){Node root(2),a(1),b(3);root.left=&a;root.right=&b;cout<<minimum(&root)<<" "<<maximum(&root);return 0;}
`);

add("insert-a-given-node-in-bst", "Better (Iterative Descent)", "Walk to the first missing child in the target direction and attach the new node there.", "O(H)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
Node* insert(Node*root,int value){if(!root)return new Node(value);Node*node=root;while(true){Node*&next=value<node->value?node->left:node->right;if(!next){next=new Node(value);break;}node=next;}return root;}
int main(){Node root(2);insert(&root,3);cout<<root.right->value;return 0;}
`);

add("delete-a-node-in-bst", "Brute Force (Rebuild Remaining Values)", "Collect all values except the target, then insert them into a new BST.", "O(N * H)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
void collect(Node*node,int key,vector<int>&values){if(!node)return;collect(node->left,key,values);if(node->value!=key)values.push_back(node->value);collect(node->right,key,values);}Node* insert(Node*root,int value){if(!root)return new Node(value);if(value<root->value)root->left=insert(root->left,value);else root->right=insert(root->right,value);return root;}Node* erase(Node*root,int key){vector<int>values;collect(root,key,values);Node*answer=nullptr;for(int value:values)answer=insert(answer,value);return answer;}
int main(){Node root(2),a(1),b(3);root.left=&a;root.right=&b;cout<<erase(&root,2)->value;return 0;}
`);

add("check-if-a-tree-is-a-bst-or-not", "Better (Inorder Monotonicity)", "Traverse inorder and require every value to be strictly greater than the previously visited value.", "O(N)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
bool validate(Node*node,long long&previous){if(!node)return true;if(!validate(node->left,previous)||node->value<=previous)return false;previous=node->value;return validate(node->right,previous);}
int main(){Node root(2),a(1),b(3);root.left=&a;root.right=&b;long long previous=LLONG_MIN;cout<<boolalpha<<validate(&root,previous);return 0;}
`);

add("lca-in-bst", "Better (Two Search Paths)", "Build the root-to-key path for each value and return their last common node.", "O(H)", "O(H)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Node{int value;Node*left;Node*right;explicit Node(int x):value(x),left(nullptr),right(nullptr){}};
vector<Node*> path(Node*root,int target){vector<Node*>answer;while(root){answer.push_back(root);if(root->value==target)break;root=target<root->value?root->left:root->right;}return answer;}Node* lca(Node*root,int first,int second){auto a=path(root,first),b=path(root,second);Node*answer=nullptr;for(int i=0;i<(int)min(a.size(),b.size())&&a[i]==b[i];++i)answer=a[i];return answer;}
int main(){Node root(6),a(2),b(8);root.left=&a;root.right=&b;cout<<lca(&root,2,8)->value;return 0;}
`);

add("connected-components", "Better (Disjoint Set Union)", "Union every graph edge, then count distinct component representatives.", "O((V + E) * alpha(V))", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct DSU{vector<int>parent,size;explicit DSU(int n):parent(n),size(n,1){iota(parent.begin(),parent.end(),0);}int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}void unite(int a,int b){a=find(a);b=find(b);if(a==b)return;if(size[a]<size[b])swap(a,b);parent[b]=a;size[a]+=size[b];}};
int components(int vertices,const vector<pair<int,int>>&edges){DSU dsu(vertices);for(auto [a,b]:edges)dsu.unite(a,b);set<int>roots;for(int node=0;node<vertices;++node)roots.insert(dsu.find(node));return roots.size();}
int main(){cout<<components(5,{{0,1},{1,2},{3,4}});return 0;}
`);

add("dfs", "Better (Iterative Explicit Stack)", "Replace recursion with a stack, marking nodes when pushed to prevent duplicate work.", "O(V + E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> dfs(const vector<vector<int>>&graph,int start){vector<int>order;vector<bool>seen(graph.size());stack<int>pending;pending.push(start);seen[start]=true;while(!pending.empty()){int node=pending.top();pending.pop();order.push_back(node);for(auto it=graph[node].rbegin();it!=graph[node].rend();++it)if(!seen[*it]){seen[*it]=true;pending.push(*it);}}return order;}
int main(){for(int node:dfs({{1,2},{3},{},{}},0))cout<<node<<" ";return 0;}
`);

add("number-of-provinces", "Better (Disjoint Set Union)", "Union every connected city pair from the adjacency matrix and count unique roots.", "O(N^2 * alpha(N))", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct DSU{vector<int>parent;explicit DSU(int n):parent(n){iota(parent.begin(),parent.end(),0);}int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}void unite(int a,int b){a=find(a);b=find(b);if(a!=b)parent[b]=a;}};
int provinces(const vector<vector<int>>&connected){int n=connected.size();DSU dsu(n);for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)if(connected[i][j])dsu.unite(i,j);set<int>roots;for(int city=0;city<n;++city)roots.insert(dsu.find(city));return roots.size();}
int main(){cout<<provinces({{1,1,0},{1,1,0},{0,0,1}});return 0;}
`);

add("rotting-oranges", "Brute Force (Repeated Grid Sweeps)", "At every minute, scan the grid and rot fresh cells adjacent to cells that were rotten at the start of that minute.", "O(R * C * Minutes)", "O(R * C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int minutesToRot(vector<vector<int>>grid){int rows=grid.size(),columns=grid[0].size(),minutes=0,moves[5]={-1,0,1,0,-1};while(true){vector<vector<int>>next=grid;bool changed=false;for(int r=0;r<rows;++r)for(int c=0;c<columns;++c)if(grid[r][c]==2)for(int d=0;d<4;++d){int nr=r+moves[d],nc=c+moves[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&grid[nr][nc]==1){next[nr][nc]=2;changed=true;}}if(!changed)break;grid.swap(next);++minutes;}for(auto&row:grid)for(int value:row)if(value==1)return -1;return minutes;}
int main(){cout<<minutesToRot({{2,1,1},{1,1,0},{0,1,1}});return 0;}
`);

add("01-matrix", "Brute Force (BFS per Target Cell)", "Run a fresh BFS from each cell until a cell containing one is reached.", "O((R*C)^2)", "O(R*C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> nearestOne(const vector<vector<int>>&grid){int rows=grid.size(),columns=grid[0].size(),moves[5]={-1,0,1,0,-1};vector<vector<int>>answer(rows,vector<int>(columns));for(int sr=0;sr<rows;++sr)for(int sc=0;sc<columns;++sc)if(!grid[sr][sc]){queue<pair<int,int>>pending;vector<vector<int>>distance(rows,vector<int>(columns,-1));pending.push({sr,sc});distance[sr][sc]=0;while(!pending.empty()){auto [r,c]=pending.front();pending.pop();if(grid[r][c]){answer[sr][sc]=distance[r][c];break;}for(int d=0;d<4;++d){int nr=r+moves[d],nc=c+moves[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&distance[nr][nc]<0){distance[nr][nc]=distance[r][c]+1;pending.push({nr,nc});}}}}return answer;}
int main(){auto answer=nearestOne({{0,0,1},{0,0,0}});cout<<answer[1][0];return 0;}
`);

add("kahn-s-algorithm", "Better (DFS Topological Order)", "Use postorder DFS and reverse the finishing sequence to obtain a topological order.", "O(V + E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
void visit(int node,const vector<vector<int>>&graph,vector<bool>&seen,vector<int>&order){seen[node]=true;for(int next:graph[node])if(!seen[next])visit(next,graph,seen,order);order.push_back(node);}vector<int> topological(const vector<vector<int>>&graph){vector<bool>seen(graph.size());vector<int>order;for(int node=0;node<(int)graph.size();++node)if(!seen[node])visit(node,graph,seen,order);reverse(order.begin(),order.end());return order;}
int main(){for(int node:topological({{1,2},{3},{3},{}}))cout<<node<<" ";return 0;}
`);

add("course-schedule-i", "Better (DFS Three-Color Cycle Detection)", "Mark nodes unseen, active, or complete; an edge to an active node proves a prerequisite cycle.", "O(V + E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool visit(int node,const vector<vector<int>>&graph,vector<int>&color){color[node]=1;for(int next:graph[node]){if(color[next]==1)return false;if(color[next]==0&&!visit(next,graph,color))return false;}color[node]=2;return true;}bool canFinish(int courses,const vector<pair<int,int>>&prerequisites){vector<vector<int>>graph(courses);for(auto [course,requirement]:prerequisites)graph[requirement].push_back(course);vector<int>color(courses);for(int node=0;node<courses;++node)if(color[node]==0&&!visit(node,graph,color))return false;return true;}
int main(){cout<<boolalpha<<canFinish(2,{{1,0}});return 0;}
`);

add("course-schedule-ii", "Better (DFS Finishing Order)", "Detect cycles with three colors while appending completed courses, then reverse the result.", "O(V + E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool visit(int node,const vector<vector<int>>&graph,vector<int>&color,vector<int>&order){color[node]=1;for(int next:graph[node]){if(color[next]==1)return false;if(color[next]==0&&!visit(next,graph,color,order))return false;}color[node]=2;order.push_back(node);return true;}vector<int> schedule(int courses,const vector<pair<int,int>>&prerequisites){vector<vector<int>>graph(courses);for(auto [course,requirement]:prerequisites)graph[requirement].push_back(course);vector<int>color(courses),order;for(int node=0;node<courses;++node)if(color[node]==0&&!visit(node,graph,color,order))return {};reverse(order.begin(),order.end());return order;}
int main(){for(int course:schedule(2,{{1,0}}))cout<<course<<" ";return 0;}
`);

add("alien-dictionary", "Better (DFS Character Topology)", "Build precedence edges from adjacent words and topologically order the character graph with cycle-aware DFS.", "O(Total characters + K^2)", "O(K^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool visit(int node,const vector<vector<int>>&graph,vector<int>&color,string&order){color[node]=1;for(int next:graph[node]){if(color[next]==1)return false;if(color[next]==0&&!visit(next,graph,color,order))return false;}color[node]=2;order+=char('a'+node);return true;}string alien(const vector<string>&words,int alphabet){vector<vector<int>>graph(alphabet);for(int i=0;i+1<(int)words.size();++i){int length=min(words[i].size(),words[i+1].size()),j=0;while(j<length&&words[i][j]==words[i+1][j])++j;if(j<length)graph[words[i][j]-'a'].push_back(words[i+1][j]-'a');else if(words[i].size()>words[i+1].size())return "";}vector<int>color(alphabet);string order;for(int ch=0;ch<alphabet;++ch)if(color[ch]==0&&!visit(ch,graph,color,order))return "";reverse(order.begin(),order.end());return order;}
int main(){cout<<alien({"baa","abcd","abca","cab","cad"},4);return 0;}
`);

add("shortest-path-in-directed-acyclic-graph", "Brute Force (Repeated Edge Relaxation)", "Use Bellman-Ford style passes without relying on the DAG topological order.", "O(V * E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Edge{int from;int to;int weight;};
vector<long long> shortest(int vertices,const vector<Edge>&edges,int source){const long long INF=LLONG_MAX/4;vector<long long>distance(vertices,INF);distance[source]=0;for(int pass=1;pass<vertices;++pass)for(auto edge:edges)if(distance[edge.from]!=INF)distance[edge.to]=min(distance[edge.to],distance[edge.from]+edge.weight);return distance;}
int main(){for(long long value:shortest(4,{{0,1,2},{0,2,4},{1,3,3},{2,3,1}},0))cout<<value<<" ";return 0;}
`);

add("shortest-path-in-undirected-graph-with-unit-weights", "Better (Dijkstra Priority Queue)", "Apply general nonnegative shortest-path relaxation even though every edge has unit weight.", "O((V + E) log V)", "O(V + E)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> shortest(const vector<vector<int>>&graph,int source){vector<int>distance(graph.size(),INT_MAX);priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int,int>>>pending;distance[source]=0;pending.push({0,source});while(!pending.empty()){auto [cost,node]=pending.top();pending.pop();if(cost!=distance[node])continue;for(int next:graph[node])if(cost+1<distance[next]){distance[next]=cost+1;pending.push({distance[next],next});}}return distance;}
int main(){for(int value:shortest({{1,2},{0,3},{0,3},{1,2}},0))cout<<value<<" ";return 0;}
`);

add("path-with-minimum-effort", "Better (Binary Search plus Reachability)", "Binary-search the allowed edge effort and test grid reachability using only edges within that threshold.", "O(R * C * log W)", "O(R * C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool reachable(const vector<vector<int>>&height,int limit){int rows=height.size(),columns=height[0].size(),moves[5]={-1,0,1,0,-1};queue<pair<int,int>>pending;vector<vector<bool>>seen(rows,vector<bool>(columns));pending.push({0,0});seen[0][0]=true;while(!pending.empty()){auto [r,c]=pending.front();pending.pop();if(r+1==rows&&c+1==columns)return true;for(int d=0;d<4;++d){int nr=r+moves[d],nc=c+moves[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&!seen[nr][nc]&&abs(height[r][c]-height[nr][nc])<=limit){seen[nr][nc]=true;pending.push({nr,nc});}}}return false;}int minimumEffort(const vector<vector<int>>&height){int low=0,high=1000000;while(low<high){int middle=low+(high-low)/2;if(reachable(height,middle))high=middle;else low=middle+1;}return low;}
int main(){cout<<minimumEffort({{1,2,2},{3,8,2},{5,3,5}});return 0;}
`);

add("cheapest-flights-within-k-stops", "Better (Layered Bellman-Ford)", "Perform K+1 copied relaxation layers so each layer adds at most one flight edge.", "O(K * E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Flight{int from;int to;int price;};
int cheapest(int cities,const vector<Flight>&flights,int source,int target,int stops){const int INF=1e9;vector<int>cost(cities,INF);cost[source]=0;for(int edgeCount=0;edgeCount<=stops;++edgeCount){vector<int>next=cost;for(auto flight:flights)if(cost[flight.from]!=INF)next[flight.to]=min(next[flight.to],cost[flight.from]+flight.price);cost.swap(next);}return cost[target]==INF?-1:cost[target];}
int main(){cout<<cheapest(3,{{0,1,100},{1,2,100},{0,2,500}},0,2,1);return 0;}
`);

add("network-delay-time", "Better (Bellman-Ford Relaxation)", "Relax every directed signal edge up to N-1 times, then take the largest finite arrival time.", "O(V * E)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
struct Edge{int from;int to;int time;};
int delay(int vertices,const vector<Edge>&edges,int source){const int INF=1e9;vector<int>distance(vertices+1,INF);distance[source]=0;for(int pass=1;pass<vertices;++pass)for(auto edge:edges)if(distance[edge.from]!=INF)distance[edge.to]=min(distance[edge.to],distance[edge.from]+edge.time);int answer=*max_element(distance.begin()+1,distance.end());return answer==INF?-1:answer;}
int main(){cout<<delay(4,{{2,1,1},{2,3,1},{3,4,1}},2);return 0;}
`);

add("prim-s-algorithm", "Better (Array-Key Selection)", "Select the unused vertex with minimum key by linear scan and relax its incident edges.", "O(V^2)", "O(V)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int mst(const vector<vector<int>>&weight){int n=weight.size(),answer=0;vector<int>key(n,INT_MAX);vector<bool>used(n);key[0]=0;for(int step=0;step<n;++step){int node=-1;for(int i=0;i<n;++i)if(!used[i]&&(node<0||key[i]<key[node]))node=i;used[node]=true;answer+=key[node];for(int next=0;next<n;++next)if(weight[node][next]>=0&&!used[next])key[next]=min(key[next],weight[node][next]);}return answer;}
int main(){cout<<mst({{0,1,4},{1,0,2},{4,2,0}});return 0;}
`);

add("number-of-operations-to-make-network-connected", "Better (DFS Components)", "After confirming enough cables exist, count connected components with DFS; components minus one cables must be moved.", "O(V + E)", "O(V + E)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int operations(int computers,const vector<pair<int,int>>&cables){if((int)cables.size()<computers-1)return -1;vector<vector<int>>graph(computers);for(auto [a,b]:cables){graph[a].push_back(b);graph[b].push_back(a);}vector<bool>seen(computers);int components=0;for(int start=0;start<computers;++start)if(!seen[start]){++components;stack<int>pending;pending.push(start);seen[start]=true;while(!pending.empty()){int node=pending.top();pending.pop();for(int next:graph[node])if(!seen[next]){seen[next]=true;pending.push(next);}}}return components-1;}
int main(){cout<<operations(4,{{0,1},{0,2},{1,2}});return 0;}
`);

add("most-stones-removed-with-same-row-or-column", "Better (Explicit Stone Graph DFS)", "Connect stones sharing a row or column and remove every stone except one representative per connected component.", "O(N^2)", "O(N^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int removed(const vector<pair<int,int>>&stones){int n=stones.size();vector<vector<int>>graph(n);for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)if(stones[i].first==stones[j].first||stones[i].second==stones[j].second){graph[i].push_back(j);graph[j].push_back(i);}vector<bool>seen(n);int components=0;for(int start=0;start<n;++start)if(!seen[start]){++components;stack<int>pending;pending.push(start);seen[start]=true;while(!pending.empty()){int node=pending.top();pending.pop();for(int next:graph[node])if(!seen[next]){seen[next]=true;pending.push(next);}}}return n-components;}
int main(){cout<<removed({{0,0},{0,1},{1,0},{1,2},{2,1},{2,2}});return 0;}
`);

add("accounts-merge", "Better (Email Graph DFS)", "Connect consecutive emails belonging to the same account, then DFS each email component and sort its members.", "O(E log E)", "O(E)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<vector<string>> mergeAccounts(const vector<vector<string>>&accounts){unordered_map<string,vector<string>>graph;unordered_map<string,string>owner;for(auto&account:accounts){for(int i=1;i<(int)account.size();++i)owner[account[i]]=account[0];for(int i=2;i<(int)account.size();++i){graph[account[1]].push_back(account[i]);graph[account[i]].push_back(account[1]);}}unordered_set<string>seen;vector<vector<string>>answer;for(auto&item:owner)if(!seen.count(item.first)){vector<string>emails;stack<string>pending;pending.push(item.first);seen.insert(item.first);while(!pending.empty()){string email=pending.top();pending.pop();emails.push_back(email);for(auto&next:graph[email])if(!seen.count(next)){seen.insert(next);pending.push(next);}}sort(emails.begin(),emails.end());emails.insert(emails.begin(),item.second);answer.push_back(emails);}return answer;}
int main(){cout<<mergeAccounts({{"John","a@mail","b@mail"},{"John","b@mail","c@mail"}})[0].size();return 0;}
`);

add("number-of-islands-ii-online-queries", "Brute Force (Recount After Every Query)", "Apply each land addition and run a complete flood-fill component count on the current grid.", "O(Q * R * C)", "O(R * C)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int countIslands(const vector<vector<int>>&grid){int rows=grid.size(),columns=grid[0].size(),moves[5]={-1,0,1,0,-1},count=0;vector<vector<bool>>seen(rows,vector<bool>(columns));for(int sr=0;sr<rows;++sr)for(int sc=0;sc<columns;++sc)if(grid[sr][sc]&&!seen[sr][sc]){++count;queue<pair<int,int>>pending;pending.push({sr,sc});seen[sr][sc]=true;while(!pending.empty()){auto [r,c]=pending.front();pending.pop();for(int d=0;d<4;++d){int nr=r+moves[d],nc=c+moves[d+1];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&grid[nr][nc]&&!seen[nr][nc]){seen[nr][nc]=true;pending.push({nr,nc});}}}}return count;}vector<int> islands(int rows,int columns,const vector<pair<int,int>>&queries){vector<vector<int>>grid(rows,vector<int>(columns));vector<int>answer;for(auto [r,c]:queries){grid[r][c]=1;answer.push_back(countIslands(grid));}return answer;}
int main(){for(int value:islands(3,3,{{0,0},{0,1},{1,2},{2,1}}))cout<<value<<" ";return 0;}
`);

add("swim-in-rising-water", "Better (Binary Search plus Flood Fill)", "Binary-search the water level and test whether cells no higher than that level connect start to finish.", "O(N^2 log W)", "O(N^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool reachable(const vector<vector<int>>&grid,int water){int n=grid.size(),moves[5]={-1,0,1,0,-1};if(grid[0][0]>water)return false;queue<pair<int,int>>pending;vector<vector<bool>>seen(n,vector<bool>(n));pending.push({0,0});seen[0][0]=true;while(!pending.empty()){auto [r,c]=pending.front();pending.pop();if(r+1==n&&c+1==n)return true;for(int d=0;d<4;++d){int nr=r+moves[d],nc=c+moves[d+1];if(nr>=0&&nr<n&&nc>=0&&nc<n&&!seen[nr][nc]&&grid[nr][nc]<=water){seen[nr][nc]=true;pending.push({nr,nc});}}}return false;}int swim(const vector<vector<int>>&grid){int low=0,high=grid.size()*grid.size()-1;while(low<high){int middle=(low+high)/2;if(reachable(grid,middle))high=middle;else low=middle+1;}return low;}
int main(){cout<<swim({{0,2},{1,3}});return 0;}
`);

add("cherry-pickup-ii-3d-dp", "Brute Force (Two-Robot Recursion)", "Explore all nine pairs of next-column moves for both robots at every row without memoization.", "O(9^R)", "O(R)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int collect(int row,int first,int second,const vector<vector<int>>&grid){int rows=grid.size(),columns=grid[0].size();if(first<0||first>=columns||second<0||second>=columns)return -1000000000;int reward=grid[row][first]+(first==second?0:grid[row][second]);if(row+1==rows)return reward;int best=-1000000000;for(int moveA=-1;moveA<=1;++moveA)for(int moveB=-1;moveB<=1;++moveB)best=max(best,collect(row+1,first+moveA,second+moveB,grid));return reward+best;}
int main(){cout<<collect(0,0,2,{{3,1,1},{2,5,1},{1,5,5},{2,1,1}});return 0;}
`);

add("partition-a-set-into-two-subsets-with-minimum-absolute-sum-difference", "Brute Force (All Subset Masks)", "Enumerate one side of every partition and minimize the absolute difference from the complementary sum.", "O(N * 2^N)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int minimumDifference(const vector<int>&values){int total=accumulate(values.begin(),values.end(),0),best=INT_MAX;for(int mask=0;mask<(1<<(int)values.size());++mask){int sum=0;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit))sum+=values[bit];best=min(best,abs(total-2*sum));}return best;}
int main(){cout<<minimumDifference({1,6,11,5});return 0;}
`);

add("count-partitions-with-given-difference", "Brute Force (Signed Assignment Recursion)", "Assign every value to the left or right subset and count leaves whose sum difference equals D.", "O(2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
long long countWays(const vector<int>&values,int index,int difference,int target){if(index==(int)values.size())return difference==target;return countWays(values,index+1,difference+values[index],target)+countWays(values,index+1,difference-values[index],target);}
int main(){cout<<countWays({1,1,2,3},0,0,1);return 0;}
`);

add("longest-palindromic-subsequence", "Better (LCS with Reversed String)", "The longest sequence common to the string and its reversal is the longest palindromic subsequence.", "O(N^2)", "O(N^2)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int lps(const string&text){string reversed=text;reverse(reversed.begin(),reversed.end());int n=text.size();vector<vector<int>>dp(n+1,vector<int>(n+1));for(int i=1;i<=n;++i)for(int j=1;j<=n;++j)dp[i][j]=text[i-1]==reversed[j-1]?1+dp[i-1][j-1]:max(dp[i-1][j],dp[i][j-1]);return dp[n][n];}
int main(){cout<<lps("bbbab");return 0;}
`);

add("shortest-common-supersequence", "Better (Merge Around an LCS)", "Reconstruct an LCS and append non-LCS characters from both strings around each common anchor.", "O(N * M)", "O(N * M)", String.raw`
#include <bits/stdc++.h>
using namespace std;
string scs(const string&first,const string&second){int n=first.size(),m=second.size();vector<vector<int>>dp(n+1,vector<int>(m+1));for(int i=1;i<=n;++i)for(int j=1;j<=m;++j)dp[i][j]=first[i-1]==second[j-1]?1+dp[i-1][j-1]:max(dp[i-1][j],dp[i][j-1]);int i=n,j=m;string answer;while(i&&j){if(first[i-1]==second[j-1]){answer+=first[i-1];--i;--j;}else if(dp[i-1][j]>dp[i][j-1])answer+=first[--i];else answer+=second[--j];}while(i)answer+=first[--i];while(j)answer+=second[--j];reverse(answer.begin(),answer.end());return answer;}
int main(){cout<<scs("abac","cab");return 0;}
`);

add("print-longest-increasing-subsequence", "Better (Quadratic DP Reconstruction)", "Store the best LIS length ending at each index and a predecessor pointer for reconstruction.", "O(N^2)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> lis(const vector<int>&values){int n=values.size(),best=0;vector<int>length(n,1),parent(n);iota(parent.begin(),parent.end(),0);for(int i=0;i<n;++i){for(int j=0;j<i;++j)if(values[j]<values[i]&&length[j]+1>length[i]){length[i]=length[j]+1;parent[i]=j;}if(length[i]>length[best])best=i;}vector<int>answer;while(parent[best]!=best){answer.push_back(values[best]);best=parent[best];}answer.push_back(values[best]);reverse(answer.begin(),answer.end());return answer;}
int main(){for(int value:lis({10,9,2,5,3,7,101,18}))cout<<value<<" ";return 0;}
`);

add("largest-divisible-subset", "Brute Force (All Subsets)", "Enumerate every subset and retain the largest one whose sorted adjacent values divide each other.", "O(N * 2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> largest(vector<int>values){sort(values.begin(),values.end());vector<int>best;for(int mask=0;mask<(1<<(int)values.size());++mask){vector<int>current;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit))current.push_back(values[bit]);bool valid=true;for(int i=1;i<(int)current.size();++i)valid=valid&&current[i]%current[i-1]==0;if(valid&&current.size()>best.size())best=current;}return best;}
int main(){for(int value:largest({1,2,3,8,4}))cout<<value<<" ";return 0;}
`);

add("longest-string-chain", "Better (Hash Map by Deleted Predecessor)", "Process words by length and derive every predecessor by deleting one character, looking up its best chain in a hash map.", "O(N * L^2)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int longestChain(vector<string>words){sort(words.begin(),words.end(),[](auto&a,auto&b){return a.size()<b.size();});unordered_map<string,int>best;int answer=0;for(auto&word:words){int length=1;for(int removed=0;removed<(int)word.size();++removed)length=max(length,1+best[word.substr(0,removed)+word.substr(removed+1)]);best[word]=length;answer=max(answer,length);}return answer;}
int main(){cout<<longestChain({"a","b","ba","bca","bda","bdca"});return 0;}
`);

add("longest-bitonic-subsequence", "Brute Force (Enumerate Subsequences)", "Enumerate every subsequence and accept it when it strictly rises to one peak and then strictly falls.", "O(N * 2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
bool bitonic(const vector<int>&values){if(values.empty())return true;int index=1;while(index<(int)values.size()&&values[index]>values[index-1])++index;while(index<(int)values.size()&&values[index]<values[index-1])++index;return index==(int)values.size();}int longest(const vector<int>&values){int best=0;for(int mask=1;mask<(1<<(int)values.size());++mask){vector<int>current;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit))current.push_back(values[bit]);if(bitonic(current))best=max(best,(int)current.size());}return best;}
int main(){cout<<longest({1,11,2,10,4,5,2,1});return 0;}
`);

add("number-of-longest-increasing-subsequences", "Brute Force (Enumerate Subsequences)", "Enumerate all subsequences, test strict increase, and count those whose length matches the maximum encountered.", "O(N * 2^N)", "O(N)", String.raw`
#include <bits/stdc++.h>
using namespace std;
int countLIS(const vector<int>&values){int best=0,count=0;for(int mask=1;mask<(1<<(int)values.size());++mask){int length=0,previous=INT_MIN;bool valid=true;for(int bit=0;bit<(int)values.size();++bit)if(mask&(1<<bit)){if(values[bit]<=previous){valid=false;break;}previous=values[bit];++length;}if(valid){if(length>best){best=length;count=1;}else if(length==best)++count;}}return count;}
int main(){cout<<countLIS({1,3,5,4,7});return 0;}
`);

add("longest-word-with-all-prefixes", "Better (Hash-Set Prefix Checks)", "Store all words and test every non-empty prefix of each candidate directly in the set.", "O(N * L^2)", "O(N * L)", String.raw`
#include <bits/stdc++.h>
using namespace std;
string completeString(const vector<string>&words){unordered_set<string>dictionary(words.begin(),words.end());string answer;for(auto&word:words){bool valid=true;for(int length=1;length<=(int)word.size();++length)if(!dictionary.count(word.substr(0,length))){valid=false;break;}if(valid&&(word.size()>answer.size()||(word.size()==answer.size()&&word<answer)))answer=word;}return answer.empty()?"None":answer;}
int main(){cout<<completeString({"n","ni","nin","ninj","ninja"});return 0;}
`);

add("maximum-xor-with-an-element-from-array", "Brute Force (Filter Every Query)", "For each query, scan all array values within its limit and retain the largest XOR.", "O(N * Q)", "O(1)", String.raw`
#include <bits/stdc++.h>
using namespace std;
vector<int> maximize(const vector<int>&values,const vector<pair<int,int>>&queries){vector<int>answer;for(auto [target,limit]:queries){int best=-1;for(int value:values)if(value<=limit)best=max(best,value^target);answer.push_back(best);}return answer;}
int main(){for(int value:maximize({0,1,2,3,4},{{3,1},{1,3},{5,6}}))cout<<value<<" ";return 0;}
`);

fs.writeFileSync(filename, `${JSON.stringify(catalog, null, 2)}\n`);
console.log("Expanded the C++ catalog with alternate strategy pack 3.");
