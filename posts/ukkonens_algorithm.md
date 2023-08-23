---
title: "Ukkonen's algorithm for O(n) suffix tree construction"
date: "2023-08-22"
---

Ukkonen's algorithm is an algorithm for generating a suffix tree in O(n) time. It's surprisingly quick (at least to me), as suffix trees themselves store paths for strings totalling O(n<sup>2</sup>) length. And it also surprisingly complex for an O(n) algorithm. In this post, we'll go over from basics what Ukkonen's algorithm is doing and how.

Finished code illustrating the descriptions can be found [here](https://github.com/cmistrata/substring_structures/blob/main/ukkonens_algorithm.py).

## What is a suffix tree / trie?

Ukkonen's algorithm is an algorithm for creating a **trie** of the **suffixes** of a **source string**. Although the trie of the suffixes of a string is formally called a **suffix tree**, this feels like a bit of a misnomer, and I'll use the names **suffix trie** and **trie** in this post to clearly indicate that the structure we are building is a trie.

## Implicitly defined branches

Ukkonen's algorithm generates an **implicit suffix trie** ("implicit trie" being an informal name for a [Patricia trie](https://en.wikipedia.org/wiki/Radix_tree#Variants)). The trie is "implicit" because the branches in the trie that Ukkonen's algorithms generates are not made of strings of characters; instead, each branch is defined using a **source string index** in the **source string**, and implicitly is made of the characters `source_string[source_string_index:]`.
For example, take the following branches in different source strings:

1. For source string "abc🍁": `Branch(source_string_index=1)` == `"abc🍁"[1:]` == `"bc🍁"`
2. For source string "hello🍁": `Branch(source_string_index=2)` == `"hello🍁"[2:]` == `"llo🍁"`

Note that because we are creating a suffix trie, these branches are suffixes of the source string.

**Storing branches implicitly, and not storing actual substrings for them, means it is possible to create a structure of O(n) space (n branches of 1 number each) instead of O(n^2) (n branches of substrings of 1 through n length)**. This _also_ makes it possible to create an algorithm to generate this structure in O(n) time, which Ukkonen's algorithm accomplishes.

## Ukkonen's algorithm's iterative substructure

Ukkonen's algorithm works by iteratively creating a suffix trie for each prefix of the source string passed in. For example, for generating `suffix_trie("abc🍁")` from source string `"abc🍁"`, Ukkonen's algorithm would:

1. Initialize a suffix trie for the empty string "". We now have `suffix_trie("")`.

```
*
```

2. Append `a` to the suffix trie. We now have `suffix_trie("a")`

```
* → `a`
```

3. Append `b` to the suffix trie. We now have `suffix_trie("ab")`

```
*  → `ab`
   → `b`
```

4. Append `c` to the suffix trie. We now have `suffix_trie("abc")`

```
   → `abc`
*  → `bc`
   → `c`
```

5. Append `🍁` to the suffix trie. We now have `suffix_trie("abc🍁")`

```
   → `abc🍁`
*  → `bc🍁`
   → `c🍁`
   → `🍁`
```

### Work done at each step for a trivial string

At each step, **adding the character to the end of existing branches is done automatically** (no actual work is needed), as we have defined branches only in terms of the start index in the source string and this will not be affected by increasing the end index of the prefix we are creating the suffix trie for in the current step.

The work that needs to manually be done at each step is creating a new branch and branching it off of the root of the tree (represented by `*` in the above diagrams). We create the new branch by setting its start index to the index of the character we are adding, and then "grow" it out of the root by adding it as a child of the root. Expanding upon the previous example:

1. Initialize a suffix trie for the empty string "". We now have `suffix_trie("")`.

```py
> * = initialize_suffix_tree()
> *.branches = {}

*
```

2. Append `a` to the suffix trie. We now have `suffix_trie("a")`

```py
> *.branches['a'] = Branch(source_start_index=0)

* → a (Branch(source_start_index=0))
```

3. Append `b` to the suffix trie. We now have `suffix_trie("ab")`. **Note here that we have not updated the definition of `Branch(source_start_index=0)`, but it has been implicitly updated to end at the end of the current string `ab` instead of at `a`, becoming `ab` from `a`.**

```py
> *.branches['b'] = Branch(source_start_index=1)

*  → ab Branch(source_start_index=0)
   → b  Branch(source_start_index=1)
```

4. Append `c` to the suffix trie. We now have `suffix_trie("abc")`.

```py
> *.branches['c'] = Branch(source_start_index=2)

   → abc Branch(source_start_index=0)
*  → bc  Branch(source_start_index=1)
   → c   Branch(source_start_index=2)
```

5. Append `🍁` to the suffix trie. We now have `suffix_trie("abc🍁")`.

```py
> *.branches['🍁'] = Branch(source_start_index=3)

   → abc🍁 Branch(source_start_index=0)
*  → bc🍁  Branch(source_start_index=1)
   → c🍁   Branch(source_start_index=2)
   → 🍁    Branch(source_start_index=3)
```

The example `abc🍁` is a trivial one though for creating a suffix trie. The point of a trie is to combine paths along the trie that follow the same characters into one path. However, each of the suffixes of `abc🍁` start with a different character, so no paths can be combined. Let's go over a more complex example.

## More complex branching

For a more illustrative example, let's take the string `aba🍁`. Our existing algorithm would produce:

```
   → aba🍁 branch0
*  → ba🍁  branch1
   → a🍁   branch2
   → 🍁    branch3
```

However, this "trie" fails as a trie, as there are two distinct branches starting with the same character `a`.

### Internal branches

To be a trie, the paths of branches should be combined up until they split like so:

```
                          → ba🍁 lbranch0 (suffix aba🍁)
   → a, internal branch *<
                          → 🍁 lbranch2   (suffix a🍁)
*  → ba🍁  lbranch1
   → 🍁    lbranch3
```

To do this, we must break out current definition of a branch. Now, we will split our definition of branches into two varieties:

1. A **leaf branch**, taking over our existing definition of a branch that has a source string start index and goes to the end of the current string. As before, for source string "aba🍁": `LeafBranch(source_string_index=1)` == `"aba🍁"[1:]` == `"ba🍁"`
2. An **internal branch**, which exists internally inside of the trie and has more than 1 path/suffix going through it. Above, the internal branch with string `a` has suffixes **a**ba🍁 and **a🍁** passing through it. These branches then split out at **junction nodes** where the suffixes diverge (b vs 🍁). **Define these branches, which represent a substring of the source string, using a source start index and end index.** For source string "aba🍁": `InternalBranch(source_string_start_index=0, source_string_end_index=1)` == `"aba🍁"[0:1]` == `"a"`

### Work done at each step for a non trivial string

When growing a branch out of the root, **if we see that the character we are adding is already at the start of an existing branch, we start to grow the new branch inside of the existing branch instead of creating a new one**. Later, when characters stop matching between the internal branch and the branch it is growing in, we must protrude out of the existing branch. We do the following steps when we encounter a new character "❌" that mismatches between the internal branch and its housing branch:

1. Create a new node **"junction"** representing the branching off point. We can grow new branches out of this node the same way we grow branches out of the root node `*`.
2. Split the branch we were growing inside of into two branches: an internal branch representing the beginning part of the branch behind the **junction**, and—depending on if we are splitting a leaf or internal branch respectively—a leaf branch or internal branch representing the remaining part of the branch after **junction**.
3. Start growing a new leaf branch out of **junction** for ❌ , defining it using ❌'s index in the source string.

Note for the above, we will not necessarily always create a new node if a node to grow out of (such as root `*` for our naive example) already exists.

To illustrate the above, take the string `aaa❌🍁`. The process looks like:

1. Initialize a suffix trie for the empty string ``. We now have a suffix trie for the empty string.

```py
> * = initialize_suffix_tree()
> *.branches = {}

*
```

2. Append `a` to the suffix trie. We now have a
   suffix trie for `a`

```py
> *.branches['a'] = Branch(source_start_index=0)

* → a (Branch(source_start_index=0))
```

3. Append `a`. **But wait, `a` is already the start of an existing branch growing out of root!** So instead of creating a new branch, we grow what would be the new branch through the existing branch. **Imagining the trie as a physical tree like structure, you can imagine "aa" as a branch of large diameter, and "a" as a branch of smaller diameter growing inside of "aa"**.

```
> grow_branches_through_existing_branches()

* → [a]a Branch(source_start_index=0), with Branch(source_start_index=1) growing inside of it
```

4. Append `a` to the suffix trie. **But wait, `a` is already the start of an existing branch growing out of root!**. _And also_, **`a` continues to follow the existing branch for the branch created in the previous step.** Still don't create any new branches. Again, you can **imagine "aaa" as a branch of large diameter, and "aa" and "a" being branches of smaller diameters growing inside of "aaa"**.

```
> grow_branches_through_existing_branches()

* → [a][a]a Branch(source_start_index=0), with Branch(source_start_index=1) and Branch(source_start_index=2) growing inside of it
```

5. Append `❌` to the suffix trie. `❌` does not continue to grow any of our internal branches, so we must protrude ❌ out of our internal branches. **Imagine our branches "aa" and "a" from the previous step physically turning and breaking through the wall of the branch "aaa" they were growing inside of**.

```
> protrude_branches()

    protrude ❌ out of this internal branch representing a branch
    growing inside another
        ↓
* → [a][a]a❌ ← this leaf was implicitly added as usual



protrude ❌ out of this internal branch representing a branch
growing inside another
     |
     ↓      ❌
* → [a]a *<
            a❌


protrude ❌ out of the root
|
↓        ❌
* → a *<      ❌
         a *<
              a❌


❌
↑        ❌
* → a *<      ❌
         a *<
              a❌
```

6. Finally, grow 🍁 out of all the branches and the root.

```
❌🍁
↑       ❌🍁
* → a *<     ❌🍁
↓       a *<
🍁           a❌🍁
```

#### Side note: Appending a terminating character

Looking at step 4, you may notice that we don't actually have a useable suffix trie, as some of the branches are still stuck internally inside of other branches. To avoid ending in a state like this, we add a unique character to the end of our source string—I have been using 🍁 in this post. As long as the unique character we add does not exist anywhere else in the string, it means we must protrude each of our internal branches out into leaf branches.

## Navigating the trie as we create new branches

Hopefully the above general overview of the algorithm makes sense and this overview is essentially what the algorithm does. However there is definitely a bit of hand waving going on in the description, and there's a fair amount of complexity and optimization left in figuring out where to move to grow a new branch, which we will go over.

### Keeping track of your position in the trie

In order to protrude as outlined above, we must keep track of the longest internal branch as we grow the trie, as this is the first branch we will protrude when we have a mismatch between an internal branch and the branch it is growing in.

To do this, we can keep track of a position in the tree we're at, which should be the end of the longest internal branch. **It can be helpful to imagine the tree as a physical structure, and yourself physically standing at the position we're at at each step.**

Your position is defined as either:

1. You are not growing inside of another branch: the root node `*`
2. You are growing inside of another branch: the branch we are growing inside of and our distance along it.

More simply, we will store this as a pair `(branch, branch_distance)`, with `branch` being empty if we are at the root.

Additionally, we will also store our distance along possibly many branches and junctions in the tree `(tree_distance)` for reasons that will be explained shortly, for `(branch, branch_distance, tree_distance)` as our position.

To keep track of this, you take the following action at each step when adding a new character:

#### Move forward in the tree

1. Move along the current branch by 1, incrementing your `branch_distance` distance and `tree_distance`. If the current character doesn't match a current path on the tree, you will "fall off the tree", and will need to protrude out an internal branch to safely land on in step 3 of "Updating the position."

#### Updating the position.

Conditionally do 1 of the following:

##### We landed on an existing part of the tree

1. If you are still on the same branch after moving (characters match and we haven't reached the end), do nothing.
2. If you were at a node before moving (either the root `*` or a junction `*<` at the end of an internal branch) and have now necessarily moved past it, but can follow a branch growing out of the node, change your `branch` to that branch and set `branch_distance` to 1.

##### We mismatched characters and moved off of the tree

1. If you can't follow an existing branch, protrude a new branch out of the existing position [as described earlier](#work-done-at-each-step-for-a-non-trivial-string) to land on. After doing this, **move to the next longest suffix in the trie**. To do this, you decrement `tree_distance` by one, as the next longest suffix will be one character shorter into the tree than the current longest suffix. If the next longest suffix is also not yet constructed in the tree, you need to continually create branches to land on and decrement `tree_distance` until you land on an existing position in the tree.

#### Why are new leaf branches always length 1 initially?

Note for step 3 above, **the next longest suffix in the trie will either be an existing position in the tree or a new leaf branch with length 1**. In other words, **we will never need to create a new leaf branch with initial length greater than 1.**

To prove this, for mismatched character "❌", let's say we are on suffix `s` in the tree before moving off it. Suffix `s` being in the tree means we have seen it and updated the tree with it already. This also means that every suffix of `s` has already been seen and the tree updated with them (take a moment to make sure that makes sense). When we encounter mismatch "❌", we need to add `s❌` to the tree. After doing this, we move our position to `s[1:]❌`. Because `s[1:]` is a suffix of `s`, it has already been inserted into the tree, so if `s[1:]❌` is not in the tree it will only be one distance off of it.

This fact will be important a bit later for optimizing our algorithm.

### Using suffix links

The above is generally how we keep track of the position, however the part "then move to the next longest suffix in the trie" is actually where a fair amount of the complexity of the algorithm lies. We can always move through the tree `tree_distance` starting from the root, following branches by following characters along the tree, however this is inefficient. We would like to use **suffix links** to keep track of shortcuts between nodes in the trie for immediately jumping without having to navigate branches.

Each junction node in the suffix trie can be viewed as a substring of the source string, with start index being the start index of the original branch coming out of the root branch, and end index being the end index of the internal branch the node is ending.

In order to move between our tree easily when creating new branches, we want to keep track of the next longest suffix of each junction node. We store this as a link representing a shortcut between the junction node and the node representing its suffix.

To create and store these links, whenever we move positions in the tree in [condition 3 above](#keeping-track-of-our-position-in-the-trie)—creating a junction node—and then immediately move positions again using condition 3—creating another junction node or moving off of an existing one—we create a link between the first node and the second.

To find the next longest suffix, we can use the following rule:

```
For junction node child_junction_node branching
off of parent_node:

  parent_node ---- internal_branch ----> child_junction_node

with internal_branch of length "offset".
```

```
next_longest_suffix(child_junction_node) =
  1. Move to next_longest_suffix(parent_node)
  2. Continue moving "offset" through the tree to get to
     next_longest_suffix(child_junction_node)
```

And **because [new leaf branches are always length 1 initially](#why-are-new-leaf-branches-always-length-1-initially), to move "offset" between nodes (which should bring us directly to the place we may possibly need to protrude a new length 1 leaf branch out of), we can always totally move along a branch without fear of falling off the tree or mismatching characters**. This detail ends up allowing us to avoid a lot of character comparisons and makes the runtime of the algorithm O(n) instead of O(n^2).
