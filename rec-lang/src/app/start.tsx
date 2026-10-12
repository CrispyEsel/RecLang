import React from 'react';

export default function start() {
  // Common styles for the buttons to remove default HTML styling and match your layout
  const buttonBaseStyle: React.CSSProperties = {
    position: 'absolute',
    background: '#7FBDFF',
    borderRadius: '10px',
    border: 'none',
    color: 'white',
    fontFamily: 'Intel One Mono',
    fontWeight: '400',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{width: 768, height: 1024, position: 'relative', background: '#32313F', overflow: 'hidden'}}>
      {/* RecLang Title (Stays a standard text element) */}
      <div style={{left: 175, top: 167, position: 'absolute', color: 'white', fontSize: 104, fontFamily: 'Intel One Mono', fontWeight: '400', wordWrap: 'break-word'}}>
        RecLang
      </div>

      {/* Settings Button */}
      <button 
        onClick={() => console.log('Settings clicked')}
        style={{
          ...buttonBaseStyle,
          width: 235.59, 
          height: 77, 
          left: 504, 
          top: 33, 
          fontSize: 40,
        }}
      >
        Settings
      </button>

      {/* Image Test Button */}
      <button 
        onClick={() => console.log('Image Test clicked')}
        style={{
          ...buttonBaseStyle,
          width: 488, 
          height: 122, 
          left: 149, 
          top: 470, 
          fontSize: 52,
        }}
      >
        Image Test
      </button>

      {/* Cartoon Test Button */}
      <button 
        onClick={() => console.log('Cartoon Test clicked')}
        style={{
          ...buttonBaseStyle,
          width: 488, 
          height: 122, 
          left: 152, 
          top: 642, 
          fontSize: 52,
        }}
      >
        Cartoon Test
      </button>

      {/* Animated Test Button */}
      <button 
        onClick={() => console.log('Animated Test clicked')}
        style={{
          ...buttonBaseStyle,
          width: 488, 
          height: 122, 
          left: 150, 
          top: 814, 
          fontSize: 52,
        }}
      >
        Animated Test
      </button>
    </div>
  );
}