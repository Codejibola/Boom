import { useRef, useState, useEffect } from 'react';

export default function VideoRecorder() {
  const videoRef = useRef();
  const recorderRef = useRef();
  const chunksRef = useRef([]);
  const [chunks, setChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    chunksRef.current = chunks;
  }, [chunks]);

  
  useEffect(() => {
    async function setupCamera() {
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: { exact: facingMode },
        },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setChunks((prev) => [...prev, e.data]);
      };

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
        console.log("Recorded blob:", blob);
      };

      setCameraReady(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Failed to access the camera.");
    }
  };
    setupCamera();
  }, [facingMode]);

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6 text-center">
        <h2 className="text-3xl font-bold text-blue-700">BOOM</h2>
        <p className="mt-2 text-gray-500 text-base">
          Record a segment of the movie here
        </p>

        <video
          ref={videoRef}
          autoPlay
          muted
          className="mt-6 w-full max-w-md rounded-xl border border-gray-300 shadow-md"
        />

        <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={!cameraReady}
              className={`w-16 h-16 rounded-full ${
                cameraReady
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white flex items-center justify-center shadow-md transition`}
            >
              <span className="text-sm font-semibold">Start</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition"
            >
              <span className="text-sm font-semibold">Stop</span>
            </button>
          )}

          <button
            onClick={switchCamera}
            className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm text-gray-700 transition"
          >
            Switch
          </button>
        </div>

        {videoURL && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Recorded Video Preview
            </h3>
            <video
              src={videoURL}
              controls
              className="w-full max-w-md rounded-xl border border-gray-300 shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
