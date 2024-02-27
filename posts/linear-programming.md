---
title: "Linear Programming"
date: "2023-12-20"
completed: false
---

[Linear programming](https://en.wikipedia.org/wiki/Linear_programming) is an algorithm that solves the broad problem of optimizing some output given a set of linear constraints.

# ToC

# Brewer's problem

[Brewer's problem](https://www.cs.princeton.edu/courses/archive/spring07/cos226/lectures/22LinearProgramming.pdf) is an example of one that can be solved using linear programming. It asks, given a limited amount of ingredients (corn, hops, and malt), and different types of drinks that use those ingredients and sell for different prices (ale and beer), what combination of ale and beer can you produce to make the most money given the ingredients you have?

## Example problem and background terms

As an example, take the following table listing the recipes and selling prices of two drinks:

| Drink | Corn | Hops | Malt | **Selling price** |
| ----- | ---- | ---- | ---- | ----------------- |
| Beer  | 2    | 1    | 1    | **1**             |
| Ale   | 1    | 3    | 2    | **2**             |

Linear programming could tell you what combination of beer and ale to produce to maximize the price it sells for given a limited amount of ingredients.

### Constraints

Say you have:

```
3 corn
4 hops
5 malt
```

The **constraints** in this problem, given the amount of ingredients we have and how much ingredients **B**eer and **A**le take, would be the following:

```
Corn: 2B + 1A <= 3
Hops: 1B + 3A <= 4
Malt: 5B + 2A <= 5
```

Each constraint makes sure we don't use more of any ingredient than we have.
Additionally, we also constrain on producing a nonnegative amount either drink:

```
B >= 0
A >= 0
```

### Feasibility

In Brewer's problem, a **solution** would consist of the amount of beer and ale you want to produce. A **feasible solution** is one that
satisfies our constraints.

For example, some feasible solutions for this problem:

**1 beer, 1 ale**: uses 3 corn, 4 hops, 3 malt  
**0 beer, 0 ale**: uses no ingredients

and some infeasible solutions:

**-1 beer, 0 ale**: we can't produce negative of a drink  
**4 beer, 0 ale**: uses 8 corn, more than the 4 we have

The set of feasible solutions for a problem is called the **zone of feasibilty**.

### Optimality function

The **optimality function** for a problem describes the value
of solution -- in this case, the amount of money we make.

```
profit = 1B + 2A
```

## What does "linear" mean?

"Linear" in math describes an equation where variables have only
constant coefficients:

Linear: 10 = 5b + 2c  
Linear: 8 ≥ b + 0.5c  
Not linear 4 = b<sup>2</sup> + c  
Not linear: 5 = log(b)

Our example problem is linear as the amount of ingredients used and the profit we make scales linearly with the amount of drinks produced, allowing us to express each part of the problem as a [linear expression](https://www.cuemath.com/algebra/linear-equations/). If something funky happened like the profit per drink going down with higher production maybe you satisfy all the demand for beer, linear programming would not be applicable.

Knowing a problem is linear makes it easier to solve. Linear constraints
end up forming a zone of feasibility (set of solutions) that is a convex polygon (polygon without any inward pointing edges) that we can
navigate through linear programming to find an optimal solution.

## Skateboarding to a solution

### Brewer's problem as a skating rink

To illustrate how linear programming works, imagine you
are a skateboarder trying to find the solution. In this scenario,
an inclined hill will represent the solution space, with
the incline of the hill representing the optimality function.
Lower down represents more optimal/profitable solutions. We will
let gravity naturally take us down hill to get to the solution.

IMAGE NEEDED

Ideally we would skate down hill forever and make infinite money.
However, each of our constraints sections our hill into a feasible
section of solutions and an infeasible section:

IMAGE NEEDED

Because each of our constraints are linear and divide our solution space
using straight lines, they combine
to section our hill into a convex polygon of feasible solutions.

IMAGE NEEDED

Linear constraints will always lead to a feasibility zone that is either a single convex polygon or empty: you can understand why this is by attempting
to come up with a set of linear constraints that form a non convex
polygon or multiple polygons (it's impossible).

### Skating our way to the solution

To find an optimal solution, we will use as a starting off point
a solution on any of the corners of the polygon. We will
start at (0A, 0B) as it is an easy corner to come up with.

IMAGE NEEDED

From our starting point, we will travel downhill along edges
until we land at the lowest corner.

IMAGE NEEDED

Each step of our process will involve the following

1. Pick an edge we are holding onto that we can push off of
   to go downhill. 1. If we can push multiple ways to go downhill, we
   can choose either direction arbitrarily, assured we are still
   traveling downhill towards a more optimal solution.
2. Figure out which vertex we will land at after pushing.
3. Push off the edge and land at the new vertex.

We continue to do the above until we can no longer travel
downhill by pushing off of an edge, which will only happen
after arriving at the optimal solution.

Our process then is the following:

1. Pick an initial vertex of the zone of feasibility to start at.
2. Continue to do the following as long as you can travel downhill:
   1. Pick an edge that we can push downhill off of.
   2. Figure out where we will land after pushing off.
   3. Push off the edge and land at the new vertex.
3. Return the final vertex we have landed at as the solution.

### Formalizing our skating through matrices

Given our skating process, we will try to formalize it using
an actual algorithm.

#### Creating variables to represent leftover ingredients

Currently, our constraints are described as inequalities:

```
Corn: 2B + 1A <= 3
Hops: 1B + 3A <= 4
Malt: 1B + 2A <= 5
B >= 0
A >= 0
```

We want to describe our constraints as a system of linear equations.
This will allow us to use elimination to solve things, very similar
to [solving a system of linear equations using elimination](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:systems-of-equations/x2f8bb11595b61c86:solving-systems-elimination/a/elimination-method-review) as you may
have done in algebra class.

We will introduce new variables representing
how much of each ingredient we have leftover to do this. We then redescribe
our ingredient constraints using these variables. The entire
formulation of our problem now looks like the following:

```
Equalities
----------
Corn: 2B + 1A + leftover corn = 3
Hops: 1B + 3A + leftover hops = 4
Malt: 1B + 2A + leftover malt = 5

Constraints
-----------
A >= 0
B >= 0
leftover corn (LC) >= 0
leftover hops (LH) >= 0
leftover malt (LM) >= 0

Optimality function
-------------------
1B + 2A = profit
```

Each of our constraints now is a much simpler inequality. Additionally,
each variable now represents the distance from one of the edges
of the feasibility zone. Because each corner is a point that is directly on
two of the edges/constraints, this will mean we can choose a solution
at one of the corners by setting two variables to 0.

#### Formatting as a system of equations

For solving the problem, we will focus on the equations, giving
us the following

```
System of equations
-------------------
1A + 2B + LC = 3
3A + 1B + LH = 4
2A + 1B + LM = 5

Optimality function
-------------------
2A + 1B = profit
```

To facilitate [solving by elimination](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:systems-of-equations/x2f8bb11595b61c86:solving-systems-elimination/a/elimination-method-review), we give each
variable its own column

```
System of equations
-------------------
1A + 2B + 1LC + 0LH + 0LM = 3
3A + 1B + 0LC + 1LH + 0LM = 4
2A + 1B + 0LC + 0LH + 1LM = 5

Optimality function
-------------------
2A + 1B + 0LC + 0LH + 0LM = profit
```

#### Reducing many solutions to a single one

As it stands, our system of equations has several solutions.
This is because we have more variables than equations. To illustrate
this, take the very simple equation:

```
x = 2
```

This has a only one solution (if you can even call it one)
of x being 2. However, if we introduce another variable

```
x + y + z = 2
```

Now there are a lot of solutions: (x=2, y=0, z=0), (x=1, y=1, z=0), (x=.5, y=1, z=.5), so on.

To simplify things, we can set some variables to zero so that there is
only one solution. For example, if we say x and y are 0, then we have again

```
x + 0 + 0 = 2
```

And it becomes easy to see the single solution of x = 2. We call the variables we set to 0 **basic variables**, resulting in a solution consisting of non-zero values for the
**nonbasic** variables. Our goal is
to make the number of nonbasic variables the same as the number
of equations: this will ensure there is only one solution.

### Step 1: picking an initial corner

For our Brewer's problem instance:

```
1A + 2B + 1LC + 0LH + 0LM = 3
3A + 1B + 0LC + 1LH + 0LM = 4
2A + 1B + 0LC + 0LH + 1LM = 5
```

We need to zero out 2 variables so we have 3 remaining variables = 3 remaining equations. This will give a single solution to start at. Zeroing A and B gives us a very obvious solution, so we will start with zeroing those (although you could zero out others if you want).

```
(1A) + (2B) + 1LC + 0LH + 0LM = 3
(1A) + (1B) + 0LC + 1LH + 0LM = 4
(2A) + (1B) + 0LC + 0LH + 1LM = 5

Nonbasic variables: LC = 3, LH = 4, LM = 5
Basic variables: A = 0, B = 0
```

Great, we have a solution! However, the issue with this solution
is it is not optimal.

#### Step 2.1: Finding an edge to push off of

Looking at our optimality function

```
2A + 1B + 0LC + 0LH + 0LM = profit
```

We would rather not zero out the ale and beer we produce as
they contribute to our profit. It would be better to zero out something
like leftover corn, which doesn't make us any money. To move
towards a more optimal solution, we look at the optimality function to
find a variable with a positive coefficient, indicating it would
be more profitable to not be 0. We can choose
either A or B now, but let's arbitrarily choose A.

#### Step 2.2: Figuring out where we will land

Now we know we'd like A to not be 0, i.e. we'd like to make it nonbasic.
To do this, we need to exchange it with an existing nonbasic variable
so that the number of nonbasic variables remains equal to the
number of equations.

Finding the nonbasic variable we will swap with A is equivalent
to finding the equation we will keep A in. Because all of our
variables must be positive, we need to find the equation that keeps
the right side of our systems of equations positive after doing elimination.

Looking at our system

```
[1A] + [2B] + 1LC + 0LH + 0LM = 3
[1A] + [1B] + 0LC + 1LH + 0LM = 4
[2A] + [1B] + 0LC + 0LH + 1LM = 5
```

This occurs with the third equation. We figure this out by
seeing it has the smallest proportion of right side (5) to coefficient of A (2) of 5/2, compared to (3/1 = 3) and (4/1 = 4) for the first two equations. Consequently, LC is the variable we want to make 0 in exchange for A.

#### Step 2.3: Moving to the new corner

Now that we have the variable we want to make non-0 (A), and the
equation we want it be non-0 in, we can use elimination to simplify our equation

Equation 3

```
([2A] + [1B] + 0LC + 0LH + 1LM = 5) / 2
___________________________________________
 1A  + [.5B] + 0LC  +0LH + [.5LM] = 2.5
```

Equation 1

```
   [1A] + [2B] + 1LC + 0LH + 0LM  = 3
-  1A   + [.5B] + 0LC  +0LH + [.5LM] = 2.5
___________________________________________
   0A  + [1.5B] + 1LC + 0LH + [-.5LM] = .5
```

Equation 2

```
  [1A] + [1B] + 0LC + 1LH + 0LM = 4
- 1A   + [.5B] + 0LC  +0LH + [.5LM] = 2.5
___________________________________________
  0A  + [.5B] +  0LC + 1LH + [-.5LM] = .5
```

Resulting system with nonbasic A and basic LM:

```
0A  + [1.5B] + 1LC + 0LH + [-.5LM] = .5
0A  + [.5B] +  0LC + 1LH + [-.5LM] = .5
1A  + [.5B] + 0LC  +0LH + [.5LM] = 2.5
```

To help us figure out where to go next, we also restate
our optimality function

```
  [2A] + [1B] + 0LC + 0LH + 0LM = profit
- [2A] + [1B] + 0LC + 0LH + 1LM = 5
___________________________________
whatever
```

Now, we are set up to continue finding and pushing off of edges.

### Step 3: returning the solution

Eventually, we reach a form of the optimality function where
none of the variables in the basis are contributing to the profit:

SOMETHING NEEDED

This represents us being at the optimal solution: we can
return the current solution to the equation.
