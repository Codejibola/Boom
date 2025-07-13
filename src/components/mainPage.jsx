import { useRef, useState, useEffect } from 'react';

export default function VideoRecorder() {
  const videoRef = useRef();// Reference to the video element
  const recorderRef = useRef(); // Reference to the MediaRecorder instance
  const chunksRef = useRef([]); // Ref to always have latest chunks
  const [chunks, setChunks] = useState([]); // state to hold video
  const [isRecording, setIsRecording] = useState(false); // State to track if recording is in progress
  const [videoURL, setVideoURL] = useState(null); // State to hold the recorded video URL

  // Keep chunksRef in sync with chunks state
  useEffect(() => {
    chunksRef.current = chunks;
  }, [chunks]);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 640 }, height: { ideal: 480 } }, 
          audio: true 
        });
        videoRef.current.srcObject = stream;

        const recorder = new MediaRecorder(stream);// Create a MediaRecorder instance that records the stream
        recorderRef.current = recorder;
// Set up event handlers for the MediaRecorder
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) setChunks((prev) => [...prev, e.data]);
        };

        recorder.onstop = () => {
          if (chunksRef.current.length === 0) {
            alert('No video data was recorded.');
            return;
          }
          const blob = new Blob(chunksRef.current, { type: 'video/webm;codecs=vp8,opus' });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
          console.log('Recorded blob:', blob);
        };
      } catch (err) {
        console.error('Camera access error:', err);
      }
    };

    setupCamera();
  }, []);

  const startRecording = () => {
    setChunks([]);
    setVideoURL(null);
    // Pass a timeslice to ensure ondataavailable is called
    recorderRef.current.start(100);
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
    <div style={{ textAlign: 'center', backgroundColor: 'black', borderRadius: '10px', padding: '20px', color: '#fff', width: '50rem', }}>
      <h2 style={{ marginBottom: 0 }}>BOOM</h2>
      <p style={{ marginTop: 8, marginBottom: 24, fontSize: '18px', color: '#444' }}>Record a segment of the movie here</p>
      <video ref={videoRef} autoPlay muted style={{ width: 400, border: '1px solid #ccc', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }} />
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isRecording ? (
          <button 
            onClick={startRecording}
            style={{
              width: '60px',
              height: '60px',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
              transition: 'background 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#1565c0'}
            onMouseOut={e => e.currentTarget.style.background = '#1976d2'}
          >
            <span style={{fontSize: '12px'}}>Start</span>
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            style={{
              width: '60px',
              height: '60px',
              background: '#d32f2f',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(211, 47, 47, 0.15)',
              transition: 'background 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#b71c1c'}
            onMouseOut={e => e.currentTarget.style.background = '#d32f2f'}
          >
            <span style={{fontSize: '12px'}}>Stop</span>
          </button>
        )}
      </div>
      {videoURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Recorded Video Preview</h3>
          <video src={videoURL} controls style={{ width: 400, border: '1px solid #ccc', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }} />
        </div>
      )}
    </div>
    </div>
    </>
  );
}
