---
layout: page
title: Nonlinear Programming
description: Optimization algorithms and implementation of nonlinear methods
img: https://placehold.co/600x400/00897b/ffffff?text=Optimization+Assignments
importance: 2
category: fun
github: https://github.com/ahmadrezafarvardin/NonlinearProgramming-CodingAssignments-UT
---

## Overview

A collection of coding assignments for the **Nonlinear Programming** course at the **University of Tehran**, focusing on implementing fundamental optimization algorithms from scratch.

## Assignments Breakdown

The course covered three main coding assignments:

### CA1: Least Squares & Regularization
*   **Polynomial Fitting:** Implementing least squares to fit polynomials to noisy data.
*   **Ridge Regression:** Analysis of L2 regularization effects on the `diabetes` dataset.
*   **Weighted Least Squares:** Experimenting with different weight distributions (Uniform, Multinomial, Dirichlet) on the `california_housing` dataset.

### CA2: Optimization Methods
Implementation and comparison of different descent algorithms on nonlinear functions like $$ f(x) = x_1^4 + 3x_2^2 + x_1x_2 $$:
*   **Gradient Descent:** With backtracking line search.
*   **Newton's Method:** Pure and damped Newton methods.
*   **Convergence Analysis:** Comparing iteration counts and convergence rates for different starting points ($$\alpha, \beta$$).

### CA3: GLMs & SVMs
*   **Gamma Regression:** Deriving and minimizing the Negative Log-Likelihood for Gamma distribution using:
    *   Convex Optimization (`cvxpy`)
    *   Manual Gradient Descent
    *   Manual Newton-Raphson
*   **Support Vector Machines (SVM):** Manual implementation using `cvxpy` vs `scikit-learn` for:
    *   Hard-Margin SVM
    *   Soft-Margin SVM
    *   Kernel SVM

## Technologies Used
*   **Python** (NumPy, Pandas)
*   **CVXPY** (Convex Optimization)
*   **SciPy / Statsmodels**
*   **Matplotlib**

## Note
The theoretical questions and problem statements are in **Persian**, but the code implementations and technical comments are in **English**.

## Code

All notebooks and PDF reports are available on [GitHub →](https://github.com/ahmadrezafarvardin/NonlinearProgramming-CodingAssignments-UT)