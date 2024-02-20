---
title: "Knuth-Morris-Pratt algorithm for O(N) substring search"
date: "2023-08-26"
completed: true
---

The [Knuth-Morris-Pratt substring algorithm](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm) is an algorithm
to check if a superstring `S` of length N contains a substring `W` (word)
in O(N) time. It does this by preprocessing the substring `W` to avoid
rechecking parts of string `S` we've already read. How does it do this?
Let's go over it, starting from a naive substring algorithm and
optimizing it to get to Knuth-Morris-Pratt.

## Naive substring algorithm

A naive/obvious substring algorithm is to check every possible
substring of `S` to see if it equals `W`. For example, take
superstring `S` "babababababababooie" and substring `W` "bababooie".
Our naive algorithm would check:

1. Does `S[0:9] == W`? No. (9 is the length of `W`)
2. Does `S[1:10] == W`? No.
3. Does `S[2:11] == W`? No.
4. ...

Until we get to the end of the string and find "bababooie".

This algorithm is inefficient, but it might not be obvious why.
To understand, let's break down what each step would be doing
more specifically.

### Inefficiency with repeated string equality checks.

To think about what a string equality check is doing, let's take our first step from above:

1. Does `S[0:9] == W`?

This would check

1. Does `S[0] (b) == W[0] (b)`? Yes!
2. Does `S[1] (a) == W[1] (a)`? Yes!
3. Does `S[2] (b) == W[2] (b)`? Yes!
4. Does `S[3] (a) == W[3] (a)`? Yes!
5. Does `S[4] (b) == W[4] (b)`? Yes!
6. Does `S[5] (a) == W[5] (o)`? No, stop.

This first check is completely efficient: there's no way we
can understand if the strings are equal without examining the
characters in them. It would be like reviewing a movie you
haven't even watched.

However, our second equality check

2. Does `S[1:10] == W`?

Is not efficient. **It is efficient in isolation, but not efficient given our previous check.** This check will, like the first one,
keep examining characters of `S` and `W` until a mismatch. However,
we should hopefully be able to avoid re-examining characters we
already looked at in step 1.

This would be like if you were
tasked with reviewing a movie trilogy. If you haven't seen any
of the movies, you would need to watch all three. However, if
you've already seen the first two, you shouldn't need to do a
rewatch and could just watch the third. Similarly here, **we can hope to optimize our algorithm by avoiding relooking at data.**

## How to take advantage of already looked at data.

To understand how to optimize by avoiding repeated checks, let's
look at steps 1 and 3. Reminder that our superstring `S` is "babababababababooie" and substring `W` is "bababooie"

1. Does `S[0:9] == W`?
2. Does `S[2:11] == W`?

For simplicity, let's say we will examine all of `W` beforehand.
After performing step 1, with sub steps:

1. Does `S[0] (b) == W[0] (b)`? Yes!
2. Does `S[1] (a) == W[1] (a)`? Yes!
3. Does `S[2] (b) == W[2] (b)`? Yes!
4. Does `S[3] (a) == W[3] (a)`? Yes!
5. Does `S[4] (b) == W[4] (b)`? Yes!
6. Does `S[5] (a) == W[5] (o)`? No, stop.

Our understanding of what `S` and `W` looks like is:

```py
S: "bababa????????????"
W: "bababooie"
```

Our naive algorithm would take all this info, throw it away, and
start looking at `S` again starting at index 1.

You may notice that, because our string is pretty repetitive, rather
than starting over, we could just shift our string `W` along `S`:

```py
S: "bababa????????????"
W: →→"bababooie"
```

and continue checking from index 6 in `S` rather than starting over.

In concrete terms, what we are doing is matching a
prefix of our substring `W` to a suffix of the part of superstring `S`
that we have already examined.

This is what Knuth-Morris-Pratt does and how it avoids doing repeated
checks. However, to actually execute this, we will preprocess `W` and compare parts of it to itself.

### Designing a structure to allow shifting `W` along `S`

While comparing the strings `W` and `S`, the part of `W` we have matched
with `S` is a prefix of `W`.

After failing a match, we can retain our progress by finding
a suffix of the part of `W` we have already matched that is
also a prefix of `W`:

```py
S: "bababa????????????"
      ↑↑↑
W: "babab"
      ↑↑↑
W:   "bababooie"
```

Finding this suffix would normally be time consuming, but if we
preprocess `W`, we can calculate and store, for each prefix `P1` of
W, the longest prefix `P2` of `W` such that `P2` is a suffix of `P1`.

Let's call this structure we create to store, for each prefix `P1` of
W, the longest prefix `P2` of `W` such that `P2` is a suffix of `P1`
a **prefix fallback**. We would like to "fallback" to a shorter
prefix of `W` rather than starting over from scratch when possible.
For "bababooie", we would want something like the following:

```py
prefix_fallback("bababooie", "b") = ""
prefix_fallback("bababooie", "ba") = ""
prefix_fallback("bababooie", "bab") = "b"
                 ↑              ↑
prefix_fallback("bababooie", "baba") = "ba"
                 ↑↑             ↑↑
prefix_fallback("bababooie", "babab") = "bab"
                 ↑↑↑            ↑↑↑
prefix_fallback("bababooie", "bababo") = ""
...
```

Then, when we mismatch between `S` and `W` when comparing characters, and currently have matched `P1` to some part
of `S`,
we can combine the facts that

1. Prefix `P1` matches/aligns with `S`.
2. `P2 = prefix_fallback(S, P1)` matches/aligns with `P1`.

to transitively align `P2` with `W` without needing to reexamine characters. Looking again at our example from earlier:

```py
P1 = "babab"
P2 = prefix_fallback("bababooie", "babab") = "bab"

S : "babab|a????????????"
       ↑↑↑
P1: "babab|ooie"
       ↑↑↑
P2:   "bab abooie"
```

## Generating a prefix fallback structure

Repeating what we've said earlier, our prefix fallback will store,
for each prefix `P1` of
`W`, the longest prefix `P2` of `W` such that `P2` is a suffix of `P1`.

We can define how to find a fallback for a prefix recursively. Let's take a generic prefix `P1` of `W` of length x+1, and split it into two
sections of length x and length 1: `P1=W[0:x]W[x]`. We can
determine the longest prefix `P2` that is a suffix of `P1` by looking
at the longest prefix that is a suffix of `W[0:x]` and seeing if it is
followed by `W[x]`.

### Storing indices instead of strings

As an optimization, instead of storing strings in our prefix
fallback, we can notice that every prefix of `W` can be identified
by its length. Instead of using strings to store prefixes,
just use their lengths instead. This also allows us to use
an array instead of a dictionary like structure.

```py
# For string "bababooie"
prefix_fallback[1] = 0 # "b" -> ""
prefix_fallback[2] = 0 # "ba" -> ""
prefix_fallback[3] = 1 # "bab" -> "b"
prefix_fallback[4] = 2 # "baba" -> "ba"
prefix_fallback[5] = 3 # "babab" -> "bab"
prefix_fallback[6] = 0 # "bababo" -> ""
...
```

### Building the prefix fallback structure iteratively

We generate our prefix fallback structure, now an array
mapping prefix lengths to fallback prefix lengths, iteratively,
starting from a prefix of length 1 and building up to the whole
string.

```py
def build_fallback_structure(w):
    fallback_length_by_prefix_length = [NO_FALLBACK_FOUND] * len(w)
    # The only suffix of a string of length 1 is a string of length 0.
    fallback_length_by_prefix_length[1] = 0

    for current_prefix_length in range(2, len(w)):
        char = w[current_prefix_length - 1]
        previous_prefix_length = current_prefix_length - 1
        fallback_prefix_length = fallback_length_by_prefix_length[
            previous_prefix_length
        ]

        while fallback_prefix_length != NO_FALLBACK_FOUND:
            char_after_fallback_prefix = w[fallback_prefix_length]
            if char_after_fallback_prefix == char:
                fallback_length_by_prefix_length[current_prefix_length] = (
                    fallback_prefix_length + 1
                )
                break
            fallback_prefix_length = fallback_length_by_prefix_length[
                fallback_prefix_length
            ]
        else:
            # If we fail to fall back to any prefix, we can use the prefix "", which
            # essentially represents starting from scratch again on the search.
            fallback_length_by_prefix_length[current_prefix_length] = 0

    return fallback_length_by_prefix_length
```

We can then precompute and store this array to check if
`W` is contained by a superstring `S` in linear time as described earlier.

```py
class KnuthMorrisPratt:
    def __init__(self, w: str):
        self.string = w
        # List matching each prefix p1 to the next longest prefix/fallback p2 that is
        # a suffix of p1.
        self._fallback_length_by_prefix_length = build_fallback_structure(w)

    def contained_by(self, s: str) -> bool:
        """Check if self.string is a substring of superstring."""
        current_matched_prefix_length = 0
        for superstring_char in s:
            while current_matched_prefix_length != NO_FALLBACK_FOUND:
                next_string_char = self.string[current_matched_prefix_length]
                if next_string_char == superstring_char:
                    current_matched_prefix_length += 1
                    break

                # Fall back to the next longest prefix that is a suffix of the current prefix.
                current_matched_prefix_length = self._fallback_length_by_prefix_length[
                    current_matched_prefix_length
                ]
            else:
                current_matched_prefix_length = 0

            if current_matched_prefix_length == len(self.string):
                return True

        return False
```

Code snippets are taken from [here](https://github.com/cmistrata/substring_structures/blob/main/knuth_morris_pratt.py). These code snippets above make up the entirety of the algorithm.
