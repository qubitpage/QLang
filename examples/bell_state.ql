# Bell State — Maximum Quantum Entanglement
# Qubitpage® | https://qubitpage.com
#
# Creates the maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
# When measured, both qubits ALWAYS agree: both 0 or both 1.
# This is the foundation of quantum teleportation and QKD.

VERSION

# Method 1: High-level command
ENTANGLE q0 q1

BENCHMARK 4096
# Expected: counts ≈ {"00": 2048, "11": 2048}, fidelity > 0.99

EXPORT json

# Method 2: Explicit gate sequence (equivalent)
CLEAR
GATE H q0        # Hadamard → superposition
GATE CNOT q0 q1  # Entangle q1 with q0

MEASURE q0 q1
BENCHMARK 4096
PLOT histogram
