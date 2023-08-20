---
title: "P versus NP"
date: "2023-01-24"
---

[P versus NP](https://en.wikipedia.org/wiki/P_versus_NP_problem) is one of the, if not the, greatest unsolved problems in mathematics. It questions whether the `NP` and `P` complexity classes are the same. What does this mean? Let's go over it step by step, starting from basics.

## What's an algorithm?

An **algorithm** is an outlined way of solving a problem. You can think of it as a step by step process that you (or usually a computer) can follow to find a solution to a problem.

For example, say you want to sort a deck of `N` cards with unique values. A simple algorithm for this problem is the following:

1. Search the deck for the smallest card.
2. Put that card on top of a new sorted deck.
3. Go back to step `1` until there are no cards left in the original deck.

Algorithms today are mostly in the context of code, which makes sense as computers are able to follow rigorous steps much more quickly and reliably than people. However, you might have some algorithms you follow yourself when solving problems, for exmaple sorting a deck like above, long division, and the [wall follower](https://en.wikipedia.org/wiki/Maze-solving_algorithm#Wall_follower) maze strategy are all examples of algorithms.

## Time complexity

Different algorithms take different amounts of time to run. The **time complexity** of an algorithm describes how long it takes based on how large the instance of a problem is. For

Computer scientists are often particularly interested in the **worst case time complexity** of an algorithm -- that is, how long it takes to run it based on the worst/unluckiest possible input.

For example, given the problem again to sort a deck of cards, say each time we search the deck for the smallest card we stop searching if we find a card with value exactly 1 greater than the card at the top of our sorted deck. For example, if the top card our sorted deck is a `2`, and we find a `3` in the original deck, we know this is the next card and can stop searching.

A particularly difficult input to this problem, and the one we'd use to determine the worst case time complexity, is a deck of cards that is in reverse order; each time we search the deck, we have to go through the entire deck to find the next smallest card!

### Big O notation

The worst case time complexity of an algorithm is usually expressed in [Big-O notation](https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/big-o-notation). This is shown as `O(f(N))`, where N is the size of the problem input. Our algorithm to sort cards would be `O(N`<sup>`2`</sup>`)`: we have to search a deck of `N` cards to get the smallest card `N` times. As another example, finding the smallest card in a deck would be `O(N)`: look at every card and keep track of the smallest.

For sorting, in actuality the size of the deck decreases each time we search it, meaning on average we're only searching a deck of `N/2` cards. However, big O notation doesn't care about coefficients like `1/2`, and we basically round `N/2` up to `N` in the expression of the complexity.

## Time complexity classes

It turns out we can use time complexity to group many seemingly very different problems by how long algorithms for them take to run into **time complexity classes**.

As a simple example, **linear complexity**, expressed as `O(N)`, is a time complexity class grouping problems with algorithms that take time to run directly proportional to the size of the input. These are usually algorithms that just need to look over all the input once. For example, finding the smallest card in a deck of `N` cards by searching all the cards, or finding a matching sock during laundry by searching `N` other socks would be problems and algorithms with linear complexity.

## P and NP time complexity classes

`P` and `NP` are both time complexity classes that describe how _easy_ (provide an upper bound on run time but not lower bound) a problem is to do.

### P (polynomial time) complexity

`P` is short for **polynomial time** (or sometimes described as **determenistic polynomial time**). Polynomial time describes problems with algorithms that take at most exponential (`N`<sup>`c`</supp> where c is a constant) amount of time to run. Harder problems in this category can often be solved by trying combinations of input elements with a constant size. For example, say you have a list of `N` numbers, and you want to find 3 numbers in the list that add up to 17. You could check every combination of 3 numbers in the list (`N`<sup>`3`</sup> combinations) until you find a combination that adds to 17, putting this problem in `P` time.

### NP (non-deterministic polynomial time)

`NP` is short for **non-deterministic polynomial time** (and _not_ "not polynomial time" which you might guess). These are problems that can be solved in polynomial time by a [non-deterministic Turing machine](https://en.wikipedia.org/wiki/Nondeterministic_Turing_machine).

A non-deterministic Turing machine is a computer that can explore multiple solutions simultaneously, but it's easiest to think about it as someone running an algorithm that always gets as lucky as possible. Consequentially, you can think of `NP` problems that can be solved in polynomial time as long as you're as lucky as possible when running the algorithm.

For example, say you want to find a route through a maze. You might naively try to solve this by [following the right wall](https://en.wikipedia.org/wiki/Maze-solving_algorithm#Wall_follower) until you reach the exit. However, a non-deterministic solver with luck on their side would just pick the correct turn whenver confronted with a branching path, getting through the maze on their first try!

Take the problem from earlier about finding three numbers in a list that add to 17. A non-determintic solver would just pick three numbers from the list, and because they're lucky they end up being the right three numbers!

However, no matter how lucky you are, you still need to verify the solution you come up with is correct. In fact, this ends up becoming really the only time you need to spend solving any problem.

So equivalently and more simply, NP describes problems with solutions that can be verified in polynomial time. For our 3-sum problem, this would be the time it takes to add 3 numbers.

### P versus NP

`P versus NP` asks if the `P` and `NP` time complexity classes are the same. In other words, if you can verify the solution to a problem in polynomial time, can you also necessarily find a solution in polynomial time?

The obvious answer to this question might seem like no -- after all, finding the answer to a problem is much harder than checking if it's correct. And most mathemeticians and computer scientists believe the answer is probably no -- but none of them have been able to prove it either way!

Even more bafflingly, there's a pretty clear outline of how you could prove if P equals or doesn't equal NP, detailed below

## Reductions and proving if P = NP

We can compare the difficulty of 2 types of problems by checking if an instance of the first problem type can be **reduced** to an instance of the second type, meaning we can phrase the first problem as the second one.

For example, take the following two problems

1. Sort a deck of cards with unique values.
2. Sort a deck of cards that may have repeated values.

Problem 1 can be reduced to problem 2; given a deck of unique cards, we can just act like we don't know if our deck has repeated cards in it. However, problem 2 is not reducable to problem 1. We can't just ignore the fact that our deck can have repeated values, and an algorithm for the first problem--including our algorithm from earlier--might fail on an instance of the second.

Because we can reduce an instance of problem 1 to problem 2, we can say problem 2 is at least as hard than problem 1.

We use this concept of reductability--being able to reduce one problem type into another--to compare the difficulty of problems. And to prove if P = NP, theoretically you could

1. Find the hardest problem in NP.
2. Prove that the problem can or can't be solved in polynomial time.

And surprisingly, we have found the hardest problem in NP! In fact, we have found a whole set of problems that are equally hardest. However, no one has been able to prove if any of these problems do or don't have a polynomial time algorithm.

### NP-hard and NP-complete

Unlike P and NP, **NP-hard** describes how difficult a problem is. It describes problems that are at least as difficult (take as long or longer to solve) as every other problem in **NP**. These probelms are not necessarily in **NP** themselves.

**NP-complete** describes problems that are **NP-hard** and also in **NP**--i.e. they are the hardest **NP** problems.
