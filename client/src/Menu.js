import React, { useState } from "react";
import "./App.css";

const Menu = ({ setLineColor, setLineWidth, setLineOpacity }) => {
  const [isEraser, setIsEraser] = useState(false);

  const toggleEraser = () => {
    setIsEraser(!isEraser);
    // Set line color to white (or any desired color) when in eraser mode
    setLineColor(isEraser ? "black" : "white");
  };

  return (
    <div className="Menu">
      <label>Brush Color </label>
      <input
        type="color"
        onChange={(e) => {
          // Only set line color if not in eraser mode
          if (!isEraser) {
            setLineColor(e.target.value);
          }
        }}
      />
      <label>Brush Width </label>
      <input
        type="range"
        min="3"
        max="20"
        onChange={(e) => {
          setLineWidth(e.target.value);
        }}
      />
      <label>Brush Opacity</label>
      <input
        type="range"
        min="1"
        max="100"
        onChange={(e) => {
          setLineOpacity(e.target.value / 100);
        }}
      />
      <button onClick={toggleEraser}>
        {isEraser ? "Switch to Brush" : "Switch to Eraser"}
      </button>
    </div>
  );
};

export default Menu;
