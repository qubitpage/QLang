<div align="center">

<!-- QUBITPAGE LOGO BANNER -->
<img src="https://qubitpage.com/logo.png" alt="Qubitpage®" width="200"/>

# QLang
### The Quantum Programming Language by **[Qubitpage®](https://qubitpage.com)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![IBM Quantum](https://img.shields.io/badge/IBM%20Quantum-Native-6929c4.svg)](docs/ibm-native.md)
[![QuBIOS](https://img.shields.io/badge/QuBIOS-Powered-00d4ff.svg)](https://github.com/qubitpage/QuBIOS)
[![Status](https://img.shields.io/badge/Status-Production-00ffaa.svg)](https://qubitpage.com)
[![Version](https://img.shields.io/badge/Version-1.0.0-white.svg)](docs/language-spec.md)

**QLang** is a high-level quantum programming language purpose-built for real quantum hardware.  
Write circuits in human-readable syntax. Compile to QASM/Qiskit. Run on IBM Torino, Fez, Marrakesh (156 qubits).

---

---

## 🌐 Ecosystem

| Repository | Description | Status |
|------------|-------------|--------|
| **[QLang](https://github.com/qubitpage/QLang)** | ← This repo — Quantum Programming Language + Browser SDK | ✅ Live |
| **[QuBIOS](https://github.com/qubitpage/QuBIOS)** | Transit Ring quantum middleware engine | ✅ Live |
| **[QubitPage-OS](https://github.com/qubitpage/QubitPage-OS)** | Full Quantum OS Platform — IBM Quantum + MedGemma AI | ✅ Live |

---

**[🌐 qubitpage.com](https://qubitpage.com)** · **[📜 Language Spec](docs/language-spec.md)** · **[⚛️ IBM Native](docs/ibm-native.md)** · **[🔧 Install](INSTALL.md)** · **[💡 Examples](examples/)**

</div>

---

## What is QLang?

QLang is a **quantum-first scripting language** developed by Qubitpage® as part of the QuBIOS ecosystem. It abstracts raw gate-level programming into readable, composable quantum programs — while remaining fully transparent to the underlying circuit representation.

```qlang
# Bell State — two entangled qubits
ENTANGLE q0 q1
MEASURE q0 q1
EXPORT json
```

```qlang
# Grover Search Oracle — 3 qubits
ORACLE grover 3
OPTIMIZE circuit_depth
PLOT histogram
```

```qlang
# Quantum-Classical Hybrid Pipeline
VAR shots = 4096
CIRCUIT bell
  GATE H q0
  GATE CNOT q0 q1
  MEASURE q0 q1
BENCHMARK shots
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     QLang Toolchain                          │
│                                                             │
│   .ql source  ──►  Lexer/Tokenizer  ──►  AST Parser        │
│                                              │               │
│                                              ▼               │
│                                       Compile Target        │
│                                    ┌────────────────┐       │
│                                    │  Qiskit/QASM   │──►IBM │
│                                    │  Stim Circuits  │──►Sim│
│                                    │  QuBIOS Runtime │──►QEC│
│                                    └────────────────┘       │
│                                                             │
│   Browser: qbp-runtime.js  ◄──────  REST API  ◄───────────  │
└─────────────────────────────────────────────────────────────┘
```

---

## Language Features

### 🔤 Core Language

| Command | Syntax | Description |
|---------|--------|-------------|
| `VAR` | `VAR name = value` | Declare a quantum/classical variable |
| `PRINT` | `PRINT expr` | Output a value |
| `MATH` | `MATH expression` | Evaluate arithmetic/matrix expressions |
| `IF/THEN` | `IF cond THEN cmd` | Classical conditional |
| `LOOP` | `LOOP n CMD` | Repeat a command n times |
| `FUNCTION` | `FUNCTION name args` | Define reusable quantum subroutine |
| `PROGRAM` | `PROGRAM name` | Named quantum program block |
| `IMPORT` | `IMPORT module` | Import standard quantum library |
| `EXPORT` | `EXPORT format` | Export circuit/results (json, qasm, svg) |
| `HISTORY` | `HISTORY` | Show execution history |
| `BENCHMARK` | `BENCHMARK n` | Run n-shot benchmark |

### ⚛️ Quantum Operations

| Command | Syntax | Description |
|---------|--------|-------------|
| `ENTANGLE` | `ENTANGLE q0 q1` | Create Bell pair between qubits |
| `SUPERPOSE` | `SUPERPOSE q0` | Apply Hadamard (superposition) |
| `ORACLE` | `ORACLE type n` | Apply quantum oracle (grover, simon, deutsch) |
| `GATE` | `GATE name qubit [ctrl]` | Apply named quantum gate |
| `MEASURE` | `MEASURE q0 [q1...]` | Measure qubits, collapse state |
| `CIRCUIT` | `CIRCUIT type` | Load a named circuit template |
| `OPTIMIZE` | `OPTIMIZE target` | Optimize circuit (circuit_depth, t_count, swap_count) |

### 🔐 Cryptography

| Command | Syntax | Description |
|---------|--------|-------------|
| `ENCODE` | `ENCODE algo data` | Encode using quantum-safe algo (base64, sha256, qkd) |
| `DECODE` | `DECODE algo data` | Decode |
| `HASH` | `HASH algo data` | Quantum-resistant hash |
| `RANDOM` | `RANDOM min max` | Quantum random number (QRNG) |
| `ARRAY` | `ARRAY name [vals]` | Quantum register array |

---

## IBM Quantum Native Support

QLang compiles directly to circuits compatible with **IBM Quantum Platform** via Qiskit. No transpilation middleware required.

```qlang
# Direct IBM backend targeting
CIRCUIT bell
  GATE H q0
  GATE CNOT q0 q1
  MEASURE q0 q1

# Runs on IBM Torino (133q), Fez (156q), or Marrakesh (156q)
EXPORT ibm --backend ibm_torino --shots 4096
```

**Supported Backends:**

| Backend | Qubits | Architecture | Status |
|---------|--------|--------------|--------|
| `ibm_torino` | 133 | Heron r1 | ✅ Supported |
| `ibm_fez` | 156 | Heron r2 | ✅ Supported |
| `ibm_marrakesh` | 156 | Heron r2 | ✅ Supported |
| `ibm_brisbane` | 127 | Eagle r3 | ✅ Supported |
| `ibm_sherbrooke` | 127 | Eagle r3 | ✅ Supported |
| `aer_simulator` | ∞ | Classical Sim | ✅ Default |

See [IBM Native Guide →](docs/ibm-native.md)

---

## REST API

QLang ships with a production-grade REST API (Flask + Qiskit backend):

```bash
# Compile a QLang program
POST /api/qplang/compile
{"source": "ENTANGLE q0 q1\nMEASURE q0 q1"}

# Tokenize (lexer step only)
POST /api/qplang/tokenize
{"source": "VAR x = 42"}

# Execute a single command
POST /api/qplang/execute
{"command": "SUPERPOSE q0", "context": {}}
```

Response format:
```json
{
  "success": true,
  "tokens": [...],
  "circuit": "OPENQASM 2.0;\n...",
  "result": {"counts": {"00": 2048, "11": 2048}, "fidelity": 0.998}
}
```

---

## Browser Runtime

The `src/qlang_runtime.js` module provides a zero-dependency browser SDK:

```javascript
// Auto-initializes on DOMContentLoaded
// Run a circuit from an HTML editor element
QBP.runCircuit("my-circuit-id").then(data => {
  QBP.renderResult("results-div", data);
});

// Quantum simulation
QBP.simulate("bell", { shots: 1024 }).then(console.log);

// Quantum-safe encryption
QBP.encrypt("Hello quantum world").then(console.log);
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/qubitpage/QLang.git
cd QLang

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the QLang REPL
python src/qlang_repl.py

# 4. Or start the API server
python src/qlang_server.py --port 5050
```

See the full [Installation Guide →](INSTALL.md)

---

## Examples

| Example | Description |
|---------|-------------|
| [hello_quantum.ql](examples/hello_quantum.ql) | Your first QLang program |
| [bell_state.ql](examples/bell_state.ql) | Entangled Bell pair |
| [grover_search.ql](examples/grover_search.ql) | Grover's search algorithm |
| [ghz_state.ql](examples/ghz_state.ql) | GHZ 3-qubit entanglement |
| [vqe_molecule.ql](examples/vqe_molecule.ql) | VQE molecular binding energy |
| [qrng_dice.ql](examples/qrng_dice.ql) | Quantum random number generator |

---

## Build on Top of QLang

QLang is designed to be embedded and extended:

```python
from qlang import QLangKernel

kernel = QLangKernel()

# Compile
result = kernel.compile_qplang("ENTANGLE q0 q1\nMEASURE q0 q1")

# Execute command in context
ctx = {"shots": 4096, "backend": "aer_simulator"}
result = kernel.execute_qplang_command("SUPERPOSE q0", ctx)
```

### Extending with Custom Gates

```python
from qlang import GateRegistry

@GateRegistry.register("MY_GATE")
def my_custom_gate(circuit, qubit, **params):
    """Custom 2-cycle phase rotation."""
    circuit.rz(params.get("theta", 0.5), qubit)
    circuit.rx(params.get("phi", 0.25), qubit)
    return circuit
```

---

## Layer Architecture

```
QLang Application Layer
    │
    ├── QLang Source (.ql)
    │       │
    │       ▼
    ├── Lexer → Tokenizer → AST
    │       │
    │       ▼
    ├── Compiler (Qiskit / QASM / Stim)
    │       │
    │       ├── → IBM Quantum Hardware (Native)
    │       ├── → Aer Simulator (Fast local)
    │       └── → QuBIOS Buffer Layer (QEC + Escorts)
    │
    └── Results → JSON / Histogram / QASM export
```

---

## Powered by QuBIOS

QLang integrates natively with **[QuBIOS](https://github.com/qubitpage/QuBIOS)** — Qubitpage's quantum BIOS layer that provides:
- 🧠 **Steane [[7,1,3]] QEC** — error correction at the circuit level
- 👥 **Virtual Qubit Escorts** — Bell-paired bodyguards per computation qubit
- 🔄 **Transit Ring** — clockwise relay of QEC blocks for long-term state storage
- 📡 **Entanglement Distillation** — BBPSSW protocol for high-fidelity Bell pairs

```
QLang Program
      │
      ▼
 QuBIOS Layer ──► EscortQubVirt ──► SteaneQEC ──► Stim Circuits
      │
      └──► TransitRing ──► TeleportEngine ──► IBM Hardware
```

---

## License

MIT License — see [LICENSE](LICENSE)

Built with ❤️ by **[Qubitpage®](https://qubitpage.com)**  
© 2026 Qubitpage®. All rights reserved.

---

<div align="center">
<strong><a href="https://qubitpage.com">🌐 qubitpage.com</a></strong> · 
<strong><a href="https://github.com/qubitpage/QuBIOS">⚛️ QuBIOS Framework</a></strong> · 
<strong><a href="https://github.com/qubitpage/QLang">📦 QLang</a></strong>
<br/><br/>
<em>Qubitpage® — Quantum Computing for the Real World</em>
</div>
