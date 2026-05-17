import { useEffect, useRef, useState } from 'react';

const CHAR_POOL = '東京大阪沖繩首爾曼谷台北香港福岡札幌名古屋仁川濟州清邁峴港新加坡';

const FlipChar = ({ target, delay = 0, cycles = 8, interval = 55 }) => {
  const [display, setDisplay] = useState(target);
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
    let count = 0;
    let intervalId;
    const startTimer = window.setTimeout(() => {
      setDisplay(CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]);
      intervalId = window.setInterval(() => {
        count += 1;
        if (count >= cycles) {
          setDisplay(targetRef.current);
          window.clearInterval(intervalId);
        } else {
          setDisplay(CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]);
        }
      }, interval);
    }, delay);

    return () => {
      window.clearTimeout(startTimer);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [target, delay, cycles, interval]);

  return (
    <span key={target + display} className="flip-char inline-block">
      {display}
    </span>
  );
};

const FlipBoard = ({ text, className = '' }) => {
  const chars = Array.from(text);
  return (
    <span className={`inline-flex ${className}`}>
      {chars.map((char, index) => (
        <FlipChar key={index} target={char} delay={index * 90} />
      ))}
    </span>
  );
};

export default FlipBoard;
