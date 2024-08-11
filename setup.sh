#!/bin/bash

# Crear estructura de directorios
mkdir -p src public

# Crear package.json
cat > package.json << EOL
{
  "name": "excalidraw-webapp",
  "version": "1.0.0",
  "description": "A simple Excalidraw web application",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@excalidraw/excalidraw": "^0.15.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOL

# Crear src/index.js
cat > src/index.js << EOL
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Crear src/App.js
cat > src/App.js << EOL
import React, { useState } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";

const ExcalidrawApp = () => {
  const [canvases, setCanvases] = useState([]);
  const [selectedCanvas, setSelectedCanvas] = useState(null);

  const createNewCanvas = () => {
    const newCanvas = {
      id: Date.now(),
      name: \`Canvas \${canvases.length + 1}\`,
      content: null
    };
    setCanvases([...canvases, newCanvas]);
    setSelectedCanvas(newCanvas.id);
  };

  const saveCanvas = (content) => {
    setCanvases(canvases.map(canvas => 
      canvas.id === selectedCanvas ? {...canvas, content} : canvas
    ));
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Canvases</h2>
        <button 
          onClick={createNewCanvas}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          New Canvas
        </button>
        <ul>
          {canvases.map(canvas => (
            <li 
              key={canvas.id}
              onClick={() => setSelectedCanvas(canvas.id)}
              className={\`cursor-pointer p-2 \${selectedCanvas === canvas.id ? 'bg-blue-200' : ''}\`}
            >
              {canvas.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        {selectedCanvas && (
          <Excalidraw
            initialData={canvases.find(c => c.id === selectedCanvas)?.content}
            onChange={(elements, state) => saveCanvas({elements, state})}
          />
        )}
      </div>
    </div>
  );
};

export default ExcalidrawApp;
EOL

# Crear public/index.html
cat > public/index.html << EOL
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Excalidraw Web App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOL

# Crear .replit
cat > .replit << EOL
run = "npm start"
entrypoint = "src/index.js"

[env]
REACT_APP_REPLIT_HOST="\$REPL_SLUG.\$REPL_OWNER.repl.co"
EOL

# Instalar dependencias
npm install

echo "Configuración completada. Ejecuta 'npm start' para iniciar la aplicación."