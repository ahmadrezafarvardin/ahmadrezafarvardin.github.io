---
title: Data Structures coursework
short: A linked-list music player and five graph and range-query problems in C++17.
summary: C++ assignments for the Data Structures and Algorithms course at the University of Tehran.
kind: Coursework
group: coursework
github: https://github.com/ahmadrezafarvardin/DataStructure-UT
stack: C++17 · Make · GDB
---

**CA1: music player.** A playlist on a circular doubly linked list, with playback controls (play, pause, next, previous) built using the State pattern.

**CA2: graph and query problems.** Five competitive-programming-style problems, each in its own folder, compiled with `g++ -std=gnu++17 -O2`:

| | Problem | Technique |
|---|---|---|
| Q1 | Bottleneck path queries | Maximum spanning tree (Kruskal + DSU), then LCA with binary lifting |
| Q2 | Shortest path with limited fuel | Dijkstra allowing a single refuelling stop |
| Q3 | Shortest path with traffic lights | Dijkstra with waiting times at each light |
| Q4 | Fuel stations and traffic lights | Dijkstra over an extended state that tracks station visits |
| Q5 | Dynamic insertions and range counts | Fenwick tree + coordinate compression |
