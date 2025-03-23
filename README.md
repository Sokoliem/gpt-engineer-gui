# GPT Engineer GUI

A graphical user interface for the GPT Engineer project, making it easy to create and manage AI-generated code projects.

## Features

- Create and manage projects with a user-friendly interface
- Write prompts to generate code using GPT models
- View and explore generated code with syntax highlighting
- Configure different models and settings
- Dark/light theme support
- Project templates for quick starts
- Favorites and recent projects views

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gpt-engineer-gui.git
cd gpt-engineer-gui
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Create a new project by clicking the "New Project" button
2. Enter a project name and select a template
3. Write a prompt describing what you want to build
4. Enter your OpenAI API key in the settings tab
5. Click "Run" to generate code
6. Explore the generated files in the "Files" tab

## Development

This project is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Monaco Editor

## Project Structure

```
src/
├── components/     # UI components
│   ├── editor/     # Code editor components
│   ├── file/       # File explorer components
│   ├── layout/     # Layout components (header, sidebar)
│   ├── project/    # Project-related components
│   └── ui/         # Base UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
├── services/       # API services
└── store/          # State management
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [GPT Engineer](https://github.com/gpt-engineer-org/gpt-engineer) - The original project this GUI is built for
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor