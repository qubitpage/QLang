# QLang Language Specification v1.0.0
### Qubitpage® Quantum Programming Language Reference
> [🌐 qubitpage.com](https://qubitpage.com) · [📦 GitHub](https://github.com/qubitpage/QLang)

---

## 1. Overview

QLang is a high-level, interpreted quantum programming language. Programs are called **quantum programs** (`.ql` files) and are executed by the **QLang Kernel** — a Python engine backed by Qiskit and Stim.

QLang is:
- **Line-oriented** — one command per line
- **Case-insensitive** for keywords (`ENTANGLE` = `entangle`)
- **Context-aware** — commands share a session context (variables, results)
- **Hybrid** — mixes quantum gates and classical control flow

---

## 2. Program Structure

```qlang
# This is a comment
VERSION  # Print runtime version

# Declare variables
VAR shots = 4096
VAR backend = "aer_simulator"

# Build and run a circuit
CIRCUIT bell
  GATE H q0
  GATE CNOT q0 q1
  MEASURE q0 q1

BENCHMARK shots
PLOT histogram
EXPORT json
```

---

## 3. Lexical Rules

### 3.1 Comments
```
# Everything after a hash is a comment
```

### 3.2 Identifiers
- Register names: `q0`, `q1`, ... `qN` (quantum registers)
- Variable names: alphanumeric + underscore, starting with a letter
- Reserved words: all language keywords (case-insensitive)

### 3.3 Literals
| Type | Example |
|------|---------|
| Integer | `42`, `-7`, `0` |
| Float | `3.14`, `-0.5` |
| String | `"aer_simulator"` |
| Qubit | `q0`, `q1`, ..., `q127` |

---

## 4. Command Reference

### 4.1 System Commands

#### `HELP`
Print available commands.
```qlang
HELP
```

#### `VERSION`
Print QLang runtime version.
```qlang
VERSION
# → QLang v1.0.0 | QuBIOS Engine | qubitpage.com
```

#### `CLEAR`
Reset the execution context (variables, history, circuit state).
```qlang
CLEAR
```

#### `HISTORY`
Show the execution history of commands in this session.
```qlang
HISTORY
```

---

### 4.2 Variables & Data

#### `VAR`
Declare a named variable. Value can be integer, float, or string.
```qlang
VAR x = 42
VAR pi = 3.14159
VAR backend = "ibm_torino"
```

#### `PRINT`
Output an expression or variable.
```qlang
PRINT x
PRINT "Hello, quantum world"
PRINT 2 * x + 1
```

#### `MATH`
Evaluate a mathematical expression. Supports standard operators and functions.
```qlang
MATH 2 + 3 * 7       # → 23
MATH sqrt(2) / 2     # → 0.7071...
MATH pi * r^2        # → area (if r defined)
```

#### `ARRAY`
Create an indexed register array.
```qlang
ARRAY q 4            # Creates q[0..3]
ARRAY results [0, 1, 0, 1, 1]
```

---

### 4.3 Control Flow

#### `IF / THEN`
Conditional execution. Condition is classical (0/1).
```qlang
IF 1 THEN PRINT "always runs"
IF x > 10 THEN MEASURE q0
IF result == 0 THEN SUPERPOSE q1
```

#### `LOOP`
Repeat a command N times.
```qlang
LOOP 3 PRINT "quantum"
LOOP 10 BENCHMARK 1024
```

#### `FUNCTION`
Define a named quantum subroutine with parameters.
```qlang
FUNCTION bell_pair a b
  GATE H a
  GATE CNOT a b
  MEASURE a b
END

# Call it:
bell_pair q0 q1
```

#### `PROGRAM`
Define a named quantum program block.
```qlang
PROGRAM grover_3q
  SUPERPOSE q0
  SUPERPOSE q1
  SUPERPOSE q2
  ORACLE grover 3
  OPTIMIZE circuit_depth
END
```

#### `IMPORT`
Import a standard QLang library.
```qlang
IMPORT math        # Classical math functions
IMPORT qft         # Quantum Fourier Transform
IMPORT grover      # Grover's algorithm library
IMPORT chemistry   # VQE/molecular simulation
```

---

### 4.4 Quantum Gates

#### `GATE`
Apply a named quantum gate to a qubit.
```qlang
GATE H q0          # Hadamard
GATE X q1          # Pauli-X (NOT)
GATE Y q0          # Pauli-Y
GATE Z q0          # Pauli-Z
GATE S q0          # S gate (phase π/2)
GATE T q0          # T gate (phase π/4)
GATE CNOT q0 q1    # Controlled-NOT
GATE CZ q0 q1      # Controlled-Z
GATE SWAP q0 q1    # SWAP
GATE RZ 0.5 q0     # Rotation Z by θ
GATE RX 1.57 q0    # Rotation X by θ
GATE RY 0.78 q0    # Rotation Y by θ
GATE CCX q0 q1 q2  # Toffoli (CCNOT)
```

#### `CIRCUIT`
Load a named circuit template (pre-built patterns).
```qlang
CIRCUIT bell           # 2-qubit Bell state
CIRCUIT ghz3           # 3-qubit GHZ state
CIRCUIT ghz5           # 5-qubit GHZ state
CIRCUIT superposition  # n-qubit uniform superposition
CIRCUIT qft 4          # 4-qubit QFT
CIRCUIT grover 3       # 3-qubit Grover
```

---

### 4.5 Quantum Operations

#### `ENTANGLE`
Create a Bell pair between two qubits (H + CNOT shorthand).
```qlang
ENTANGLE q0 q1
# Equivalent to: GATE H q0 / GATE CNOT q0 q1
```

#### `SUPERPOSE`
Put a qubit in uniform superposition (Hadamard gate).
```qlang
SUPERPOSE q0
SUPERPOSE q0 q1 q2   # Multiple qubits
```

#### `ORACLE`
Apply a quantum oracle. Type determines the oracle construction.
```qlang
ORACLE grover 3      # 3-qubit Grover oracle
ORACLE simon 4       # Simon's algorithm oracle
ORACLE deutsch       # Deutsch-Jozsa oracle
```

#### `MEASURE`
Measure one or more qubits (collapses state, returns classical bits).
```qlang
MEASURE q0
MEASURE q0 q1 q2
MEASURE all         # Measure all qubits in register
```

---

### 4.6 Optimization & Analysis

#### `OPTIMIZE`
Apply a circuit optimization pass.
```qlang
OPTIMIZE circuit_depth    # Minimize gate depth (faster execution)
OPTIMIZE t_count          # Minimize T gate count (fault-tolerance)
OPTIMIZE swap_count       # Minimize SWAP gates (topology-aware)
OPTIMIZE all              # Apply all passes
```

#### `BENCHMARK`
Run N-shot benchmark and report fidelity, counts, and timing.
```qlang
BENCHMARK 1024
BENCHMARK 4096   # More shots → better statistics
```

#### `PLOT`
Visualize results (histogram, state_vector, bloch_sphere).
```qlang
PLOT histogram
PLOT state_vector
PLOT bloch_sphere q0
```

---

### 4.7 Encoding & Cryptography

#### `ENCODE`
Encode data using classical or quantum-safe algorithms.
```qlang
ENCODE base64 "Hello World"
ENCODE sha256 "my-data"
ENCODE qkd "message"       # Quantum Key Distribution encoding
```

#### `DECODE`
Decode previously encoded data.
```qlang
DECODE base64 "SGVsbG8gV29ybGQ="
```

#### `HASH`
Generate a quantum-resistant hash.
```qlang
HASH sha256 "input-data"
HASH sha3_256 "input-data"
```

#### `RANDOM`
Generate a quantum random number in range [min, max] using QRNG.
```qlang
RANDOM 1 100
RANDOM 0 1       # Quantum coin flip
```

---

### 4.8 Export & Integration

#### `EXPORT`
Export the current circuit or results in a given format.
```qlang
EXPORT json      # Export results as JSON
EXPORT qasm      # Export circuit as OpenQASM 2.0
EXPORT svg       # Export circuit diagram as SVG
EXPORT ibm       # Submit to IBM Quantum Platform
EXPORT ibm --backend ibm_torino --shots 4096
```

---

## 5. Built-in Types

| Type | Description | Example |
|------|-------------|---------|
| `Qubit` | Single quantum register slot | `q0`, `q1` |
| `Register` | Array of qubits | `ARRAY q 4` → `q[0]..q[3]` |
| `Circuit` | Compiled gate sequence | `CIRCUIT bell` |
| `Result` | Measurement outcome + counts | `{"00": 512, "11": 512}` |
| `Observable` | Pauli string for VQE | `ZZ`, `XX`, `IZ` |

---

## 6. Execution Model

```
 Source Text (.ql)
      │
      ▼
 QLang Lexer
      │  Splits into tokens: (KEYWORD, IDENT, LITERAL, ...)
      ▼
 QLang Parser
      │  Validates syntax, builds AST nodes
      ▼
 QLang Compiler
      │
      ├── Classical commands → Python eval
      ├── Gate commands → Qiskit QuantumCircuit
      └── Oracle commands → Pre-built Stim/Qiskit templates
             │
             ▼
        Circuit Executor
             │
             ├── aer_simulator → local fast sim
             ├── IBM backend → IBMRuntimeService.run()
             └── QuBIOS layer → SteaneQEC + EscortQubVirt
                    │
                    ▼
              Result Object
             { counts, fidelity, shots, time_us, qasm }
```

---

## 7. Standard Libraries

### `math`
Classical math: `sqrt`, `log`, `exp`, `pi`, `sin`, `cos`, `abs`, `round`

### `qft`
Quantum Fourier Transform circuits for N qubits

### `grover`
Grover's search oracle and diffusion operator templates

### `chemistry`
VQE molecule simulation: H₂, LiH, BeH₂, H₂O, NH₃

### `error_correction`
Steane [[7,1,3]], Shor [[9,1,3]], surface code templates

---

## 8. Error Handling

QLang returns structured errors:

```json
{
  "success": false,
  "error": "ENTANGLE requires exactly 2 qubit arguments",
  "command": "ENTANGLE q0",
  "line": 4
}
```

Common errors:
- `UNKNOWN_COMMAND` — command not recognized
- `INVALID_QUBIT` — qubit index out of range
- `TYPE_ERROR` — wrong argument type
- `BACKEND_ERROR` — IBM/simulator not available

---

## 9. Grammar (EBNF)

```ebnf
program     ::= (statement | comment | empty)*
statement   ::= keyword arg* NEWLINE
keyword     ::= HELP | VERSION | VAR | PRINT | MATH | RANDOM | HASH
              | ARRAY | LOOP | HISTORY | CLEAR | BENCHMARK | ENCODE
              | DECODE | ENTANGLE | SUPERPOSE | ORACLE | IF | PROGRAM
              | FUNCTION | EXPORT | OPTIMIZE | PLOT | IMPORT
              | GATE | CIRCUIT | MEASURE
arg         ::= qubit | identifier | literal | string
qubit       ::= 'q' digit+
identifier  ::= letter (letter | digit | '_')*
literal     ::= integer | float
string      ::= '"' char* '"'
comment     ::= '#' char* NEWLINE
```

---

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-22 | Initial release — 27 commands, IBM native, QuBIOS integration |

---

<div align="center">
<strong><a href="https://qubitpage.com">🌐 Qubitpage®</a></strong> · 
<strong><a href="https://github.com/qubitpage/QLang">📦 QLang Repository</a></strong> · 
<strong><a href="https://github.com/qubitpage/QuBIOS">⚛️ QuBIOS Framework</a></strong>
<br/><em>© 2026 Qubitpage® — All rights reserved</em>
</div>
