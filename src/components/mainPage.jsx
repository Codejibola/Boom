import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VideoRecorder() {
  const videoRef = useRef(); // Reference to video element
  const recorderRef = useRef(); // Reference to MediaRecorder instance
  const chunksRef = useRef([]); // Holds recorded video data temporarily

  const [chunks, setChunks] = useState([]); // Triggers re-render when updated
  const [isRecording, setIsRecording] = useState(false); // Recording state
  const [videoURL, setVideoURL] = useState(null); // Blob video preview
  const [facingMode, setFacingMode] = useState("environment"); // Default to rear camera
  const [cameraReady, setCameraReady] = useState(false); // Camera readiness

  useEffect(() => {
    chunksRef.current = chunks; // Keeps chunksRef in sync with chunks state
  }, [chunks]);

  useEffect(() => {
    // Function to request camera and set up MediaRecorder
    async function setupCamera() {
      setCameraReady(false);
      setVideoURL(null);
      setChunks([]);
      chunksRef.current = [];

      // Stop any existing tracks before switching camera
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: { ideal: facingMode },
          },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;

        // Capture video chunks
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) setChunks((prev) => [...prev, e.data]);
        };

        // On stop, generate preview video
        recorder.onstop = () => {
          if (chunksRef.current.length === 0) {
            alert("No video data was recorded.");
            return;
          }
          const blob = new Blob(chunksRef.current, {
            type: "video/webm;codecs=vp8,opus",
          });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
        };

        setCameraReady(true);
      } catch (err) {
        console.error("Camera access error:", err);
        alert("Failed to access the camera. Please check permissions.");
      }
    }

    setupCamera();
  }, [facingMode]); // Re-run when facing mode changes

  const startRecording = () => {
    if (!recorderRef.current) {
      alert("Camera is still initializing. Please wait a moment.");
      return;
    }
    setChunks([]);
    setVideoURL(null);
    recorderRef.current.start(100);
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current.stop();
    setIsRecording(false);
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    // Main container with centered layout and responsive padding
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Animation: fade-in and slide-up
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6 text-center"
      >
        {/* App Title */}
        <h2 className="text-3xl font-bold text-blue-700">BOOM</h2>

        {/* App Subtitle */}
        <p className="mt-2 text-gray-500 text-base">
          Record a segment of the movie here
        </p>

        {/* Live camera feed using <video> element */}
        <motion.video
          ref={videoRef}
          autoPlay
          muted
          className="mt-6 w-full max-w-md rounded-xl border border-gray-300 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />

        {/* Control buttons section */}
        <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
          {/* Start or Stop recording button */}
          {!isRecording ? (
            <motion.button
              onClick={startRecording}
              disabled={!cameraReady}
              className={`w-16 h-16 rounded-full ${
                cameraReady
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white flex items-center justify-center shadow-md transition`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm font-semibold">Start</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition"
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm font-semibold">Stop</span>
            </motion.button>
          )}

          {/* Switch front ↔ back camera */}
          <motion.button
            onClick={switchCamera}
            className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm text-gray-700 transition"
            whileTap={{ scale: 0.95 }}
          >
            Switch
          </motion.button>
        </div>

        {/* Recorded video preview section */}
        {videoURL && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Recorded Video Preview
            </h3>
            <video
              src={videoURL}
              controls
              className="w-full max-w-md rounded-xl border border-gray-300 shadow-md"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
