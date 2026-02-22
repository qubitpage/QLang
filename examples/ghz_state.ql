# GHZ State — 3-Qubit Greenberger-Horne-Zeilinger
# Qubitpage® | https://qubitpage.com
#
# The GHZ state |GHZ⟩ = (|000⟩ + |111⟩)/√2 is a 3-party entangled state.
# Used in quantum secret sharing, quantum error correction, and
# tests of quantum non-locality (Bell inequality violations).

VERSION

# Method 1: Circuit template
CIRCUIT ghz3
BENCHMARK 4096
# Expected: counts ≈ {"000": 2048, "111": 2048}
PLOT histogram

CLEAR

# Method 2: Manual construction
GATE H q0          # q0 → |+⟩
GATE CNOT q0 q1    # q1 entangled with q0
GATE CNOT q0 q2    # q2 entangled with q0
MEASURE q0 q1 q2

BENCHMARK 4096
EXPORT json

# 5-qubit GHZ (for larger entanglement verification)
CLEAR
CIRCUIT ghz5
BENCHMARK 4096
PLOT histogram
EXPORT qasm
