import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon } from 'antd';

export default inject(
  'music',
  'my',
)(
  observer(({ path, music, style = {} }) => {
    const [isLike, setIsLike] = useState(!!music?.likes?.find(i => i.path === path));
    useEffect(() => {
      setIsLike(!!music?.likes?.find(i => i.path === path));
    }, [music?.likes, path]);
    return (
      <Icon
        type="heart"
        onClick={() => {
          music.like(path);
        }}
        theme={isLike ? 'filled' : 'outlined'}
        style={{
          color: '#e04f4c',
          cursor: 'pointer',
          ...style,
        }}
      />
    );
  }),
);
