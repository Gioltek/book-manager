import React from "react";
import ClockLoader from "react-spinners/ClockLoader.js";

const Loading = () => {
  const override = `
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    animation: opacityAnimation 1000ms;
    animation-iteration-count: infinite;
  `;
  return (
    <>
      <div className="loading-screen"></div>
      <ClockLoader color="#0a3754" loading={true} size={50} css={override} />
    </>
  );
};

export default Loading;
