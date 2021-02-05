import React, { FC, useEffect, useRef, useState } from 'react';

export const OverflowTooltip: FC = ({ children, ...props }) => {
  const [title, setTitle] = useState('');
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.clientWidth < ref.current.scrollWidth) {
      setTitle(children as string);
    }
  }, [ref]);

  return (
    <span ref={ref} title={title} {...props}>
      {children}
    </span>
  );
};
