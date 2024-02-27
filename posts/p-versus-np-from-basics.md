---
title: "P vs NP from basics"
date: "2023-08-21"
completed: true
---

[P versus NP](https://en.wikipedia.org/wiki/P_versus_NP_problem) is one of the, if not the, greatest unsolved problems in mathematics. It questions whether the `NP` and `P` complexity classes for problems are the same. What does this mean? Let's go over it step by step, starting from basics.

## ToC

## What's an algorithm?

An **algorithm** is an outlined way of solving a problem. You can think of it as a step by step process that you can follow to find a solution to a problem.

For example, say you want to sort a deck of `N` cards with unique values. A simple algorithm for this problem is the following:

1. Search the deck for the smallest card.
2. Put that card on top of a new sorted deck.
3. Continue running steps 1 and 2 until there are no cards left in the original deck.

Algorithms today are mostly in the context of code, which makes sense as computers are able to follow rigorous steps much more quickly and reliably than people.

## Time complexity

Different algorithms take different amounts of time to run. The **time complexity** of an algorithm describes how long it takes based on how large the instance of a problem is. We express time complexity as a function of the size of the problem **N**. For example, N could be the amount of cards for problems involving searching/sorting cards.

<details>
<summary>Deep dive: worst case time complexity</summary>

Computer scientists are often particularly interested in the **worst case time complexity** of an algorithm — that is, how long it takes to run it based on the worst/unluckiest possible input.

For example, given the problem again to sort a deck of cards, say each time we search the deck for the smallest card we stop searching if we find a card with value exactly 1 greater than the card at the top of our sorted deck. For example, if the top card our sorted deck is a `2`, and we find a `3` in the original deck, we know this is the next card and can stop searching.

A particularly difficult input to this problem, and the one we'd use to determine the worst case time complexity, is a deck of cards that is in reverse order; each time we search the deck, we have to go through the entire deck to find the next smallest card!

</details>

<details>
<summary>Deep dive: Big O Notation</summary>

The time complexity of an algorithm is usually expressed in [Big-O notation](https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/big-o-notation). This is shown as O(f(N)). Our algorithm to sort cards would be O(N<sup>2</sup>): we have to search a deck of N cards to get the smallest card N times. As another example, finding the smallest card in a deck would be O(N): look at every card and keep track of the smallest.

For sorting, in actuality the size of the deck decreases each time we search it, meaning on average we're only searching a deck of N/2 cards. However, big O notation doesn't care about coefficients like 1/2, and we basically round N/2 up to N in the expression of the complexity.

</details>

## Time complexity classes

We can use time complexity to group many seemingly different problems into **time complexity classes** by how long algorithms for them take to run.

As a simple example, **linear complexity** is a time complexity class grouping problems with algorithms that take time to run directly proportional to the size of the input. These are usually algorithms that just need to look over all the input once. For example, finding the smallest card in a deck of N cards by searching all the cards, or finding a matching sock during laundry by searching N other socks would be algorithms with linear complexity.

## P and NP time complexity classes

**P** and **NP** are both time complexity classes that describe how _easy_ (provide an upper bound on how long it takes to solve a problem but not a lower bound) a problem is to do.

### P (deterministic polynomial time) complexity

**P** is short for **deterministic polynomial time**\, or more succinctly **polynomial time**. Polynomial time describes problems with algorithms that take at most an exponential (N<sup>c</sup> where c is a constant) amount of time to run using a [deterministic Turing machine](https://en.wikipedia.org/wiki/Turing_machine). A deterministic Turing machine is basically a real-word computer, including whatever one you're reading this article on.

Harder problems in this category can often be solved by trying combinations of input elements with a constant size. For example, say you have a list of N numbers, and you want to find 3 numbers in the list that add up to 17. You could check every combination of 3 numbers in the list (N<sup>3</sup> combinations) until you find a combination that adds to 17, putting this problem in P time.

### NP (non-deterministic polynomial time)

**NP** is short for **non-deterministic polynomial time** (and _not_ "not polynomial time" which you might guess). These are problems that can be solved in polynomial time by a [non-deterministic Turing machine](https://en.wikipedia.org/wiki/Nondeterministic_Turing_machine).

A **non-deterministic Turing machine** is a computer that can explore multiple solutions simultaneously. For example, say you want to find a route through a corn maze; when you reach a branching path in the maze, you could clone yourself and try out both paths, and keep doing this every time you reach a new branch in the maze until one of your clones finds the exit. Obviously this is not actually possible, but it would be nice, and you could probably set a corn maze world record or something among other benefits.

It can be easier to think about a non-deterministic Turing machine as a deterministic Turing machine that always gets as lucky as possible, which is an equivalent definition. Consequentially, you can think of NP (non-deterministic polynomial time) problems as being solvable in polynomial time as long as you're as lucky as possible when running the algorithm.

Take the problem from earlier about finding three numbers in a list that add to 17. A non-deterministic solver would just pick three numbers from the list, and because they're lucky they end up being the right three numbers!

However, no matter how lucky you are when solving a problem, you still need to verify the solution you come up with is correct. In fact, this ends up becoming the only amount of time you need to spend solving any problem. For our problem of finding 3 numbers that sum to 17, this would be the time it takes to add 3 numbers. **So equivalently and more simply, NP describes problems with solutions that can be verified in polynomial time.**

### P versus NP

The NP complexity class is by definition larger than / at least as difficult as the P complexity class. **P versus NP** asks if the **P** and **NP** time complexity classes are the same. In other words, **if you can verify the solution to a problem in polynomial time, can you also necessarily find a solution in polynomial time?**

The obvious answer to this question might seem like no — after all, finding the answer to a problem is much harder than checking if it's correct! And most mathematicians and computer scientists believe the answer is probably no, but none of them have been able to prove it either way.

Even more bafflingly, there's a pretty clear outline of how you could prove if P equals or doesn't equal NP, detailed below

## Bonus info: how to prove if P = NP

### Reductions

We can compare the difficulty of 2 types of problems by checking if an instance of the first problem type can be **reduced** to an instance of the second type, essentially meaning we can phrase the first problem as the second one.

For example, take the following two problems

1. Sort a deck of cards with unique values.
2. Sort a deck of cards that may have repeated values.

Problem 1 can be reduced to problem 2: given a deck of unique cards, we can just act like we don't know if our deck has repeated cards in it.

However, problem 2 is not reducible to problem 1. We can't just ignore the fact that our deck can have repeated values, and an algorithm for the first problem might fail on an instance of the second. Let's say you have an algorithm for problem 1 that stops searching once it has found the next smallest value: e.g., if you find an 8, put it on top of your sorted deck, and then find a 9, you can stop searching and put the 9 on top of the deck. If our deck has repeated values (possibly another 8), this algorithm would fail.

If we can reduce an instance of problem 1 to problem 2, we can say problem 2 is at least as hard as problem 1: an algorithm that solves problem 2 could also be used to solve problem 1, but not necessarily vice versa.

We use this concept of **reducibility**—being able to reduce one problem type into another—to compare the difficulty of problems. And to prove if P = NP, theoretically you could

1. Find the hardest problem in NP.
2. Prove that the problem can or can't be solved in polynomial time.

And surprisingly, we have found the hardest problem in NP! In fact, we have found a whole set of problems that are equally hardest. However, no one has been able to prove if any of these problems do or don't have a polynomial time algorithm.

### NP-hard and NP-complete

Unlike P and NP, **NP-hard** is a complexity class describing how difficult a problem is. It describes problems that are at least as difficult (take as long or longer to solve) as every other problem in **NP**. These problems are not necessarily in **NP** themselves.

**NP-complete** describes problems that are **NP-hard** and also in **NP**. In other words, they are the hardest **NP** problems, and we have found a bunch of them.

Because these problems are equally hard, any NP-complete problem can be reduced to (reformulated as) a problem instance of any other NP-complete problem. This is surprising as NP-complete contains many seemingly different problems. Two famous problems in NP-complete are the [traveling salesman problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem)—given a list of cities with roads between them, what's the shortest route I can take from a home city to visit every city and then return home?—and the [knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem)—given a set of objects each with a size and value and a backpack/knapsack of fixed size, what's the maximum amount of value we can fit into the backpack? Because these problems are both NP-complete, even though they seem very different, an algorithm for one can also be used to solve the other.

[Wikipedia has a list of problems](https://en.wikipedia.org/wiki/List_of_NP-complete_problems) that have been discovered to be NP-complete. Some particularly interesting ones are:

- [Traveling salesman problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem)
- [Knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem)
- [Graph coloring](https://en.wikipedia.org/wiki/Graph_coloring#Vertex_coloring): given a set of nodes connected by edges, what's the minimum amount of colors we can use to paint nodes such that no two connected nodes are the same color?
- [Subset sum problem](https://en.wikipedia.org/wiki/Subset_sum_problem): given a set of positive integers and a target sum, does any subset of integers add to the target sum?
- [Various games and puzzles](https://en.wikipedia.org/wiki/List_of_NP-complete_problems#Games_and_puzzles)
- [Boolean Satisfiability/SAT](https://en.wikipedia.org/wiki/Boolean_satisfiability_problem): the first discovered NP-Complete problem, although a bit technical for this article.

If you are able to find a polynomial time (P) algorithm for any of the above problems, or prove that any one of them can't be solved in polynomial time, then congratulations! You have done what no mathematician could and solved the problem of P vs NP—and also are eligible to [redeem a million dollars](https://www.claymath.org/millennium-problems/) if you'd like and maybe send me a finder's fee. It seems like doing this should not be that hard (at least to me), however the inability of anyone to come up with any efficient algorithms or proof that none exists certainly speaks to the contrary. P vs NP continues to be a problem with a seemingly obvious answer and seemingly easy way of proving it that defies solving.
