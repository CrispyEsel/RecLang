import React from 'react';

export default function Finish() {
  return (
    <div style={{width: 768, height: 1024, position: 'relative', background: '#32313F', overflow: 'hidden'}}>
      
      {/* Finished Title (Standard Text) */}
      <div style={{left: 109, top: 224, position: 'absolute', color: 'white', fontSize: 104, fontFamily: 'Intel One Mono', fontWeight: '400', wordWrap: 'break-word'}}>
        Finished!
      </div>

      {/* Accuracy Score Display (Standard Text Box) */}
      <div 
        style={{
          width: 575, 
          height: 121, 
          left: 109, 
          top: 580, 
          position: 'absolute', 
          background: '#77BBF9', 
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white', 
          fontSize: 60, 
          fontFamily: 'Intel One Mono', 
          fontWeight: '400'
        }}
      >
        Accuracy: 3/5
      </div>

      {/* Retake Button */}
      <button
        onClick={() => console.log('Retake clicked')}
        style={{
          position: 'absolute',
          width: 575, 
          height: 112.13, 
          left: 109, 
          top: 772, 
          background: '#7FBDFF', 
          borderRadius: 10,
          border: 'none',
          color: 'white', 
          fontSize: 60, 
          fontFamily: 'Intel One Mono', 
          fontWeight: '400',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Retake
      </button>

    </div>
  );
}