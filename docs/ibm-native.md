# QLang — IBM Quantum Native Support
### Qubitpage® | [🌐 qubitpage.com](https://qubitpage.com)

---

QLang compiles directly to circuits compatible with **IBM Quantum Platform** via Qiskit. No middleware, no transpilation overhead beyond Qiskit's native passes.

---

## Supported IBM Backends

| Backend | Qubits | Architecture | Topology | Status |
|---------|--------|--------------|----------|--------|
| `ibm_torino` | 133 | Heron r1 | Heavy-hex | ✅ Native |
| `ibm_fez` | 156 | Heron r2 | Heavy-hex | ✅ Native |
| `ibm_marrakesh` | 156 | Heron r2 | Heavy-hex | ✅ Native |
| `ibm_brisbane` | 127 | Eagle r3 | Heavy-hex | ✅ Native |
| `ibm_sherbrooke` | 127 | Eagle r3 | Heavy-hex | ✅ Native |
| `aer_simulator` | ∞ | Classical | N/A | ✅ Default (free) |

---

## Native Gate Set

IBM Heron r2 basis gates used by the QLang compiler:

```
cz, delay, for_loop, id, if_else, measure, reset,
rz, switch_case, sx, x
```

QLang transparently decomposes higher-level gates (H, CNOT, SWAP, etc.) into the native gate set at compile time.

---

## Submitting to IBM Hardware

### Step 1: Configure your IBM API Token

```bash
# Set as environment variable (never hardcode in source)
export IBM_QUANTUM_TOKEN="your-token-here"
```

Or set it in the QLang server config:
```python
# config.py
IBM_QUANTUM_TOKEN = os.environ.get("IBM_QUANTUM_TOKEN", "")
```

Get your token at: **https://quantum.ibm.com**

### Step 2: Use the EXPORT IBM command

```qlang
CIRCUIT bell
  GATE H q0
  GATE CNOT q0 q1
  MEASURE q0 q1

# Submit to IBM Torino with 4096 shots
EXPORT ibm --backend ibm_torino --shots 4096
```

### Step 3: Via Python API

```python
from qlang import QLangKernel
import os

kernel = QLangKernel(ibm_token=os.environ["IBM_QUANTUM_TOKEN"])

result = kernel.execute_qplang_command(
    command="EXPORT ibm",
    context={
        "circuit": "bell",
        "backend": "ibm_fez",
        "shots": 4096,
    }
)
print(result)
```

---

## Noise-Aware Compilation

QLang uses IBM's real calibration data to optimize circuits for the target backend's error profile:

```qlang
# Topology-aware compilation: minimize SWAP gates
# for IBM heavy-hex lattice
CIRCUIT ghz5
OPTIMIZE swap_count --backend ibm_torino

# T-count optimization for fault-tolerant execution
CIRCUIT grover 5
OPTIMIZE t_count
```

---

## IBM Real Calibration Data

QLang integrates IBM Fez (156q) real noise calibration via FakeFez + AerSimulator. This provides realistic shot-by-shot noise simulation **before** submitting to real hardware:

| Parameter | IBM Fez (Heron r2) |
|-----------|-------------------|
| 1-qubit error rate | ~0.001 (0.1%) |
| 2-qubit (CZ) error rate | ~0.005 (0.5%) |
| T1 (relaxation time) | ~300 μs |
| T2 (dephasing time) | ~200 μs |
| Readout error | ~1–2% |

Example VQE result on IBM Fez noise model:
```json
{
  "drug": "Lecanemab",
  "target": "Aβ42",
  "backend": "ibm_fez",
  "circuit_qubits": 6,
  "shots": 2048,
  "binding_energy_kcal": -16.23,
  "quantum_noise_sigma": 1.19
}
```

---

## IBM Runtime Service Integration

```python
# Low-level IBM Runtime access via QLang kernel
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
import os

service = QiskitRuntimeService(
    channel="ibm_quantum_platform",
    token=os.environ["IBM_QUANTUM_TOKEN"]
)

backend = service.backend("ibm_fez")
# QLang kernel uses this backend for EXPORT ibm commands
```

---

## Circuit Cutting for Large Circuits

When a circuit requires more qubits than available on one backend, QLang uses **QuBIOS CircuitCutter** to split and reconstruct:

```qlang
# 40-qubit circuit on 27-qubit system
CIRCUIT large_vqe 40
OPTIMIZE circuit_cut --max-qubits 27
EXPORT ibm --backend ibm_sherbrooke
```

---

<div align="center">
<strong><a href="https://qubitpage.com">🌐 Qubitpage®</a></strong> · 
<strong><a href="https://github.com/qubitpage/QuBIOS">⚛️ QuBIOS Framework</a></strong>
<br/><em>© 2026 Qubitpage®</em>
</div>
