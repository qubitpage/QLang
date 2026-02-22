# Grover Search Algorithm — QLang Example
# Qubitpage® | https://qubitpage.com
#
# Grover's algorithm provides quadratic speedup for unstructured search.
# For N items: classical O(N), quantum O(√N).

VERSION

# 3-qubit Grover search (searching 8 items, oracle marks 1 item)
# Apply uniform superposition
SUPERPOSE q0
SUPERPOSE q1
SUPERPOSE q2

# Apply Grover oracle (marks the target state)
ORACLE grover 3

# Optimize circuit before running
OPTIMIZE circuit_depth

# Run with 4096 shots — target state should appear ~1000x more than others
BENCHMARK 4096
PLOT histogram
EXPORT json

# The marked state will have probability ≈ (2*sin(θ))² → amplified
# Other states are suppressed
