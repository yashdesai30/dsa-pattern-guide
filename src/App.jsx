import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  ExternalLink,
  Compass, 
  Layers, 
  Award,
  Zap, 
  Lightbulb, 
  TrendingUp, 
  SlidersHorizontal,
  Flame,
  Clock,
  Database,
  RefreshCw,
  Wifi,
  Sparkles
} from "lucide-react";

// Phase metadata — controls display order and week labels
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

const PATTERNS = [
  {
    id: "arrays", name: "Arrays & Hashing", emoji: "🗃️", color: "#3b82f6",
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
    id: "two-pointers", name: "Two Pointers", emoji: "👈👉", color: "#10b981",
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
    id: "sliding-window", name: "Sliding Window", emoji: "🪟", color: "#f43f5e",
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
    id: "stack", name: "Stack", emoji: "📚", color: "#f59e0b",
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
    id: "binary-search", name: "Binary Search", emoji: "🔍", color: "#0ea5e9",
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
    id: "linked-list", name: "Linked List", emoji: "🔗", color: "#a855f7",
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
    id: "trees", name: "Trees", emoji: "🌳", color: "#10b981",
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
    id: "heap", name: "Heap / Priority Queue", emoji: "⛰️", color: "#f97316",
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
    id: "backtracking", name: "Backtracking", emoji: "🔙", color: "#ec4899",
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
    id: "graphs", name: "Graphs", emoji: "🕸️", color: "#06b6d4",
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
    id: "dp", name: "Dynamic Programming", emoji: "🧠", color: "#a855f7",
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
    id: "intervals", name: "Intervals", emoji: "📏", color: "#14b8a6",
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
    id: "greedy", name: "Greedy", emoji: "💰", color: "#fbbf24",
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
    id: "trie", name: "Trie", emoji: "🔤", color: "#ef4444",
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
    id: "math", name: "Math & Bit Manipulation", emoji: "🔢", color: "#64748b",
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

const TOTAL_PROBLEMS = PATTERNS.reduce((s, p) => s + p.problems.length, 0);

export default function App() {
  const [done, setDone] = useState({});
  const [activePattern, setActivePattern] = useState(null);
  const [activeTab, setActiveTab] = useState("patterns");
  
  // Custom interactive search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [copied, setCopied] = useState(false);

  // Database Synchronization & Premium Toast State
  const [userId, setUserId] = useState("");
  const [dbStatus, setDbStatus] = useState("local"); // 'synced' | 'syncing' | 'error' | 'local'
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Lightweight native confetti particle generator
  const triggerConfetti = () => {
    const container = document.createElement("div");
    container.className = "confetti-container";
    document.body.appendChild(container);

    const colors = ["#818cf8", "#c084fc", "#34d399", "#fbbf24", "#f87171", "#38bdf8"];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement("div");
      p.className = "confetti-particle";
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = Math.random() * 100 + "vw";
      p.style.top = "-10px";
      p.style.width = Math.random() * 8 + 6 + "px";
      p.style.height = Math.random() * 10 + 6 + "px";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      p.style.animationDelay = Math.random() * 0.4 + "s";
      p.style.animationDuration = Math.random() * 2 + 1.2 + "s";
      container.appendChild(p);
    }
    setTimeout(() => container.remove(), 3500);
  };

  // Initialize and load saved tracking state
  useEffect(() => {
    (async () => {
      // 1. Get or generate user UUID
      let uid = localStorage.getItem("dsa_user_uuid");
      if (!uid) {
        uid = "user_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("dsa_user_uuid", uid);
      }
      setUserId(uid);

      // Load local state as quick fallback
      let initialData = {};
      try {
        const stored = localStorage.getItem("dsa-nc150-v2") || localStorage.getItem("dsa-nc150");
        if (stored) {
          initialData = JSON.parse(stored);
          setDone(initialData);
        }
      } catch (e) {
        console.error("Local storage reading error", e);
      }

      // Try loading from database
      try {
        setDbStatus("syncing");
        const res = await fetch(`/api/progress?userId=${uid}`);
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.progress) {
            // Merge local and database data to avoid data loss
            const merged = { ...initialData, ...data.progress };
            setDone(merged);
            localStorage.setItem("dsa-nc150-v2", JSON.stringify(merged));
            setDbStatus("synced");
          } else {
            setDbStatus("synced");
          }
        } else {
          // If we got back the raw JS code file (Vite dev server) or 404/405, fall back to local mode
          setDbStatus("local");
        }
      } catch (err) {
        console.error("Failed to sync from database:", err);
        setDbStatus("error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update and save tracking state
  const toggleProblem = async (patternId, name) => {
    const key = `${patternId}::${name}`;
    const wasDone = !!done[key];
    const next = { ...done, [key]: !done[key] };
    if (!next[key]) delete next[key];
    
    setDone(next);

    // Check if pattern is completed to trigger a toast and confetti!
    const pattern = PATTERNS.find(p => p.id === patternId);
    if (pattern && !wasDone) { // Checked active -> completed
      const solvedInPattern = pattern.problems.filter(pr => next[`${pattern.id}::${pr.name}`]).length;
      if (solvedInPattern === pattern.problems.length) {
        setToastMessage(`🎉 Congratulations! You solved the complete ${pattern.name} pattern deck!`);
        setShowToast(true);
        triggerConfetti();
        setTimeout(() => setShowToast(false), 5000);
      }
    }

    // Save to localStorage standard robust tracker
    try {
      localStorage.setItem("dsa-nc150-v2", JSON.stringify(next));
    } catch (err) {
      console.error("Local storage writing error", err);
    }

    // Sync to Neon DB (only if remote database is active and was successfully reached)
    if (userId && dbStatus !== "local") {
      try {
        setDbStatus("syncing");
        const res = await fetch(`/api/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, progress: next })
        });
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          setDbStatus("synced");
        } else {
          setDbStatus("local");
        }
      } catch (e) {
        console.error("Database save error", e);
        setDbStatus("error");
      }
    }
  };

  const forceSync = async () => {
    if (!userId) return;
    try {
      setDbStatus("syncing");
      const res = await fetch(`/api/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, progress: done })
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        setDbStatus("synced");
      } else {
        setDbStatus("local");
      }
    } catch (e) {
      console.error("Database manual sync error", e);
      setDbStatus("error");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const solvedCount = Object.values(done).filter(Boolean).length;
  const pct = Math.round((solvedCount / TOTAL_PROBLEMS) * 100) || 0;
  const selectedPattern = PATTERNS.find(p => p.id === activePattern);
  const getPatternSolvedCount = (p) => p.problems.filter(pr => done[`${p.id}::${pr.name}`]).length;

  const DIFF_STYLE = {
    Easy: { bg: "rgba(16, 185, 129, 0.12)", color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
    Medium: { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
    Hard: { bg: "rgba(239, 68, 68, 0.12)", color: "#f87171", border: "rgba(239, 68, 68, 0.3)" },
  };

  // Perform filtering
  const filteredPatterns = PATTERNS.filter(p => {
    // Search query matches pattern name, description or signals
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.when.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.signal.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesQuery;
  });

  return (
    <div className="app-container">
      {/* Global database loading skeleton loader */}
      {loading && (
        <div className="global-skeleton-bar">
          <div className="shimmer" />
        </div>
      )}

      {/* ── Premium Top Glow Dashboard Header ── */}
      <header className="header">
        <div className="header-content">
          
          <div className="header-brand">
            <div className="brand-icon">
              <Flame style={{ height: 20, width: 20, color: "#fff" }} />
            </div>
            <div>
              <h1 className="brand-title">DSA Pattern Guide</h1>
              <p className="brand-subtitle">NeetCode 150 Tracker • Spaced Learning Deck</p>
            </div>
          </div>

          {/* Neon DB Sync Badge */}
          <div className={`db-sync-badge status-${dbStatus}`} onClick={forceSync} title="Click to manually sync progress">
            {dbStatus === "synced" && (
              <>
                <Database className="db-icon green" style={{ height: 13, width: 13 }} />
                <span>Synced</span>
                <span className="dot pulsing green" />
              </>
            )}
            {dbStatus === "syncing" && (
              <>
                <RefreshCw className="db-icon spinning yellow" style={{ height: 13, width: 13 }} />
                <span>Syncing</span>
              </>
            )}
            {dbStatus === "error" && (
              <>
                <Database className="db-icon red" style={{ height: 13, width: 13 }} />
                <span>Sync Error</span>
                <span className="dot pulsing red" />
              </>
            )}
            {dbStatus === "local" && (
              <>
                <Database className="db-icon grey" style={{ height: 13, width: 13 }} />
                <span>Local Cache</span>
              </>
            )}
          </div>

          {/* Overall Progress Dashboard */}
          <div className="progress-dashboard">
            <div className="progress-info">
              <span className="progress-label">Global Progress</span>
              <div className="progress-values">
                <span className="progress-count">{solvedCount}</span>
                <span className="progress-total">/ {TOTAL_PROBLEMS} Solved</span>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="progress-ring-container">
              <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="28" cy="28" r="23" stroke="rgba(255,255,255,0.04)" strokeWidth="4.5" fill="transparent" />
                <circle cx="28" cy="28" r="23" stroke="url(#indigoGrad)" strokeWidth="4.5" fill="transparent" 
                  strokeDasharray={144.5} strokeDashoffset={144.5 - (144.5 * pct) / 100} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease-out" }} />
                <defs>
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="progress-percentage">{pct}%</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="tabs-container">
          {[
            { id: "patterns", label: "Interactive Patterns", icon: Layers },
            { id: "solve", label: "Step-by-Step Solving", icon: Compass },
            { id: "method", label: "Study Architecture", icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => { setActiveTab(tab.id); setActivePattern(null); }} 
                className={`tab-btn ${active ? "active" : ""}`}
              >
                <Icon style={{ height: 16, width: 16, color: active ? "#818cf8" : "inherit" }} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <main className="main-content">
        
        {/* ── INTERACTIVE PATTERNS TAB ── */}
        {activeTab === "patterns" && (
          <div className="patterns-grid">
            
            {/* Left Column: Patterns Navigation Deck */}
            <div className={`sidebar-deck ${activePattern ? "hide-mobile" : ""}`}>
              
              {/* Dynamic Search bar deck */}
              <div className="glass" style={{ padding: 16 }}>
                <div className="search-container">
                  <Search className="search-icon" style={{ height: 16, width: 16 }} />
                  <input 
                    type="text" 
                    placeholder="Search patterns, trigger signals..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Phases List */}
              {PHASES.map(phase => {
                const phasePatterns = filteredPatterns.filter(p => phase.ids.includes(p.id));
                if (phasePatterns.length === 0) return null;

                return (
                  <div key={phase.phase} className="phase-group">
                    <div className="phase-header" style={{ borderLeftColor: phase.color }}>
                      <div>
                        <h3 className="phase-title">{phase.label}</h3>
                        <span className="phase-desc">{phase.desc}</span>
                      </div>
                      <span className="phase-week" style={{ borderColor: `${phase.color}30`, color: phase.color, background: `${phase.color}10` }}>
                        {phase.week}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {phasePatterns.map(p => {
                        const solved = getPatternSolvedCount(p);
                        const total = p.problems.length;
                        const pctSolved = Math.round((solved / total) * 100) || 0;
                        const isSelected = activePattern === p.id;

                        return (
                          <button
                            key={p.id}
                            onClick={() => setActivePattern(p.id)}
                            className={`pattern-button ${isSelected ? "active" : ""}`}
                            style={{ borderLeftColor: p.color }}
                          >
                            <div className="pattern-info-wrap">
                              <span className="pattern-emoji-box">
                                {p.emoji}
                              </span>
                              <div className="pattern-text-details">
                                <span className="pattern-name">{p.name}</span>
                                <div className="pattern-progress-bar-container">
                                  <div className="progress-track">
                                    <div 
                                      className="progress-fill" 
                                      style={{ backgroundColor: p.color, width: `${pctSolved}%` }} 
                                    />
                                  </div>
                                  <span className="pattern-progress-text">
                                    {solved} / {total}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight style={{ height: 16, width: 16, color: isSelected ? "#818cf8" : "#4b5563" }} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Pattern Detail Deck */}
            <div className="detail-deck animate-fade-in" style={{ display: !selectedPattern && activeTab === "patterns" ? "none" : "flex" }}>
              {selectedPattern ? (
                <>
                  {/* Pattern Header Panel */}
                  <div className="glass pattern-header-card" style={{ borderLeftColor: selectedPattern.color }}>
                    {/* Glowing dynamic backdrop */}
                    <div 
                      className="pattern-header-card-glow"
                      style={{ backgroundColor: selectedPattern.color }} 
                    />

                    <div className="detail-header-row">
                      <div>
                        <button 
                          onClick={() => setActivePattern(null)} 
                          className="back-btn"
                          style={{ display: "flex" }}
                        >
                          <ChevronLeft style={{ height: 14, width: 14 }} /> Back to patterns
                        </button>
                        <div className="detail-title-block">
                          <span className="detail-emoji">{selectedPattern.emoji}</span>
                          <div>
                            <h2 className="detail-title">{selectedPattern.name}</h2>
                            <span className="detail-subtitle" style={{ color: selectedPattern.color }}>
                              Optimal Blueprint
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="detail-count-badge">
                        <span className="badge-label">Completeness</span>
                        <span className="badge-val">
                          {getPatternSolvedCount(selectedPattern)}<span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>/{selectedPattern.problems.length}</span>
                        </span>
                      </div>
                    </div>

                    <div className="when-to-use-section">
                      <span className="section-label">When to apply</span>
                      <p className="section-desc">
                        {selectedPattern.when}
                      </p>
                    </div>
                  </div>

                  {/* Trigger Signals Deck */}
                  <div className="glass info-card">
                    <div className="info-card-header">
                      <Zap style={{ height: 18, width: 18, color: "var(--warning)" }} />
                      <h4 className="info-card-title">Trigger Signals & Clues</h4>
                    </div>
                    <p className="info-card-desc">
                      Spot these key terms or constraints in problem statements to identify this pattern:
                    </p>
                    <div className="signal-tags">
                      {selectedPattern.signal.map(s => (
                        <span 
                          key={s} 
                          className="signal-tag"
                          style={{ 
                            backgroundColor: `${selectedPattern.color}0a`, 
                            color: selectedPattern.color, 
                            borderColor: `${selectedPattern.color}25` 
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Code Template Box */}
                  <div className="template-card">
                    <div className="template-card-header">
                      <div className="template-header-title">
                        <span className="pulse-dot" />
                        <h4 className="info-card-title">Boilerplate Blueprint</h4>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(selectedPattern.template)}
                        className="copy-btn"
                      >
                        {copied ? (
                          <>
                            <Check style={{ height: 14, width: 14, color: "var(--success)" }} />
                            <span style={{ fontSize: 10, color: "var(--success)", fontWeight: 800 }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy style={{ height: 14, width: 14 }} />
                            <span style={{ fontSize: 10 }}>Copy Blueprint</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="template-body">
                      <pre className="code-font" style={{ fontSize: 11.5, color: "#e0e7ff", lineHeight: 1.7, margin: 0 }}>
                        {selectedPattern.template}
                      </pre>
                    </div>
                  </div>

                  {/* Dry Run / Walkthrough */}
                  <div className="glass info-card">
                    <div className="info-card-header">
                      <Lightbulb style={{ height: 18, width: 18, color: "var(--primary)" }} />
                      <h4 className="info-card-title">Mental Walkthrough</h4>
                    </div>

                    <div className="walkthrough-target-card">
                      <span className="badge-label">Representative Problem</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginTop: 2, display: "block" }}>{selectedPattern.walkthrough.problem}</span>
                    </div>

                    <div className="walkthrough-steps">
                      {selectedPattern.walkthrough.steps.map((step, idx) => (
                        <div key={idx} className="walkthrough-step-item">
                          <span 
                            className="step-number"
                            style={{ 
                              backgroundColor: `${selectedPattern.color}15`, 
                              color: selectedPattern.color, 
                              borderColor: `${selectedPattern.color}35` 
                            }}
                          >
                            {idx + 1}
                          </span>
                          <p className="step-text">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leetcode Problem Checklist */}
                  <div className="glass info-card">
                    <div className="checklist-header">
                      <div className="info-card-header" style={{ marginBottom: 0 }}>
                        <Award style={{ height: 18, width: 18, color: "var(--primary)" }} />
                        <h4 className="info-card-title">NeetCode 150 Core List</h4>
                      </div>

                      <div className="checklist-filters">
                        {["All", "Easy", "Medium", "Hard"].map(diff => (
                          <button
                            key={diff}
                            onClick={() => setDifficultyFilter(diff)}
                            className={`filter-chip ${difficultyFilter === diff ? "active" : ""}`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {selectedPattern.problems
                        .filter(p => difficultyFilter === "All" || p.difficulty === difficultyFilter)
                        .map(problem => {
                          const isDone = !!done[`${selectedPattern.id}::${problem.name}`];
                          const ds = DIFF_STYLE[problem.difficulty];

                          return (
                            <div 
                              key={problem.name}
                              className={`problem-row ${isDone ? "solved" : ""}`}
                            >
                              <div className="problem-info-block">
                                <button
                                  onClick={() => toggleProblem(selectedPattern.id, problem.name)}
                                  className="toggle-circle-btn"
                                >
                                  {isDone ? (
                                    <CheckCircle style={{ height: 18, width: 18, color: "var(--success)" }} />
                                  ) : (
                                    <Circle style={{ height: 18, width: 18, color: "rgba(255,255,255,0.2)" }} />
                                  )}
                                </button>
                                <span className={`problem-title ${isDone ? "solved" : ""}`}>
                                  {problem.name}
                                </span>
                              </div>

                              <div className="problem-actions-block">
                                <span 
                                  className="difficulty-badge"
                                  style={{ backgroundColor: ds.bg, color: ds.color, borderColor: ds.border }}
                                >
                                  {problem.difficulty}
                                </span>
                                <a 
                                  href={problem.lc} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="lc-link-icon"
                                >
                                  <ExternalLink style={{ height: 13, width: 13 }} />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass empty-details-card">
                  <div className="empty-icon-box">
                    <Compass style={{ height: 28, width: 28 }} />
                  </div>
                  <div>
                    <h3 className="empty-title">Select a Pattern</h3>
                    <p className="empty-desc">
                      Choose any pattern on the left side menu to review practical signals, trigger keywords, dry-run walkthroughs, templates, and track specific problems.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── STEP-BY-STEP SOLVING TAB ── */}
        {activeTab === "solve" && (
          <div className="solve-list-container animate-fade-in">
            <div className="solve-header-block">
              <h2 className="solve-header-title">Solving Framework</h2>
              <p className="solve-header-desc">
                Follow this exact step-by-step procedure to tackle any coding interview question reliably.
              </p>
            </div>

            {[
              { icon: "🔍", n: "1", title: "Understand", color: "#3b82f6", body: "Restate in your own words. Clarify: input/output types, size constraints, can values be negative/duplicate? Edge cases: empty input, single element, all same." },
              { icon: "🧩", n: "2", title: "Pattern Match", color: "#10b981", body: "Ask: Is array sorted? Am I finding a contiguous window? Need a pair? Graph connectivity? K elements? Match to one of the 15 patterns before writing code." },
              { icon: "💪", n: "3", title: "Brute Force First", color: "#f59e0b", body: "Always state the naive solution. 'I can solve this in O(n²) by...' This shows structured thinking and gives a baseline to optimize from." },
              { icon: "⚡", n: "4", title: "Optimize", color: "#ef4444", body: "What's the bottleneck? Can I trade space for time? Does sorting help? Can I eliminate half the search space? Can I defer work with a stack/heap?" },
              { icon: "💻", n: "5", title: "Code Clean", color: "#a855f7", body: "Meaningful variable names. No magic numbers. Handle edge cases inline. Write like a senior engineer is reviewing it." },
              { icon: "✅", n: "6", title: "Test & Trace", color: "#14b8a6", body: "Dry-run your example step by step. Then check: empty input, single element, all duplicates, negative numbers, sorted/reverse sorted input." },
            ].map((s, idx) => (
              <div 
                key={idx} 
                className="glass solve-step-card"
                style={{ borderLeft: `4px solid ${s.color}` }}
              >
                <span className="pattern-emoji-box" style={{ height: 44, width: 44, fontSize: 20 }}>
                  {s.icon}
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span 
                      className="solve-step-badge"
                      style={{ backgroundColor: `${s.color}15`, color: s.color, borderColor: `${s.color}35` }}
                    >
                      STEP {s.n}
                    </span>
                    <h3 className="solve-step-title">{s.title}</h3>
                  </div>
                  <p className="solve-step-desc">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}

            <div className="senior-bar-card">
              <div className="info-card-header" style={{ marginBottom: 0 }}>
                <SlidersHorizontal style={{ height: 18, width: 18, color: "var(--warning)" }} />
                <h4 className="info-card-title">Interviewer Expectations (Senior-Level)</h4>
              </div>
              <ul className="senior-bar-list">
                {[
                  "State brute force first, even if completely obvious",
                  "Explain algorithmic trade-offs (Time vs Space complexity) before optimizing",
                  "Ask clarifying questions and verify assumptions before coding",
                  "Talk and narrate while you write — explain the 'why' behind the logic",
                  "Proactively mention and handle edge cases without being prompted"
                ].map((t, idx) => (
                  <li key={idx} className="senior-bar-item">
                    <span className="bullet-amber">→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── STUDY ARCHITECTURE TAB ── */}
        {activeTab === "method" && (
          <div className="solve-list-container animate-fade-in">
            <div className="solve-header-block">
              <h2 className="solve-header-title">Study Spacing Protocol</h2>
              <p className="solve-header-desc">
                Commit patterns to your long-term memory through structured spacing intervals.
              </p>
            </div>

            {[
              { n:"1", title:"Learn the Pattern", desc:"Read the blueprint. Understand WHEN to use it. Solve 1 easy example by hand on paper or whiteboard before touching the IDE.", time:"30 min" },
              { n:"2", title:"Solve Easy Problems", desc:"Attempt 2–3 easy problems. Give yourself 15 minutes each. If stuck after 10 min, look at category hint only — avoid reading solutions.", time:"1–2 hrs" },
              { n:"3", title:"Study Solutions Deeply", desc:"After solving or timing out: Why does this work? What constraints break it? What is the core complexity? Never skip this review phase.", time:"20 min each" },
              { n:"4", title:"Solve Medium Problems", desc:"Attempt 2–3 medium problems. 20–30 minutes each. Force yourself to state: 'This is a ___ pattern because ___.' Code it with clean variables.", time:"2–3 hrs" },
              { n:"5", title:"Pattern Journal Entry", desc:"Write down the pattern in your own words: when to use, the boilerplate code, and 2 example problems. This is your cheatsheet before live interviews.", time:"15 min" },
              { n:"6", title:"Spaced Review", desc:"Re-solve one problem from this pattern after 3 days, then 7 days. From scratch — strictly no notes, purely from memory.", time:"Recurring" },
            ].map((s, idx) => (
              <div key={idx} className="glass solve-step-card" style={{ borderLeft: "4px solid #8b5cf6" }}>
                <span className="method-step-number">
                  {s.n}
                </span>
                <div>
                  <h3 className="solve-step-title">{s.title}</h3>
                  <p className="solve-step-desc" style={{ marginTop: 4 }}>
                    {s.desc}
                  </p>
                  <div className="method-time-badge">
                    <Clock style={{ height: 12, width: 12 }} />
                    <span>Duration: {s.time}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="rhythm-card">
              <div className="info-card-header" style={{ marginBottom: 0 }}>
                <TrendingUp style={{ height: 18, width: 18, color: "var(--success)" }} />
                <h4 className="info-card-title">Weekly Spaced Rhythm</h4>
              </div>
              <div className="rhythm-grid">
                {[
                  { days: "Mon / Tue", task: "Solve 2–3 problems from the active pattern deck at home." },
                  { days: "Wed – Fri", task: "Review system design + study behavioral answers." },
                  { days: "Saturday", task: "Mock test: 2 random problems in 90 minutes. No hints allowed." },
                  { days: "Sunday", task: "Rest. Review your pattern journal cards." }
                ].map((item, idx) => (
                  <div key={idx} className="rhythm-item">
                    <span className="rhythm-day">
                      {item.days}
                    </span>
                    <p className="rhythm-task">
                      {item.task}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Congratulatory Toast Notification */}
      {showToast && (
        <div className="premium-toast animate-slide-up">
          <div className="toast-glow" />
          <Sparkles style={{ height: 20, width: 20, color: "var(--warning)" }} />
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
