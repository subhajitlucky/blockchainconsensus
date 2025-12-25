# Blockchain Consensus Visualizer

A visual-first, frontend-only interactive microsite that teaches Blockchain Consensus mechanisms with a deep focus on Proof of Work (PoW) and Proof of Stake (PoS).

## Features

*   **Interactive Simulation Engine:** A complete in-browser blockchain simulation where nodes mine, validate, and propagate blocks.
*   **Visual Learning:** Step-by-step animations of hashing, difficulty adjustments, and chain selection.
*   **Playground:** Experiment with network parameters, pause/play time, and watch the blockchain grow in real-time.
*   **Topic Modules:** Focused interactive tutorials on specific concepts like Mining and Hashing.

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Technology Stack

*   **Framework:** React 19 + TypeScript
*   **Build Tool:** Vite
*   **Styling:** TailwindCSS v4
*   **Animation:** Framer Motion
*   **Icons:** Lucide React

## Educational Disclaimer

This project is a **simulation** designed for educational intuition. It simplifies many complex cryptographic and networking realities (e.g., using simplified hashing, zero-latency assumptions unless configured, and conceptual "stakes" without real value). It should not be used as a reference for production cryptographic implementations.