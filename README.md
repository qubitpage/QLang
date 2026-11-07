<div align="center">

<img src="docs/logo.png" alt="Qubitpage®" width="220" />

[![lablab.ai 1st Place](https://img.shields.io/badge/🥇_1ST_PLACE-lablab.ai_AI_Meets_Robotics_2026-FFD700?style=for-the-badge&labelColor=1a1a2e)](https://lablab.ai/ai-hackathons/launch-fund-ai-meets-robotics)

# QLang
### A beginner-friendly quantum command language, by **[Qubitpage®](https://qubitpage.com)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Educational-orange.svg)](#project-status)

</div>

---

## What is QLang?

QLang is a simple, line-by-line **command language for learning quantum computing**. You type readable commands, and the QubitPage® OS interpreter builds and runs the circuit:

```qlang
ENTANGLE q0 q1      # H on q0, then CNOT q0 → q1 (a Bell pair)
MEASURE q0 q1
RUN 4096            # expect roughly 50% "00" and 50% "11"
```

```qlang
GHZ 4               # 4-qubit GHZ state
GROVER 5 3          # Grover search for item 5 among 3-qubit states
TELEPORT            # textbook teleportation circuit
```

It's aimed at **students and newcomers**, who can run their first circuits in the browser without learning Python or Qiskit first. It isn't meant to replace OpenQASM, Qiskit or Cirq for research work.

**This repository** contains the language documentation, example programs and `qlang_runtime.js`, a small browser SDK that sends QLang code to a QubitPage® OS server. **The interpreter itself** lives in [QubitPage-OS](https://github.com/qubitpage/QubitPage-OS) (`src/quantum_kernel.py`).

> Running locally means circuits run in the **Stim** simulator. The OS also has a code path that can submit circuits to IBM Quantum with your own IBM token.

<img src="docs/screenshot.png" alt="QLang terminal in QubitPage OS" width="720" />

---

## 🌐 Ecosystem

| Repository | Description |
|------------|-------------|
| **[QLang](https://github.com/qubitpage/QLang)** | ← This repo: language docs, examples, browser SDK |
| **[QuBIOS](https://github.com/qubitpage/QuBIOS)** | QEC & entanglement toolkit, simulation plus experiments on IBM hardware ([report](https://github.com/qubitpage/QuBIOS/blob/main/docs/HARDWARE_REPORT_2026-11-07.md)) |
| **[QubitPage-OS](https://github.com/qubitpage/QubitPage-OS)** | Browser platform that hosts the QLang interpreter |

---

## Commands

**Quantum**

| Command | Example | Meaning |
|---------|---------|---------|
| `CIRCUIT <name> <n>` | `CIRCUIT demo 3` | New circuit with n qubits |
| `H X Y Z S T <q>` | `H 0` | Single-qubit gates |
| `CNOT CZ SWAP <a> <b>` | `CNOT 0 1` | Two-qubit gates |
| `TOFFOLI <a> <b> <c>` | `TOFFOLI 0 1 2` | Controlled-controlled-X |
| `MEASURE <q…> \| ALL` | `MEASURE ALL` | Add measurements |
| `RUN [shots]` | `RUN 1024` | Execute the current circuit |
| `ENTANGLE`, `SUPERPOSE` | `ENTANGLE 0 1` | Shortcuts for Bell pair / Hadamard |
| `BELL`, `GHZ <n>`, `GROVER <t> <n>`, `TELEPORT` | `GHZ 4` | Ready-made textbook circuits |
| `USE <backend>`, `BACKENDS` | `USE stim` | Choose / list backends |
| `EXPORT <qasm\|json\|svg>` | `EXPORT qasm` | Export the circuit |

**Scripting helpers:** `VAR`, `LET`, `PRINT`, `IF … THEN`, `LOOP`, `FOR … IN … TO`, `ARRAY`, `MATRIX`, `MATH`, `FUNCTION`, `PROGRAM`, `IMPORT`, `ENCODE/DECODE`, `HASH`, `RANDOM`, `QRNG`, `PLOT`, `HISTORY`, `CLEAR`.

Full reference: [docs/language-spec.md](docs/language-spec.md)

---

## Using the browser SDK

```html
<script src="src/qlang_runtime.js"></script>
<script>
  QBP.execute("BELL").then(r => console.log(r));
  QBP.simulate("ghz3", { shots: 1024 }).then(d => QBP.renderResult("out", d.data || d));
</script>
```

`qlang_runtime.js` needs a running QubitPage® OS backend (it calls `/api/qplang/*` and `/api/quantum/*`).

---

## Project status

QLang is an **educational project in active development**:

- Each line is interpreted on its own (no full parser/compiler yet). A grammar, parser and OpenQASM 3 output are on the roadmap.
- Some example files use a `GATE H q0` form that the current interpreter doesn't handle. Use `H 0` / `CNOT 0 1` until the examples are updated.
- `QRNG` and `RANDOM` sample a **simulator**, so on a local backend they're classical pseudo-random numbers, not certified quantum randomness. Don't use them for cryptographic keys.
- `QFT` and `WHILE` are listed in the in-app help but aren't implemented yet.
- `OPTIMIZE` and `BENCHMARK` are helper/demo commands, not research-grade optimizers.

### Roadmap
- [ ] Formal grammar + parser, with clear error messages and line numbers
- [ ] OpenQASM 3 export, verified against Qiskit
- [ ] Examples tested in CI against the interpreter
- [ ] Optional IBM Quantum runs from the browser, using the user's own token

---

## License
MIT. See [LICENSE](LICENSE).

<div align="center">
<strong><a href="https://qubitpage.com">🌐 qubitpage.com</a></strong> · © 2026 Qubitpage® · contact@qubitpage.com
</div>
