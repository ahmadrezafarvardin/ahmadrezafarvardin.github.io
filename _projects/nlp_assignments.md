---
title: Nonlinear Programming coursework
short: Least squares, gradient descent, Newton's method, Gamma regression and SVMs, written by hand.
summary: Coding assignments for the Nonlinear Programming course at the University of Tehran.
kind: Coursework
group: coursework
year: 2024
math: true
github: https://github.com/ahmadrezafarvardin/NonlinearProgramming-CodingAssignments-UT
stack: NumPy · CVXPY · SciPy · statsmodels
---

**Least squares and regularisation.** Choosing polynomial degrees to fit two noisy datasets; ridge regression on `diabetes`, tracing how λ changes the solution compared with plain least squares, plus a short study of lasso and elastic net; and weighted least squares on `california_housing` with uniform, multinomial and Dirichlet weights, compared over 100 runs.

**Descent methods.** Gradient descent with backtracking line search, plus pure and damped Newton, compared on functions such as $$f(x) = x_1^4 + 3x_2^2 + x_1x_2$$ across starting points and line-search parameters $$\alpha, \beta$$. Then the same two methods on polynomial regression, with the gradient and Hessian of the MSE derived by hand.

**GLMs and SVMs.** Gamma regression, minimising the negative log-likelihood three ways (CVXPY, hand-written gradient descent, hand-written Newton–Raphson), checked against statsmodels and evaluated with 10-fold cross-validation. Then hard-margin, soft-margin and kernel SVMs set up as CVXPY problems and checked against scikit-learn on precision, recall, F1 and accuracy.

Problem statements are in Persian; code is in English.
