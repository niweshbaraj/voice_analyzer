import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Buffer } from "buffer";

import { HfInference } from "@huggingface/inference";
const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_ACCESS_TOKEN);

const mimeType = "audio/mp3";

function VoiceTranscription() {
  const { currentUser } = useSelector((state) => state.user);

  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [transcription, setTranscription] = useState("");
  //   const [audioBuffer, setAudioBuffer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      const buffer = Buffer.from(await audioBlob.arrayBuffer());
      const transcribe = await transcribeAudio(buffer);
      setTranscription(transcribe);
      await saveTranscription(transcribe);
      setAudioChunks([]);
    };
    setReset(true);
  };

  const transcribeAudio = async (buffer) => {
    setLoading(true);
    const response = await hf.automaticSpeechRecognition({
      data: buffer,
      model: "openai/whisper-large-v2",
    });
    const data = response.text;
    // setTranscription(data);
    setLoading(false);
    return data;
  };

  const saveTranscription = async (transcribe) => {
    try {
      const res = await fetch(
        `/api/transcriptions/saveTranscription/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ transcription: transcribe }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.log("Something bad happened");
        return;
      }
    } catch (error) {
      console.log("Error submitting transcription:", error);
    }
  };

  const resetBtn = () => {
    setRecordingStatus("inactive");
    setTranscription("");
    setAudio(null);
    setLoading(false);
    setReset(false);
  };

  return (
    <div className="p-3 max-w-lg mx-auto m-7">
        <p className="mb-4 text-slate-700">
          Click on <span className="text-green-500">Start Recording</span> to start the recording. <span className="text-red-500">Red Dot</span> will blink until you press <span className="text-red-600">Stop Recording</span>. Wait for few seconds (sometimes it takes more time) for transcriptions to load.
          Then, if you want to generate new transcription, Press <span className="text-gray-500">RESET</span> to start fresh.
        </p>

        <p className="mb-4 text-slate-700">
            Your Transcriptions will be saved when you press <span className="text-red-600">Stop Recording</span>. You can see your transcriptions by clicking on <span className="underline">Transcriptions</span> at top.
        </p>
      <div className="flex flex-col gap-4">
        {!permission ? (
          <button
            type="button"
            className=" bg-yellow-500 text-white p-3 rounded-md uppercase hover:opacity-90 disabled:opacity-80"
            onClick={getMicrophonePermission}
          >
            Get Microphone
          </button>
        ) : null}
        {permission && recordingStatus === "inactive" ? (
          <button
            type="button"
            className=" bg-green-500 text-white p-3 rounded-md uppercase hover:opacity-90 disabled:opacity-80"
            onClick={startRecording}
          >
            Start Recording
          </button>
        ) : null}
        {recordingStatus === "recording" ? (
          <>
            <button
              type="button"
              className=" bg-red-600 text-white p-3 rounded-md uppercase hover:opacity-90 disabled:opacity-80"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
            <span className="relative flex justify-end h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </>
        ) : null}

        {reset ? (
          <button
            type="button"
            className=" bg-gray-500 text-white p-3 rounded-md uppercase hover:opacity-90 disabled:opacity-80"
            onClick={resetBtn}
          >
            Reset
          </button>
        ) : null}

        <br />

        {audio ? (
          <div>
            <audio src={audio} controls className="ml-14"></audio>
          </div>
        ) : null}

        <br />

        {transcription ? (
          <div className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {transcription}
            </p>
          </div>
        ) : null}
        <br />
        {loading ? (
          <div className="flex items-center justify-center">
            Please wait... Transcription will appear here. &nbsp; &nbsp;
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default VoiceTranscription;
