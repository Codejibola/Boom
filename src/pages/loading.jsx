import React from "react";


export default function Loader(){
     const containerStyle = {
    backgroundColor: 'black',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const bStyle = {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: '80px',
    display: 'inline-block',
    animation: 'spin 2s linear infinite'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={bStyle}>B</div>
      </div>
    </>
    )
}