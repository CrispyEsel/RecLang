import React from 'react';

export default function Comparison() {
  // Common styles for the buttons to remove default HTML styling and match your layout
  const buttonBaseStyle: React.CSSProperties = {
    position: 'absolute',
    background: '#7FBDFF',
    color: 'white',
    fontFamily: 'Intel One Mono',
    fontWeight: '400',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{width: 768, height: 1024, position: 'relative', background: '#32313F', overflow: 'hidden'}}>
      
      {/* Next Button */}
      <button
        onClick={() => console.log('Next clicked')}
        style={{
          ...buttonBaseStyle,
          width: 207,
          height: 58,
          left: 528,
          top: 94,
          borderRadius: '10px',
          fontSize: 32,
        }}
      >
        Next
      </button>

      {/* Image 1 Button */}
      <button
        onClick={() => console.log('Image 1 clicked')}
        style={{
          ...buttonBaseStyle,
          width: 443,
          height: 294,
          left: 162,
          top: 205,
          borderRadius: '15px',
          fontSize: 64,
        }}
      >
        Image 1
      </button>

      {/* Image 2 Button */}
      <button
        onClick={() => console.log('Image 2 clicked')}
        style={{
          ...buttonBaseStyle,
          width: 443,
          height: 294,
          left: 162,
          top: 592,
          borderRadius: '15px',
          fontSize: 64,
        }}
      >
        Image 2
      </button>

    </div>
  );
}
