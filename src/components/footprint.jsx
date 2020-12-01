import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from 'react';
import PropTypes from 'prop-types';
import './footprint.css';
import right_foot from '../bird_right.png';
import left_foot from '../bird_left.png';

function Footprint({ isOn }) {
  let shouldThrottle = useRef(false);
  // prev_x and prev_y are at the center at the beginning
  let prev_x = useRef(Math.max(document.documentElement.clientWidth / 2 || 0,
                                window.innerWidth / 2 || 0 ));
  let prev_y = useRef(Math.max(document.documentElement.clientHeight / 2 || 0,
                                window.innerHeight / 2 || 0) - 100 );
  let doorCenter_x = useRef(prev_x);
  let doorCenter_y = useRef(prev_y);

  const [position, setPosition] = useState({
    x: prev_x.current,
    y: prev_y.current
  });

  const speed = 500;
  const R = document.getElementById('right_foot');
  const L = document.getElementById('left_foot');

  const getDefaultPosition = (door) => {
    const {
      left,
      top,
      right,
      bottom
    } = door.getBoundingClientRect();
    doorCenter_x.current = left + (right - left) / 2;
    doorCenter_y.current = bottom + (bottom - top) / 2;
    setPosition({
      'x': doorCenter_x.current,
      'y': doorCenter_y.current
    });
  };

  const _updatePicture = (degree) => {
    L.classList.toggle('stepping_foot');
    R.classList.toggle('stepping_foot');
    R.style.top = `${position['y']}px`;
    R.style.left = `${position['x']}px`;
    R.style.transform = `rotate(${degree}deg)`;
    L.style.top = `${position['y']}px`;
    L.style.left = `${position['x']}px`;
    L.style.transform = `rotate(${degree}deg)`;
  };

  const drawFootprint = () => {
    const diff_x = position.x - prev_x.current;
    const diff_y = position.y - prev_y.current;

    // if the cursor is moving, update prev_x & prev_y and redraw.
    if (diff_x !== 0 || diff_y !== 0) {
      prev_x.current = position.x;
      prev_y.current = position.y;
      // MEMO: rad -> deg. NOTE: The direction of y axis is opposite to math x-y
      // plane. The returned value is +/- flipped. CSS rotation feature change
      // the angle in clockwise direction whereas it's opposite in math degree
      // system. Leave this +/- flipped value as it is to adjust to CSS system.
      const new_degree = (Math.atan2(diff_y, diff_x) * 180 / Math.PI) + 90;
      _updatePicture(new_degree);
    }
  };

  // initial setup
  // useLayoutEffect(() => {
  //   getDefaultPosition();
  // },[]);

  // keeping an eye on the change of isOn
  useEffect(() => {
    const getCursor = event => {
      if (!shouldThrottle.current) {
        shouldThrottle.current = true;
        setPosition({
          x: event.clientX,
          y: event.clientY
        });
        setTimeout(() => shouldThrottle.current = false, speed);
      }
    };

    if (isOn) {
      document.addEventListener('mousemove', getCursor);
    } else {
      document.removeEventListener('mousemove', getCursor);
      const door = document.getElementById("door");
      door ? getDefaultPosition(door) :
        setPosition({
          x: prev_x.current,
          y: prev_y.current
        })
    }
    return () => document.removeEventListener('mousemove', getCursor);
  }, [isOn]);

  // keep updating while isOn is true, keeping an eye on the change of position
  useLayoutEffect(() => {
    if (isOn) {
      drawFootprint();
    }
  }, [position]);

  return (
    <>
      <img
        src = {right_foot}
        className = 'component react--right_foot foot stepping_foot'
        id = 'right_foot'
        style = {
          isOn ?
          {
            'display': 'inline',
            'left': position.x,
            'top': position.y
          } :
          {
            'display': 'none',
          }
        }
        alt = 'right foot'
      />
      <img
        src = {left_foot}
        className = 'component react--left_foot foot'
        id = 'left_foot'
        style = {
          isOn ?
          {
            'display': 'inline',
            'left': position.x,
            'top': position.y
          } :
          {
            'display': 'none'
          }
        }
        alt = 'left foot'
      />
    </>
  );
}

export default Footprint;

Footprint.propTypes = {
  isOn: PropTypes.bool.isRequired
};
