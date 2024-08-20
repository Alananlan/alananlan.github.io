---
title: "Distributed KV-Store"
category: "Projects"
date: "10-01-2023"
---
# Distributed KV-Store

This was a project from the University of Washington's CSE 452, Distributed Systems course. Scott and I built a linerizable key/value database storage system in Java that "shards" (partitions) the keys over a set of replica groups and handles cross-group transactions, similar to DynamoDB. Unfortunately, we are not able to share the code publicly, but I will go over some of the key difficulties encountered while doing this project.

## Why it was so difficult
Distributed systems are notoriously difficult because:
- They are hard to plan ahead for
- They are hard to get correct
- They are hard to debug

Any newcoming programmer like Scott and I were to this field will be hit hard with the relentless wrath that is distributed systems.

## How long did we spend
We spent upwards of 30+ hours each doing these labs. The majority of the time taken to complete these was not the coding itself, but writing up the design document, and debugging.

## Key takeaways
Do not procrastinate.
Start early.
Think carefully before implementation.