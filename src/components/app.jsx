import React, { useState, useEffect } from 'react';
import Footprint from './footprint.jsx';
import Cage from './cage.jsx';

function App() {
  const [isOn, setIsOn] = useState(false);

  const handleClick = (event) => {
    setIsOn(!isOn);
  };

  useEffect((event) => {
    const openAndCloseDoor = () => {
      const door = document.getElementById('door');
      if(isOn) {
        door.style.transformOrigin = "42%";
        door.style.transform = "rotateY(180deg)";
      } else {
        door.style.transformOrigin = "42%";
        door.style.transform = "rotateY(0deg)";
      }
    };
    openAndCloseDoor();
  }, [isOn]);

  return (
    <>
      <Footprint
        isOn={isOn}
      />
      <Cage
        handleClick={handleClick}
        />
      {isOn ?
        <div className="section--about--message">
          "Click the cage to close."
        </div>
      : <div className="section--about--message">
          "Click the cage to open."
        </div>}
    </>
  )
}

export default App;
