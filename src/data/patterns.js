export // Phase metadata — controls display order and week labels
const PHASES = [
  { phase: 1, label: "Phase 1 — Foundations", week: "Week 1–2", desc: "No prerequisites. Master these before anything else.", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.15)",
    ids: ["arrays","two-pointers","sliding-window","stack","binary-search"] },
  { phase: 2, label: "Phase 2 — Linear Structures", week: "Week 3–4", desc: "Builds on Phase 1. Pointer-heavy patterns.", color: "#10b981", glow: "rgba(16, 185, 129, 0.15)",
    ids: ["linked-list","trees","trie"] },
  { phase: 3, label: "Phase 3 — Core Problem Solving", week: "Week 5–6", desc: "Requires comfort with recursion and trees.", color: "#f97316", glow: "rgba(249, 115, 22, 0.15)",
    ids: ["heap","backtracking","intervals","greedy"] },
  { phase: 4, label: "Phase 4 — Advanced", week: "Week 7–8", desc: "The hardest patterns. Don't skip phases to get here.", color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.15)",
    ids: ["graphs","dp","math"] },
];

export const PATTERNS = [
  {
    id: "arrays", name: "Arrays & Hashing", color: "#3b82f6",
    when: "Lookups, duplicates, frequency counting, grouping. HashMaps trade space for O(1) lookup.",
    signal: ["contains duplicate", "frequency count", "anagram", "group by key", "two sum unsorted"],
    template: `# HashMap for O(1) lookup
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]
    seen[num] = i`,
    problems: [
      { name: "Contains Duplicate", difficulty: "Easy", lc: "https://leetcode.com/problems/contains-duplicate/" },
      { name: "Valid Anagram", difficulty: "Easy", lc: "https://leetcode.com/problems/valid-anagram/" },
      { name: "Two Sum", difficulty: "Easy", lc: "https://leetcode.com/problems/two-sum/" },
      { name: "Group Anagrams", difficulty: "Medium", lc: "https://leetcode.com/problems/group-anagrams/" },
      { name: "Top K Frequent Elements", difficulty: "Medium", lc: "https://leetcode.com/problems/top-k-frequent-elements/" },
      { name: "Product of Array Except Self", difficulty: "Medium", lc: "https://leetcode.com/problems/product-of-array-except-self/" },
      { name: "Valid Sudoku", difficulty: "Medium", lc: "https://leetcode.com/problems/valid-sudoku/" },
      { name: "Encode and Decode Strings", difficulty: "Medium", lc: "https://leetcode.com/problems/encode-and-decode-strings/" },
      { name: "Longest Consecutive Sequence", difficulty: "Medium", lc: "https://leetcode.com/problems/longest-consecutive-sequence/" },
    ],
    walkthrough: { problem: "Two Sum — find indices of two numbers adding to target", steps: ["Q: Brute force? → O(n²): check every pair with nested loop","Q: What if I store what I've seen? → HashMap: num → index","For each num, I need target - num. Check if it's already in map.","If yes → return [map[complement], i]. If no → store num in map.","One pass, O(n) time, O(n) space ✓"] }
  },
  {
    id: "two-pointers", name: "Two Pointers", color: "#10b981",
    when: "Sorted array or need to find a pair/triplet. Avoids O(n²) nested loops.",
    signal: ["sorted array", "find pair with condition", "palindrome check", "remove duplicates in-place"],
    template: `left, right = 0, len(arr) - 1
while left < right:
    if condition(arr[left], arr[right]):
        # found answer
    elif too_small:
        left += 1
    else:
        right -= 1`,
    problems: [
      { name: "Valid Palindrome", difficulty: "Easy", lc: "https://leetcode.com/problems/valid-palindrome/" },
      { name: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", lc: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
      { name: "3Sum", difficulty: "Medium", lc: "https://leetcode.com/problems/3sum/" },
      { name: "Container With Most Water", difficulty: "Medium", lc: "https://leetcode.com/problems/container-with-most-water/" },
      { name: "Trapping Rain Water", difficulty: "Hard", lc: "https://leetcode.com/problems/trapping-rain-water/" },
    ],
    walkthrough: { problem: "Two Sum II — sorted array, find pair summing to target", steps: ["Q: What structure do I have? → Sorted array","Q: Brute force? → O(n²): check every pair","Q: Can I use sorted property? → YES. Sum too small → move left right. Too big → move right left.","Place left=0, right=n-1. Check arr[left]+arr[right].", "sum < target → left++. sum > target → right--. Match → return.","Time: O(n), Space: O(1) ✓"] }
  },
  {
    id: "sliding-window", name: "Sliding Window", color: "#f43f5e",
    when: "Contiguous subarray or substring. Best/longest/shortest window satisfying a condition.",
    signal: ["contiguous subarray", "substring", "max sum of k elements", "at most k distinct"],
    template: `left = 0
for right in range(n):
    window.add(arr[right])      # expand
    while window_invalid():
        window.remove(arr[left])
        left += 1               # shrink
    ans = max(ans, right - left + 1)`,
    problems: [
      { name: "Best Time to Buy and Sell Stock", difficulty: "Easy", lc: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { name: "Longest Substring Without Repeating Characters", difficulty: "Medium", lc: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { name: "Longest Repeating Character Replacement", difficulty: "Medium", lc: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
      { name: "Permutation in String", difficulty: "Medium", lc: "https://leetcode.com/problems/permutation-in-string/" },
      { name: "Minimum Window Substring", difficulty: "Hard", lc: "https://leetcode.com/problems/minimum-window-substring/" },
      { name: "Sliding Window Maximum", difficulty: "Hard", lc: "https://leetcode.com/problems/sliding-window-maximum/" },
    ],
    walkthrough: { problem: "Longest Substring Without Repeating Characters", steps: ["Q: Optimize? → Longest contiguous substring with no repeats","Use a Set to track chars in window. Expand right, shrink left when duplicate found.","right pointer: add s[right] to set","If s[right] already in set → shrink: remove s[left], left++","At each valid step: ans = max(ans, right - left + 1)","Time: O(n), Space: O(charset) ✓"] }
  },
  {
    id: "stack", name: "Stack", color: "#f59e0b",
    when: "Need last-in-first-out order. Matching brackets, next greater element, monotonic problems.",
    signal: ["valid parentheses", "next greater element", "evaluate expression", "monotonic stack"],
    template: `stack = []
for char in s:
    if is_opening(char):
        stack.append(char)
    else:
        if not stack or not matches(stack[-1], char):
            return False
        stack.pop()
return len(stack) == 0`,
    problems: [
      { name: "Valid Parentheses", difficulty: "Easy", lc: "https://leetcode.com/problems/valid-parentheses/" },
      { name: "Min Stack", difficulty: "Medium", lc: "https://leetcode.com/problems/min-stack/" },
      { name: "Evaluate Reverse Polish Notation", difficulty: "Medium", lc: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
      { name: "Generate Parentheses", difficulty: "Medium", lc: "https://leetcode.com/problems/generate-parentheses/" },
      { name: "Daily Temperatures", difficulty: "Medium", lc: "https://leetcode.com/problems/daily-temperatures/" },
      { name: "Car Fleet", difficulty: "Medium", lc: "https://leetcode.com/problems/car-fleet/" },
      { name: "Largest Rectangle in Histogram", difficulty: "Hard", lc: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
    ],
    walkthrough: { problem: "Daily Temperatures — days until a warmer temperature", steps: ["Q: For each day, find next day where temp is higher.","Q: Brute force? → O(n²): for each day scan forward","Stack stores indices of days waiting for their warmer day.","For each day i: while stack and temp[stack[-1]] < temp[i] → pop idx","result[idx] = i - idx (days waited). Then push i to stack.","Remaining in stack at end → result stays 0. Time: O(n) ✓"] }
  },
  {
    id: "binary-search", name: "Binary Search", color: "#0ea5e9",
    when: "Sorted array or answer lies in a range. Can eliminate half the search space per step.",
    signal: ["sorted array", "find minimum satisfying condition", "rotated array", "search in matrix"],
    template: `left, right = 0, len(arr) - 1
while left <= right:
    mid = left + (right - left) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1
return -1`,
    problems: [
      { name: "Binary Search", difficulty: "Easy", lc: "https://leetcode.com/problems/binary-search/" },
      { name: "Search a 2D Matrix", difficulty: "Medium", lc: "https://leetcode.com/problems/search-a-2d-matrix/" },
      { name: "Koko Eating Bananas", difficulty: "Medium", lc: "https://leetcode.com/problems/koko-eating-bananas/" },
      { name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", lc: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
      { name: "Search in Rotated Sorted Array", difficulty: "Medium", lc: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { name: "Time Based Key-Value Store", difficulty: "Medium", lc: "https://leetcode.com/problems/time-based-key-value-store/" },
      { name: "Median of Two Sorted Arrays", difficulty: "Hard", lc: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    ],
    walkthrough: { problem: "Koko Eating Bananas — minimum eating speed", steps: ["Q: What am I searching for? → Minimum speed k","Q: Range of k? → [1, max(piles)]","Key insight: Binary search ON THE ANSWER, not array index!","If speed k works (hours ≤ h) → try smaller (right = mid)","If doesn't work → try bigger (left = mid + 1)","Time: O(n log m) where m=max pile ✓"] }
  },
  {
    id: "linked-list", name: "Linked List", color: "#a855f7",
    when: "Pointer manipulation. Reversing, merging, cycle detection, finding middle/nth node.",
    signal: ["reverse list", "merge sorted lists", "cycle detection", "nth from end", "reorder"],
    template: `# Fast & Slow (cycle / middle)
slow, fast = head, head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: break  # cycle
# slow is at middle if no cycle`,
    problems: [
      { name: "Reverse Linked List", difficulty: "Easy", lc: "https://leetcode.com/problems/reverse-linked-list/" },
      { name: "Merge Two Sorted Lists", difficulty: "Easy", lc: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { name: "Linked List Cycle", difficulty: "Easy", lc: "https://leetcode.com/problems/linked-list-cycle/" },
      { name: "Reorder List", difficulty: "Medium", lc: "https://leetcode.com/problems/reorder-list/" },
      { name: "Remove Nth Node From End of List", difficulty: "Medium", lc: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
      { name: "Copy List with Random Pointer", difficulty: "Medium", lc: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
      { name: "Add Two Numbers", difficulty: "Medium", lc: "https://leetcode.com/problems/add-two-numbers/" },
      { name: "Find the Duplicate Number", difficulty: "Medium", lc: "https://leetcode.com/problems/find-the-duplicate-number/" },
      { name: "LRU Cache", difficulty: "Medium", lc: "https://leetcode.com/problems/lru-cache/" },
      { name: "Merge k Sorted Lists", difficulty: "Hard", lc: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { name: "Reverse Nodes in k-Group", difficulty: "Hard", lc: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
    ],
    walkthrough: { problem: "Reverse Linked List", steps: ["Q: Need to reverse direction of all pointers.","Three pointers: prev=None, curr=head, next=None","While curr: save next=curr.next, set curr.next=prev","Advance: prev=curr, curr=next","Return prev (new head). Time: O(n), Space: O(1) ✓"] }
  },
  {
    id: "trees", name: "Trees", color: "#10b981",
    when: "Tree traversal, path problems, BST properties. DFS for depth/paths, BFS for level-order.",
    signal: ["binary tree", "BST", "path sum", "level order traversal", "lowest common ancestor"],
    template: `# DFS
def dfs(node):
    if not node: return base_value
    left = dfs(node.left)
    right = dfs(node.right)
    return combine(left, right, node.val)

# BFS level order
from collections import deque
q = deque([root])
while q:
    for _ in range(len(q)):
        node = q.popleft()
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)`,
    problems: [
      { name: "Invert Binary Tree", difficulty: "Easy", lc: "https://leetcode.com/problems/invert-binary-tree/" },
      { name: "Maximum Depth of Binary Tree", difficulty: "Easy", lc: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { name: "Diameter of Binary Tree", difficulty: "Easy", lc: "https://leetcode.com/problems/diameter-of-binary-tree/" },
      { name: "Balanced Binary Tree", difficulty: "Easy", lc: "https://leetcode.com/problems/balanced-binary-tree/" },
      { name: "Same Tree", difficulty: "Easy", lc: "https://leetcode.com/problems/same-tree/" },
      { name: "Subtree of Another Tree", difficulty: "Easy", lc: "https://leetcode.com/problems/subtree-of-another-tree/" },
      { name: "Lowest Common Ancestor of BST", difficulty: "Medium", lc: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
      { name: "Binary Tree Level Order Traversal", difficulty: "Medium", lc: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { name: "Binary Tree Right Side View", difficulty: "Medium", lc: "https://leetcode.com/problems/binary-tree-right-side-view/" },
      { name: "Count Good Nodes in Binary Tree", difficulty: "Medium", lc: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
      { name: "Validate Binary Search Tree", difficulty: "Medium", lc: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { name: "Kth Smallest Element in a BST", difficulty: "Medium", lc: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { name: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", lc: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
      { name: "Binary Tree Maximum Path Sum", difficulty: "Hard", lc: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { name: "Serialize and Deserialize Binary Tree", difficulty: "Hard", lc: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    ],
    walkthrough: { problem: "Diameter of Binary Tree — longest path between any two nodes", steps: ["Q: Does path have to go through root? → NO. Key insight.","Q: At each node, local diameter = left_depth + right_depth","DFS returns depth. Track global max with left+right at each node.","def depth(node): if not node: return 0","left=depth(node.left), right=depth(node.right)","self.ans = max(self.ans, left+right). Return 1+max(left,right)","Time: O(n), Space: O(h) ✓"] }
  },
  {
    id: "heap", name: "Heap / Priority Queue", color: "#f97316",
    when: "Find K largest/smallest/most frequent. Don't need full sort — just top K.",
    signal: ["k largest", "k smallest", "k most frequent", "kth element", "median from stream"],
    template: `import heapq
# K Largest: use MIN-heap of size K
heap = []
for num in nums:
    heapq.heappush(heap, num)
    if len(heap) > k:
        heapq.heappop(heap)  # evict smallest
# heap[0] is the Kth largest`,
    problems: [
      { name: "Kth Largest Element in a Stream", difficulty: "Easy", lc: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
      { name: "Last Stone Weight", difficulty: "Easy", lc: "https://leetcode.com/problems/last-stone-weight/" },
      { name: "K Closest Points to Origin", difficulty: "Medium", lc: "https://leetcode.com/problems/k-closest-points-to-origin/" },
      { name: "Kth Largest Element in an Array", difficulty: "Medium", lc: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { name: "Task Scheduler", difficulty: "Medium", lc: "https://leetcode.com/problems/task-scheduler/" },
      { name: "Design Twitter", difficulty: "Medium", lc: "https://leetcode.com/problems/design-twitter/" },
      { name: "Find Median from Data Stream", difficulty: "Hard", lc: "https://leetcode.com/problems/find-median-from-data-stream/" },
    ],
    walkthrough: { problem: "Kth Largest Element in an Array", steps: ["Q: Brute force? → Sort desc, return index k-1 → O(n log n)","Q: Can I do better? → O(n log k) with min-heap of size k","Maintain min-heap of k largest seen so far","For each num: push to heap. If size > k → pop (removes smallest)","After all nums: heap[0] is the Kth largest","Why min-heap for largest? Min of top-k IS the Kth largest. ✓"] }
  },
  {
    id: "backtracking", name: "Backtracking", color: "#ec4899",
    when: "Explore all combinations/permutations/subsets. Build solution incrementally, undo when stuck.",
    signal: ["all combinations", "all subsets", "all permutations", "generate all valid solutions"],
    template: `def backtrack(start, current):
    if is_complete(current):
        result.append(current[:])  # copy!
        return
    for choice in get_choices(start):
        current.append(choice)          # choose
        backtrack(next_start, current)  # explore
        current.pop()                   # unchoose`,
    problems: [
      { name: "Subsets", difficulty: "Medium", lc: "https://leetcode.com/problems/subsets/" },
      { name: "Combination Sum", difficulty: "Medium", lc: "https://leetcode.com/problems/combination-sum/" },
      { name: "Permutations", difficulty: "Medium", lc: "https://leetcode.com/problems/permutations/" },
      { name: "Subsets II", difficulty: "Medium", lc: "https://leetcode.com/problems/subsets-ii/" },
      { name: "Combination Sum II", difficulty: "Medium", lc: "https://leetcode.com/problems/combination-sum-ii/" },
      { name: "Word Search", difficulty: "Medium", lc: "https://leetcode.com/problems/word-search/" },
      { name: "Palindrome Partitioning", difficulty: "Medium", lc: "https://leetcode.com/problems/palindrome-partitioning/" },
      { name: "Letter Combinations of a Phone Number", difficulty: "Medium", lc: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
      { name: "N-Queens", difficulty: "Hard", lc: "https://leetcode.com/problems/n-queens/" },
    ],
    walkthrough: { problem: "Subsets — all possible subsets of [1,2,3]", steps: ["Q: Choices at each step? → Include OR skip each element","Q: Total subsets? → 2^n (each element: in or out)","Decision tree: at index i, branch include vs skip","backtrack(start=0, current=[]): add nums[i], recurse i+1, pop","Every node in decision tree is a valid subset — add to result","Result: [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]","Time: O(n×2^n), Space: O(n) ✓"] }
  },
  {
    id: "graphs", name: "Graphs", color: "#06b6d4",
    when: "Connected components, shortest paths, grid traversal, cycles, topological ordering.",
    signal: ["connected components", "shortest path", "number of islands", "course schedule", "word ladder"],
    template: `# BFS (shortest path)
from collections import deque
queue = deque([start]); visited = {start}
while queue:
    node = queue.popleft()
    for nb in graph[node]:
        if nb not in visited:
            visited.add(nb); queue.append(nb)

# DFS (exploration / cycle)
def dfs(node, visited):
    visited.add(node)
    for nb in graph[node]:
        if nb not in visited: dfs(nb, visited)`,
    problems: [
      { name: "Number of Islands", difficulty: "Medium", lc: "https://leetcode.com/problems/number-of-islands/" },
      { name: "Clone Graph", difficulty: "Medium", lc: "https://leetcode.com/problems/clone-graph/" },
      { name: "Max Area of Island", difficulty: "Medium", lc: "https://leetcode.com/problems/max-area-of-island/" },
      { name: "Pacific Atlantic Water Flow", difficulty: "Medium", lc: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
      { name: "Surrounded Regions", difficulty: "Medium", lc: "https://leetcode.com/problems/surrounded-regions/" },
      { name: "Rotting Oranges", difficulty: "Medium", lc: "https://leetcode.com/problems/rotting-oranges/" },
      { name: "Walls and Gates", difficulty: "Medium", lc: "https://leetcode.com/problems/walls-and-gates/" },
      { name: "Course Schedule", difficulty: "Medium", lc: "https://leetcode.com/problems/course-schedule/" },
      { name: "Course Schedule II", difficulty: "Medium", lc: "https://leetcode.com/problems/course-schedule-ii/" },
      { name: "Redundant Connection", difficulty: "Medium", lc: "https://leetcode.com/problems/redundant-connection/" },
      { name: "Number of Connected Components", difficulty: "Medium", lc: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
      { name: "Graph Valid Tree", difficulty: "Medium", lc: "https://leetcode.com/problems/graph-valid-tree/" },
      { name: "Word Ladder", difficulty: "Hard", lc: "https://leetcode.com/problems/word-ladder/" },
    ],
    walkthrough: { problem: "Number of Islands — count distinct islands in grid", steps: ["Q: What counts as one island? → Connected '1's (4-directional)","Q: Approach? → DFS/BFS from each unvisited '1', mark all connected cells","For each (i,j): if grid[i][j]=='1' and not visited → new island, count++","DFS: mark visited (set to '0'), recurse to 4 neighbors","Time: O(m×n), Space: O(m×n) ✓"] }
  },
  {
    id: "dp", name: "Dynamic Programming", color: "#a855f7",
    when: "Optimal substructure + overlapping subproblems. Count ways, find min/max, feasibility.",
    signal: ["minimum cost", "maximum profit", "count number of ways", "longest subsequence", "can you achieve"],
    template: `# 1D DP
dp = [0] * (n + 1)
dp[0] = base_case
for i in range(1, n+1):
    dp[i] = recurrence(dp[i-1], dp[i-2])

# 2D DP
dp = [[0]*(m+1) for _ in range(n+1)]
for i in range(1, n+1):
    for j in range(1, m+1):
        dp[i][j] = recurrence(dp[i-1][j], dp[i][j-1])`,
    problems: [
      { name: "Climbing Stairs", difficulty: "Easy", lc: "https://leetcode.com/problems/climbing-stairs/" },
      { name: "Min Cost Climbing Stairs", difficulty: "Easy", lc: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
      { name: "House Robber", difficulty: "Medium", lc: "https://leetcode.com/problems/house-robber/" },
      { name: "House Robber II", difficulty: "Medium", lc: "https://leetcode.com/problems/house-robber-ii/" },
      { name: "Longest Palindromic Substring", difficulty: "Medium", lc: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { name: "Palindromic Substrings", difficulty: "Medium", lc: "https://leetcode.com/problems/palindromic-substrings/" },
      { name: "Decode Ways", difficulty: "Medium", lc: "https://leetcode.com/problems/decode-ways/" },
      { name: "Coin Change", difficulty: "Medium", lc: "https://leetcode.com/problems/coin-change/" },
      { name: "Maximum Product Subarray", difficulty: "Medium", lc: "https://leetcode.com/problems/maximum-product-subarray/" },
      { name: "Word Break", difficulty: "Medium", lc: "https://leetcode.com/problems/word-break/" },
      { name: "Longest Increasing Subsequence", difficulty: "Medium", lc: "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { name: "Partition Equal Subset Sum", difficulty: "Medium", lc: "https://leetcode.com/problems/partition-equal-subset-sum/" },
      { name: "Unique Paths", difficulty: "Medium", lc: "https://leetcode.com/problems/unique-paths/" },
      { name: "Longest Common Subsequence", difficulty: "Medium", lc: "https://leetcode.com/problems/longest-common-subsequence/" },
      { name: "Edit Distance", difficulty: "Medium", lc: "https://leetcode.com/problems/edit-distance/" },
      { name: "Jump Game", difficulty: "Medium", lc: "https://leetcode.com/problems/jump-game/" },
      { name: "Jump Game II", difficulty: "Medium", lc: "https://leetcode.com/problems/jump-game-ii/" },
      { name: "Interleaving String", difficulty: "Medium", lc: "https://leetcode.com/problems/interleaving-string/" },
      { name: "Burst Balloons", difficulty: "Hard", lc: "https://leetcode.com/problems/burst-balloons/" },
      { name: "Regular Expression Matching", difficulty: "Hard", lc: "https://leetcode.com/problems/regular-expression-matching/" },
      { name: "Distinct Subsequences", difficulty: "Hard", lc: "https://leetcode.com/problems/distinct-subsequences/" },
    ],
    walkthrough: { problem: "House Robber — max money, no adjacent houses", steps: ["Q: Greedy? → No. Skipping one house may allow robbing two more.","Recursive: rob(i) = max(nums[i]+rob(i+2), rob(i+1))","Overlapping subproblems → use DP","dp[i] = max(dp[i-1], dp[i-2]+nums[i])","Base: dp[0]=nums[0], dp[1]=max(nums[0], nums[1])","Space optimize: only need last two values → O(1) space ✓"] }
  },
  {
    id: "intervals", name: "Intervals", color: "#14b8a6",
    when: "Overlapping intervals — merging, inserting, finding gaps. Sort by start time first.",
    signal: ["intervals", "overlap", "merge intervals", "meeting rooms", "schedule conflicts"],
    template: `intervals.sort(key=lambda x: x[0])  # sort by start
merged = [intervals[0]]
for start, end in intervals[1:]:
    if start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])`,
    problems: [
      { name: "Insert Interval", difficulty: "Medium", lc: "https://leetcode.com/problems/insert-interval/" },
      { name: "Merge Intervals", difficulty: "Medium", lc: "https://leetcode.com/problems/merge-intervals/" },
      { name: "Non-overlapping Intervals", difficulty: "Medium", lc: "https://leetcode.com/problems/non-overlapping-intervals/" },
      { name: "Meeting Rooms", difficulty: "Easy", lc: "https://leetcode.com/problems/meeting-rooms/" },
      { name: "Meeting Rooms II", difficulty: "Medium", lc: "https://leetcode.com/problems/meeting-rooms-ii/" },
      { name: "Minimum Interval to Include Each Query", difficulty: "Hard", lc: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },
    ],
    walkthrough: { problem: "Merge Intervals", steps: ["Q: Overlap condition? → B.start <= A.end","Q: Process order? → Sort by start time first","Initialize merged=[first]. For each next: if overlap → extend end","Otherwise → no overlap, append new interval","Time: O(n log n), Space: O(n) ✓"] }
  },
  {
    id: "greedy", name: "Greedy", color: "#fbbf24",
    when: "Local optimal leads to global optimum. Usually sort + one pass.",
    signal: ["maximize", "minimum number of", "jump game", "gas station", "partition labels"],
    template: `# Sort + greedy pass
items.sort(key=lambda x: x.priority)
result = 0
for item in items:
    if can_take(item):
        result += item.value
        update_state(item)
return result`,
    problems: [
      { name: "Maximum Subarray", difficulty: "Medium", lc: "https://leetcode.com/problems/maximum-subarray/" },
      { name: "Jump Game", difficulty: "Medium", lc: "https://leetcode.com/problems/jump-game/" },
      { name: "Jump Game II", difficulty: "Medium", lc: "https://leetcode.com/problems/jump-game-ii/" },
      { name: "Gas Station", difficulty: "Medium", lc: "https://leetcode.com/problems/gas-station/" },
      { name: "Hand of Straights", difficulty: "Medium", lc: "https://leetcode.com/problems/hand-of-straights/" },
      { name: "Merge Triplets to Form Target Triplet", difficulty: "Medium", lc: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
      { name: "Partition Labels", difficulty: "Medium", lc: "https://leetcode.com/problems/partition-labels/" },
      { name: "Valid Parenthesis String", difficulty: "Medium", lc: "https://leetcode.com/problems/valid-parenthesis-string/" },
    ],
    walkthrough: { problem: "Jump Game — can you reach the last index?", steps: ["Q: Brute force? → Try every jump at every position → exponential","Q: Greedy insight? → Track max reachable index at each step","maxReach = 0. For each i: if i > maxReach → return False","maxReach = max(maxReach, i + nums[i])","If loop completes → last index reachable → return True","Time: O(n), Space: O(1) ✓"] }
  },
  {
    id: "trie", name: "Trie", color: "#ef4444",
    when: "Prefix matching, autocomplete, dictionary lookup, word search on grid.",
    signal: ["prefix", "autocomplete", "starts with", "word dictionary", "word search grid"],
    template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self): self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True`,
    problems: [
      { name: "Implement Trie (Prefix Tree)", difficulty: "Medium", lc: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
      { name: "Design Add and Search Words", difficulty: "Medium", lc: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
      { name: "Word Search II", difficulty: "Hard", lc: "https://leetcode.com/problems/word-search-ii/" },
    ],
    walkthrough: { problem: "Implement Trie with insert, search, startsWith", steps: ["Trie: tree where each edge = one character","Paths from root = prefixes. Full words marked is_end=True","insert('apple'): root→a→p→p→l→e, mark e as end","search('apple'): walk path, check is_end at last char","startsWith('app'): walk path, return True if path exists","Time per op: O(m) where m = word length ✓"] }
  },
  {
    id: "math", name: "Math & Bit Manipulation", color: "#64748b",
    when: "Bit tricks, number theory, in-place matrix ops, modular arithmetic.",
    signal: ["rotate matrix", "spiral order", "happy number", "power of two", "single number XOR"],
    template: `# Bit tricks
n & (n-1) == 0  # power of 2 check
n ^ n == 0      # XOR self = 0
a ^ b ^ a == b  # find single number

# Rotate matrix 90° clockwise in-place
# Step 1: Transpose (swap [i][j] and [j][i])
# Step 2: Reverse each row`,
    problems: [
      { name: "Single Number", difficulty: "Easy", lc: "https://leetcode.com/problems/single-number/" },
      { name: "Number of 1 Bits", difficulty: "Easy", lc: "https://leetcode.com/problems/number-of-1-bits/" },
      { name: "Counting Bits", difficulty: "Easy", lc: "https://leetcode.com/problems/counting-bits/" },
      { name: "Reverse Bits", difficulty: "Easy", lc: "https://leetcode.com/problems/reverse-bits/" },
      { name: "Missing Number", difficulty: "Easy", lc: "https://leetcode.com/problems/missing-number/" },
      { name: "Happy Number", difficulty: "Easy", lc: "https://leetcode.com/problems/happy-number/" },
      { name: "Plus One", difficulty: "Easy", lc: "https://leetcode.com/problems/plus-one/" },
      { name: "Rotate Image", difficulty: "Medium", lc: "https://leetcode.com/problems/rotate-image/" },
      { name: "Spiral Matrix", difficulty: "Medium", lc: "https://leetcode.com/problems/spiral-matrix/" },
      { name: "Set Matrix Zeroes", difficulty: "Medium", lc: "https://leetcode.com/problems/set-matrix-zeroes/" },
      { name: "Pow(x, n)", difficulty: "Medium", lc: "https://leetcode.com/problems/powx-n/" },
      { name: "Multiply Strings", difficulty: "Medium", lc: "https://leetcode.com/problems/multiply-strings/" },
      { name: "Sum of Two Integers", difficulty: "Medium", lc: "https://leetcode.com/problems/sum-of-two-integers/" },
      { name: "Reverse Integer", difficulty: "Medium", lc: "https://leetcode.com/problems/reverse-integer/" },
      { name: "Detect Squares", difficulty: "Medium", lc: "https://leetcode.com/problems/detect-squares/" },
    ],
    walkthrough: { problem: "Rotate Image — rotate n×n matrix 90° clockwise in-place", steps: ["Q: Can I use extra space? → O(n²) easy but problem says in-place","Q: What does 90° clockwise mean? → [i][j] goes to [j][n-1-i]","Trick: two steps — Transpose then Reverse each row","Transpose: swap matrix[i][j] with matrix[j][i] for i<j","Reverse rows: reverse each row in place","Combined effect = 90° clockwise. Time: O(n²), Space: O(1) ✓"] }
  },
];

export const TOTAL_PROBLEMS = PATTERNS.reduce((s, p) => s + p.problems.length, 0);
