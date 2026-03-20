README for FORGE - Code Editor

## FORGE: Fast Code Editor for Engineers

A lightweight, high-performance code editor built with Electron for Linux. FORGE supports C++, Java, JavaScript, HTML, and CSS with a focus on speed and efficiency.

### Features

- ⚡ **Lightning Fast** - Optimized for performance across all operations
- 🚀 **Multi-language Support** - C++, Java, JavaScript, HTML, CSS with syntax highlighting
- 💻 **Integrated Terminal** - Built-in terminal for compilation and execution
- 🎨 **Command Palette** - Quick access to commands (Ctrl+Shift+P)
- ⌨️ **Keyboard-Centric** - Extensive keyboard shortcuts for power users
- 🐧 **Linux Native** - Built for Linux (deb and AppImage packages)

### Getting Started

#### Installation

1. **From deb package:**
   ```bash
   sudo dpkg -i forge-0.1.0-amd64.deb
   mund
   ```

2. **From AppImage:**
   ```bash
   chmod +x forge-0.1.0-x86_64.AppImage
   ./forge-0.1.0-x86_64.AppImage
   ```

3. **From source:**
   ```bash
   npm install
   npm start
   ```

#### Quick Launch

Launch FORGE from terminal:
```bash
mund
```

### Keyboard Shortcuts

**File Operations:**
- `Ctrl+N` - New File
- `Ctrl+O` - Open File
- `Ctrl+K Ctrl+O` - Open Folder
- `Ctrl+S` - Save
- `Ctrl+Shift+S` - Save As

**Editor:**
- `Ctrl+F` - Find
- `Ctrl+H` - Find & Replace
- `Ctrl+/` - Toggle Comment
- `Ctrl+Shift+P` - Command Palette

**Execution:**
- `F5` - Run
- `F7` - Stop
- `Ctrl+`` - Toggle Terminal

**View:**
- `F12` - Toggle DevTools (Dev mode only)

### Development

#### Requirements
- Node.js 16+
- npm or yarn
- Linux system

#### Build from Source

```bash
# Install dependencies
npm install

# Development mode (hot reload)
npm start

# Build production bundle
npm run build

# Create distribution packages
npm run dist:all      # Both deb and AppImage
npm run dist:deb      # Debian package
npm run dist:appimage # AppImage package
```

### Project Structure

```
mund/
├── electron/          # Electron main process
│   ├── main.js        # App entry point
│   └── preload.js     # Secure context bridge
├── src/               # React frontend
│   ├── components/    # UI components
│   ├── styles/        # Component styles
│   ├── App.tsx        # Main app component
│   └── index.tsx      # React entry point
├── ui-designs/        # UI mockup references
├── webpack.dev.js     # Dev webpack config
├── webpack.prod.js    # Production webpack config
├── package.json       # Dependencies & scripts
└── tsconfig.json      # TypeScript config
```

### Supported File Types

- **C/C++** - .c, .cpp, .h, .hpp, .cc
- **Java** - .java
- **JavaScript** - .js, .jsx
- **TypeScript** - .ts, .tsx
- **HTML** - .html, .htm
- **CSS** - .css, .scss, .less
- **Markdown** - .md

### Performance

FORGE is designed for speed:
- Lightweight electron wrapper
- Fast file operations
- Quick startup time
- Responsive UI with minimal lag
- Efficient memory usage

### Contributing

To contribute to FORGE:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### License

MIT License - See LICENSE file for details

### Support

For issues, feature requests, or feedback, please create an issue on GitHub.

---

**FORGE** - Built for Engineers ⚡
