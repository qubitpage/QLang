# Installing QLang
### Qubitpage® Quantum Programming Language
> [🌐 qubitpage.com](https://qubitpage.com)

---

## Requirements

- Python 3.10+
- pip / virtualenv
- (Optional) IBM Quantum account for hardware access

---

## Quick Install

```bash
git clone https://github.com/qubitpage/QLang.git
cd QLang
pip install -r requirements.txt
```

## Core Dependencies

```
flask>=3.0
flask-cors>=4.0
flask-socketio>=5.3
qiskit>=1.0
qiskit-aer>=0.14
qiskit-ibm-runtime>=0.20
stim>=1.13
pymatching>=2.1
numpy>=1.26
```

Install:
```bash
pip install flask flask-cors flask-socketio qiskit qiskit-aer qiskit-ibm-runtime stim pymatching numpy
```

---

## Start the API Server

```bash
# Using environment variables for API keys (never hardcode)
export IBM_QUANTUM_TOKEN="your-ibm-token"      # optional, for real hardware
export GEMINI_API_KEY="your-gemini-key"        # optional, for AI assistant
export FLASK_SECRET="your-flask-secret"

python src/qlang_server.py
# → Server running at http://localhost:5050
```

---

## Using the REPL

```bash
python src/qlang_repl.py
```

```
QLang v1.0.0 | Qubitpage® | qubitpage.com
Type HELP for commands, EXIT to quit.

qlang> ENTANGLE q0 q1
✓ Bell pair created: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2

qlang> BENCHMARK 1024
✓ shots=1024 | counts={"00":509,"11":515} | fidelity=0.9980

qlang> EXPORT json
{"counts":{"00":509,"11":515},"fidelity":0.998,"shots":1024}
```

---

## Running the Test Suite

```bash
python tests/test_qlang.py
```

---

## Docker (Optional)

```bash
docker build -t qubitpage/qlang:1.0.0 .
docker run -p 5050:5050 \
  -e IBM_QUANTUM_TOKEN=$IBM_QUANTUM_TOKEN \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  qubitpage/qlang:1.0.0
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `IBM_QUANTUM_TOKEN` | No | IBM Quantum Platform token (for real hardware) |
| `GEMINI_API_KEY` | No | Google Gemini API key (for AI assistant) |
| `FLASK_SECRET` | Yes (prod) | Flask session secret key |
| `FLASK_DEBUG` | No | Set `1` for debug mode |

---

<div align="center">
<strong><a href="https://qubitpage.com">🌐 Qubitpage®</a></strong>
<br/><em>© 2026 Qubitpage® — All rights reserved</em>
</div>
