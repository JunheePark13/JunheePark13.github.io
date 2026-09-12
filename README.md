# Junhee Park — Engineering Portfolio

Personal engineering portfolio for Junhee Park, an Engineering Science student specializing in Aerospace Engineering at the University of Toronto.

**Live site:** [junheepark13.github.io](https://junheepark13.github.io/)

## Focus

The portfolio highlights work in:

- Computational fluid dynamics, turbulent mixing, LES/URANS, and propulsion-related research
- Aircraft aerodynamics, multidisciplinary design, CAD, manufacturing, and testing
- Scientific computing, numerical methods, and physics-informed machine learning
- Mechanical design and prototyping

## Featured work

- **UTIAS contrail-relevant turbulent jet mixing & LES** — validated compressible OpenFOAM modelling, structured meshing, HPC, solver diagnostics, and supersaturation statistics
- **UTAT UAS** — aircraft aerodynamics, OpenVSP/VSPAERO analysis, multidisciplinary design, wing construction, and additive-manufacturing R&D
- **Numerical solvers vs PINNs** — comparison of classical ODE solvers and a physics-informed neural network on the nonlinear Brusselator system
- **Robotics for Space Exploration** — rover-arm mechanical design, CAD, prototyping, and manufacturing

## Repository structure

```text
.
├── index.html                  # Homepage
├── research.html               # Research landing page
├── teams.html                  # Engineering teams
├── engineering-projects.html   # Independent and academic projects
├── extracurriculars.html       # Extracurricular work
├── projects/                   # Individual project case studies
├── images/                     # Published site media
├── documents/                  # Resume and technical reports
├── scripts/                    # Reproducible utility scripts
├── style.css                   # Shared styling
├── script.js                   # Shared interaction/navigation logic
└── .github/workflows/          # GitHub Pages and figure-generation automation
```

## Stack

The site is intentionally lightweight: semantic HTML, CSS, and vanilla JavaScript, deployed through GitHub Pages. No front-end framework or build system is required.

A small Python utility using PyMuPDF is retained to reproduce the figures extracted from the PINN report.

## Local development

The site can be opened directly from `index.html`, or served locally from the repository root:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Automation

- `deploy-pages-v2.yml` deploys the static site to GitHub Pages on pushes to `main`.
- `extract-pinn-figures.yml` regenerates the published PINN figures when the source report or extraction script changes.

## Contact

Portfolio: [junheepark13.github.io](https://junheepark13.github.io/)  
LinkedIn: [Junhee Park](https://ca.linkedin.com/in/junhee-park013)
