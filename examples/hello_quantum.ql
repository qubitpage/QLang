# Hello Quantum World — QLang Example
# Qubitpage® | https://qubitpage.com
# Run: Submit to the QLang REPL or API

VERSION

# A simple variable
VAR message = "Hello from Qubitpage® QLang!"
PRINT message

# Quantum coin flip — 0 or 1 from real quantum randomness
RANDOM 0 1

# Put qubit 0 in superposition (50/50 quantum state)
SUPERPOSE q0

# Measure — collapses to 0 or 1 probabilistically
MEASURE q0

PRINT "Done. Welcome to quantum computing."
