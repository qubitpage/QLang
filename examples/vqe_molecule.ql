# VQE — Variational Quantum Eigensolver for Molecular Binding
# Qubitpage® | https://qubitpage.com
#
# VQE is a quantum-classical hybrid algorithm that estimates ground state
# energies of molecular systems. Used in drug discovery and materials science.
#
# Real results from IBM Fez (156q) calibration:
#   Lecanemab vs Aβ42: ΔG = -16.23 kcal/mol
#   BTZ-043 vs DprE1:  ΔG = -18.4  kcal/mol (covalent)

VERSION

IMPORT chemistry

# H₂ molecule — simplest VQE case (2 qubits, 4 parameters)
# VQE finds ground state energy E₀ = -1.137 Hartree
CIRCUIT vqe_h2
OPTIMIZE circuit_depth
BENCHMARK 2048
EXPORT json

# Drug-target binding energy (6-qubit circuit)
# This is what Qubitpage® uses for drug discovery
VAR smiles = "CC1=C(c2ccc(Cl)cc2)N=C(N)N1"  # BTZ-Cl candidate
VAR target = "DprE1_Cys387"
VAR shots = 2048

# The QuantumTB pipeline uses this internally:
CIRCUIT vqe_binding
BENCHMARK shots
EXPORT json
# Result includes: eigenvalue_raw, binding_energy_kcal, quantum_noise_sigma
