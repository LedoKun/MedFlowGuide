
# MedFlowGuide

MedFlowGuide is a Vue application for creating and managing medical workflow visualizations with automatic layout adjustments for interactive, clear flowcharts.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

MedFlowGuide simplifies the visualization of complex medical workflows. Using `@vue-flow/core` for interactive flowcharts and `dagre` for automated layout adjustments, this app is optimized for designing and exploring procedural workflows.

## Features

- **Interactive Flowcharts**: Create, modify, and navigate flowcharts dynamically.
- **Automated Layouts**: Uses `dagre` for clean, organized node alignment.
- **Customizable Components**: Display rich media within nodes for enhanced context.
- **Responsive Design**: Powered by `bulma` for a seamless user experience.

## Installation

### Prerequisites
- **Node.js** (version >=14)
- **Yarn** or **npm**

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/LedoKun/MedFlowGuide.git
   cd MedFlowGuide
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Run the development server:**
   ```bash
   yarn serve
   ```

4. **Build for production:**
   ```bash
   yarn build
   ```

## Usage

1. **Starting the App**:
   - Run `yarn serve` and open `http://localhost:8080` in your browser.

2. **Interacting with Flowcharts**:
   - Add and modify flowcharts through the UI.
   - Navigate and reset flowcharts as needed.

3. **Alignment**:
   - Nodes are aligned automatically for clarity, using `dagre`.

## Configuration

- **Flowchart Data**: Stored in JSON format under `public/flowcharts`. You can add or edit JSON files as required.

## Project Structure

```plaintext
├── public
│   ├── flowcharts          # JSON files for each flowchart
│   └── index.html          # Main HTML file
├── src
│   ├── assets              # Images and icons
│   ├── components          # Vue components
│   │   ├── NavbarComponent.vue
│   │   ├── FlowchartComponent.vue
│   │   └── RichNodeComponent.vue
│   ├── utils               # Helper functions
│   │   └── UseLayout.js    # Layout utility using dagre
│   ├── App.vue             # Main Vue component
│   └── main.js             # Entry point
└── README.md               # This file
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit changes: `git commit -m 'Add some amazing feature'`.
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
