/* ═══════════════════════════════════════════════════════════════════════════
   QLang Browser Runtime — Qubitpage® Quantum OS
   https://qubitpage.com | https://github.com/qubitpage/QLang

   Zero-dependency browser SDK for the QLang quantum programming language.
   Provides circuit execution, quantum simulation, result rendering,
   quantum-safe cryptography, and tab/modal UI helpers.

   Usage:
     <script src="qlang_runtime.js"></script>
     QBP.simulate("bell", { shots: 1024 }).then(data => {
       QBP.renderResult("results", data);
     });

   © 2026 Qubitpage® | MIT License
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  const QBP = {
    version: "1.0.0",
    circuits: {},
    results: {},

    // ── Initialization ───────────────────────────────────────────────────────
    init() {
      this.initCircuits();
      this.initTabs();
      this.initModals();
      this.initButtons();
      console.log("[QBP] QLang Runtime v" + this.version + " initialized | qubitpage.com");
    },

    // ── Circuit Components ───────────────────────────────────────────────────
    initCircuits() {
      document.querySelectorAll(".qbp-circuit").forEach((el) => {
        const id = el.dataset.id || "circuit-" + Math.random().toString(36).slice(2, 6);
        const editor = el.querySelector(".circuit-editor");
        const statusEl = el.querySelector(".circuit-status");

        if (editor) {
          // Tab key → two spaces inside circuit editor
          editor.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const start = editor.selectionStart;
              editor.value =
                editor.value.substring(0, start) +
                "  " +
                editor.value.substring(editor.selectionEnd);
              editor.selectionStart = editor.selectionEnd = start + 2;
            }
          });
        }

        this.circuits[id] = { el, editor, statusEl };
      });
    },

    // ── Compile & Run ────────────────────────────────────────────────────────
    /**
     * Compile and run a QLang circuit from an editor element.
     * @param {string} circuitId - data-id of the .qbp-circuit element
     * @param {Object} options - { backend, shots, ibm_token }
     * @returns {Promise<Object>}
     */
    runCircuit(circuitId, options = {}) {
      const circuit = this.circuits[circuitId];
      if (!circuit) return Promise.reject(new Error("Circuit not found: " + circuitId));

      const source = circuit.editor ? circuit.editor.value : "";
      if (circuit.statusEl) circuit.statusEl.textContent = "Compiling...";

      return fetch("/api/qplang/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, ...options }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (circuit.statusEl) {
            circuit.statusEl.textContent = data.success
              ? "Compiled ✓"
              : "Error: " + (data.error || "unknown");
          }
          return data;
        });
    },

    /**
     * Execute a single QLang command against the server kernel.
     * @param {string} command - e.g. "ENTANGLE q0 q1"
     * @param {Object} context - execution context (shots, backend, vars)
     * @returns {Promise<Object>}
     */
    execute(command, context = {}) {
      return fetch("/api/qplang/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, context }),
      }).then((r) => r.json());
    },

    /**
     * Tokenize QLang source without executing.
     * @param {string} source - QLang source code
     * @returns {Promise<Object>} token stream
     */
    tokenize(source) {
      return fetch("/api/qplang/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      }).then((r) => r.json());
    },

    // ── Quantum Simulation ───────────────────────────────────────────────────
    /**
     * Run a quantum circuit simulation.
     * @param {string} circuitType - "bell" | "ghz3" | "ghz5" | "superposition"
     * @param {Object} params - { shots, backend, noise_rate }
     * @returns {Promise<Object>}
     */
    simulate(circuitType, params = {}) {
      return fetch("/api/quantum/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: circuitType, params }),
      }).then((r) => r.json());
    },

    /**
     * Run QuBIOS benchmark (with/without virtual qubit buffer).
     * @param {string} circuitType - "bell" | "ghz3" | "ghz5" | "superposition"
     * @param {number} shots
     * @returns {Promise<Object>}
     */
    benchmark(circuitType = "bell", shots = 4096) {
      return fetch("/api/qubilogic/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circuit_type: circuitType, shots }),
      }).then((r) => r.json());
    },

    // ── Result Rendering ─────────────────────────────────────────────────────
    /**
     * Render a quantum measurement histogram into an element.
     * @param {string} elementId - target DOM element id
     * @param {Object} data - { counts: {state: count}, shots: number }
     */
    renderResult(elementId, data) {
      const el =
        document.getElementById(elementId) ||
        document.querySelector(`[data-circuit="${elementId}"]`);
      if (!el) return;

      const counts = data.counts || {};
      const total = data.shots || 1;
      let html = "";

      for (const [state, count] of Object.entries(counts)) {
        const pct = ((count / total) * 100).toFixed(1);
        html += `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <span style="font-family:monospace;width:60px;color:var(--accent,#00d4ff)">|${this.escapeHTML(state)}⟩</span>
            <div style="flex:1;height:20px;background:var(--border,#1e2a45);border-radius:4px;overflow:hidden">
              <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#00d4ff,#00ffaa);border-radius:4px;transition:width 0.4s ease"></div>
            </div>
            <span style="font-family:monospace;font-size:12px;width:45px;text-align:right">${pct}%</span>
          </div>`;
      }
      el.innerHTML = html;
    },

    // ── Tab Navigation ───────────────────────────────────────────────────────
    initTabs() {
      document.querySelectorAll(".qbp-tabs").forEach((tabBar) => {
        tabBar.querySelectorAll(".qbp-tab").forEach((tab) => {
          tab.addEventListener("click", () => {
            tabBar
              .querySelectorAll(".qbp-tab")
              .forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const panel = tab.dataset.panel;
            if (panel) {
              const parent = tabBar.parentElement;
              parent
                .querySelectorAll(".qbp-tab-panel")
                .forEach((p) => p.classList.add("hidden"));
              const target = parent.querySelector(`#${panel}`);
              if (target) target.classList.remove("hidden");
            }
          });
        });
      });
    },

    // ── Modal Dialogs ────────────────────────────────────────────────────────
    initModals() {
      document.querySelectorAll(".qbp-modal").forEach((modal) => {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.classList.add("hidden");
        });
      });
    },

    // ── Action Buttons ───────────────────────────────────────────────────────
    initButtons() {
      document.querySelectorAll(".qbp-button[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          if (action === "simulate") {
            const type = btn.dataset.circuit || "bell";
            const shots = parseInt(btn.dataset.shots || "1024", 10);
            btn.disabled = true;
            btn.textContent = "Running...";
            this.simulate(type, { shots })
              .then((data) => {
                if (data.success) {
                  const target = btn.dataset.target;
                  if (target) this.renderResult(target, data.data || data);
                }
                btn.disabled = false;
                btn.textContent = btn.dataset.label || "Run";
              })
              .catch(() => {
                btn.disabled = false;
                btn.textContent = "Error";
              });
          }
        });
      });
    },

    // ── Quantum-Safe Cryptography ────────────────────────────────────────────
    /**
     * Encrypt text using quantum-safe AES-256 + QRNG key derivation.
     * @param {string} text
     * @returns {Promise<{ciphertext_hex: string, key_hex: string}>}
     */
    encrypt(text) {
      return fetch("/api/crypto/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then((r) => r.json());
    },

    /**
     * Decrypt previously encrypted ciphertext.
     * @param {string} ciphertextHex
     * @param {string} keyHex
     * @returns {Promise<{plaintext: string}>}
     */
    decrypt(ciphertextHex, keyHex) {
      return fetch("/api/crypto/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciphertext_hex: ciphertextHex, key_hex: keyHex }),
      }).then((r) => r.json());
    },

    /**
     * Generate quantum random numbers using QRNG.
     * @param {number} bits - number of random bits (default 256)
     * @returns {Promise<{random_hex: string, random_int: number}>}
     */
    qrng(bits = 256) {
      return fetch("/api/crypto/qrng", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bits }),
      }).then((r) => r.json());
    },

    // ── AI Quantum Assistant ─────────────────────────────────────────────────
    /**
     * Chat with ARIA — Quantum AI Research Intelligence Assistant.
     * @param {string} message
     * @param {Array} history - prior conversation turns
     * @returns {Promise<{response: string}>}
     */
    askAria(message, history = []) {
      return fetch("/api/aria/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      }).then((r) => r.json());
    },

    // ── Utilities ────────────────────────────────────────────────────────────
    escapeHTML(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    },

    /**
     * Show a temporary notification toast.
     * @param {string} message
     * @param {"info"|"success"|"error"} type
     */
    notify(message, type = "info") {
      const el = document.createElement("div");
      el.style.cssText = [
        "position:fixed;bottom:20px;right:20px;padding:12px 18px",
        "background:#0a1628;border:1px solid #1e2a45;border-radius:8px",
        "color:#e0e8ff;font-family:monospace;font-size:13px",
        "z-index:9999;max-width:360px;box-shadow:0 4px 20px rgba(0,0,0,0.4)",
        "transition:opacity 0.3s",
      ].join(";");
      if (type === "success") el.style.borderColor = "#00ffaa";
      if (type === "error") el.style.borderColor = "#ff4060";
      el.textContent = message;
      document.body.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 300);
      }, 3700);
    },

    /**
     * Format quantum state probabilities as a text table.
     * @param {Object} counts - {state: count}
     * @param {number} shots
     * @returns {string}
     */
    formatCounts(counts, shots) {
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([state, count]) => {
          const pct = ((count / shots) * 100).toFixed(2);
          const bar = "█".repeat(Math.round(count / shots * 20));
          return `|${state}⟩  ${bar.padEnd(20)}  ${pct}%`;
        })
        .join("\n");
    },
  };

  // Expose globally
  window.QBP = QBP;

  // Auto-init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => QBP.init());
  } else {
    QBP.init();
  }
})();
