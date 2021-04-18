import React, { useEffect, useRef } from 'react';

export default ({ lrctext, currentTime }) => {
  const lrc = useRef();
  useEffect(() => {
    lrc.current = new window.Lyricer({ clickable: false });
  }, []);

  useEffect(() => {
    if (lrctext && lrc.current) {
      lrc.current.setLrc(lrctext);
    }
  }, [lrctext]);

  useEffect(() => {
    if (lrctext && lrc.current) {
      lrc.current.move(currentTime);
    }
  }, [currentTime]);

  return <div id="lyricer"></div>;
};
