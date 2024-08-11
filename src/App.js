import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";

const DEBOUNCE_DELAY = 300;

const ExcalidrawWrapper = ({ initialData, onChange, canvasId }) => {
  const excalidrawRef = useRef(null);
  const timeoutRef = useRef(null);

  const debouncedOnChange = useCallback((elements, state) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onChange({ elements, appState: state });
    }, DEBOUNCE_DELAY);
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Excalidraw
        ref={excalidrawRef}
        initialData={initialData}
        onChange={debouncedOnChange}
        theme="light"
        gridModeEnabled={false}
      />
    </div>
  );
};

const ExcalidrawApp = () => {
  const [canvases, setCanvases] = useState([]);
  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const createNewCanvas = useCallback(() => {
    const newCanvas = {
      id: Date.now(),
      name: `Canvas ${canvases.length + 1}`,
      content: { elements: [], appState: {} }
    };
    setCanvases(prevCanvases => [...prevCanvases, newCanvas]);
    setSelectedCanvas(newCanvas.id);
  }, [canvases.length]);

  const saveCanvas = useCallback((content) => {
    if (selectedCanvas) {
      setCanvases(prevCanvases => 
        prevCanvases.map(canvas => 
          canvas.id === selectedCanvas ? {...canvas, content} : canvas
        )
      );
    }
  }, [selectedCanvas]);

  const handleCanvasSelect = useCallback((id) => {
    setSelectedCanvas(id);
  }, []);

  const startEditingName = useCallback((id, currentName) => {
    setEditingName(id);
    setEditingNameValue(currentName);
  }, []);

  const finishEditingName = useCallback(() => {
    if (editingName) {
      setCanvases(prevCanvases =>
        prevCanvases.map(canvas =>
          canvas.id === editingName ? {...canvas, name: editingNameValue} : canvas
        )
      );
      setEditingName(null);
      setEditingNameValue('');
    }
  }, [editingName, editingNameValue]);

  const deleteCanvas = useCallback((id) => {
    setCanvases(prevCanvases => prevCanvases.filter(canvas => canvas.id !== id));
    if (selectedCanvas === id) {
      setSelectedCanvas(null);
    }
  }, [selectedCanvas]);

  const selectedCanvasData = canvases.find(c => c.id === selectedCanvas)?.content;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#f5f5f7'
    }}>
      <div style={{ 
        width: isSidebarOpen ? '250px' : '50px', 
        transition: 'width 0.3s ease',
        borderRight: '1px solid #d2d2d7', 
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <button 
          onClick={toggleSidebar}
          style={{ 
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '15px',
            color: '#1d1d1f'
          }}
        >
          ☰
        </button>
        {isSidebarOpen && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#1d1d1f', fontSize: '24px', fontWeight: '500' }}>Canvases</h2>
            <button 
              onClick={createNewCanvas}
              style={{ 
                marginBottom: '20px', 
                padding: '10px', 
                backgroundColor: '#0071e3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s ease'
              }}
            >
              New Canvas
            </button>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {canvases.map(canvas => (
                <li 
                  key={canvas.id}
                  style={{ 
                    marginBottom: '10px',
                    backgroundColor: selectedCanvas === canvas.id ? '#f0f0f0' : 'transparent',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                    {editingName === canvas.id ? (
                      <input
                        type="text"
                        value={editingNameValue}
                        onChange={(e) => setEditingNameValue(e.target.value)}
                        onBlur={finishEditingName}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            finishEditingName();
                          }
                        }}
                        autoFocus
                        style={{ 
                          flexGrow: 1, 
                          marginRight: '10px', 
                          padding: '5px',
                          border: '1px solid #d2d2d7',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    ) : (
                      <span 
                        onClick={() => handleCanvasSelect(canvas.id)}
                        style={{ flexGrow: 1, cursor: 'pointer', fontSize: '14px' }}
                      >
                        {canvas.name}
                      </span>
                    )}
                    <button
                      onClick={() => startEditingName(canvas.id, canvas.name)}
                      style={{ 
                        marginRight: '5px', 
                        padding: '5px', 
                        backgroundColor: 'transparent', 
                        color: '#0071e3', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteCanvas(canvas.id)}
                      style={{ 
                        padding: '5px', 
                        backgroundColor: 'transparent', 
                        color: '#ff3b30', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ✖
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {selectedCanvas ? (
          <ExcalidrawWrapper
            key={selectedCanvas}
            canvasId={selectedCanvas}
            initialData={selectedCanvasData}
            onChange={saveCanvas}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%', 
            color: '#86868b',
            fontSize: '18px'
          }}>
            Select a canvas or create a new one to start drawing
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcalidrawApp;