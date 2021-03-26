import { css } from 'emotion';
import React from 'react';

const style = css`
position: absolute;
top: 24px;
right: 24px;
font-size: 10px;

h1 {
  font-size: 24px;
  font-weight: 200;
  font-style: italic;
  color: #fff;
  // padding: 4px 6px 5.5px;
  padding: 5px 5px 5px;
  border: 3px solid #fff;
  border-radius: 5px;
  text-transform: uppercase;
  animation: flicker 1.5s infinite alternate;
}

h1::-moz-selection {
  background-color: #08f;
  color: #f40;
}

h1::selection {
  background-color: #08f;
  color: #f40;
}

h1:focus {
  outline: none;
}

/* /* Animate neon flicker */
@keyframes flicker {

    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {

        text-shadow:
            -0.2px -0.2px 1px #fff,
            0.2px 0.2px 1px #fff,
            0 0 2px #f40,
            0 0 4px #f40,
            0 0 6px #f40,
            0 0 8px #f40,
            0 0 10px #f40;

        box-shadow:
            0 0 2px #fff,
            inset 0 0 2px #fff,
            0 0 4px #08f,
            inset 0 0 4px #08f,
            0 0 8px #08f,
            inset 0 0 8px #08f;
    }

    20%, 21%, 23%,24%, 70%, 75% {
        text-shadow: none;
        box-shadow: none;
    }
} */
`;

export const TechnicalPreview = () => {
  return (
    <div className={style}>
      <h1 spellcheck="false">Experimental feature</h1>
    </div>
  );
};
