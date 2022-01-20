import React, { useEffect, useState } from 'react';

//import { useStyles } from './Loading.styles';
import LoadingService from './LoadingService';

/**
 *
 * (This loading is only needed if the Loading is going to be global(entire page)(preferable)
 * To create a coherent Loading and to remove the logistic of every component that needs the
 * loading use LoadingService.show() or LoadingService.hide() to control this component
 * everywhere in the javascript
 *
 * * (The Loading animation should be changed in case the designer decides so)
 *
 */

let nFetchs = 0;

console.log(nFetchs, 'nFetches');

const Loading: React.FC = () => {
  //const classes = useStyles();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const event = LoadingService.addListener((_loading: boolean) => {
      if (_loading) {
        if (nFetchs <= 0) {
          setLoading(true);
        }
        nFetchs++;
      } else {
        nFetchs--;
        if (nFetchs <= 0) {
          setLoading(false);
        }
      }
    });

    return () => {
      event.removeEventListener();
    };
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10000,
      }}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#eab308"
      >
        <g fill="none" fillRule="evenodd" strokeWidth="2">
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="0s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="strokeOpacity"
              begin="0s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            ></animate>
          </circle>
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="-0.9s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            ></animate>
            <animate
              attributeName="strokeOpacity"
              begin="-0.9s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            ></animate>
          </circle>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
