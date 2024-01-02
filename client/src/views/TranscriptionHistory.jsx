import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setTranscription } from '../redux/transcriptions/transcriptionSlice';

const TranscriptionHistory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentTranscription } = useSelector((state) => state.transcription);
  const [transcriptions, setTranscriptions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let isCancelled = false;

    const fetchTranscriptions = async () => {
      try {
        const res = await fetch(
          `/api/transcriptions/getTranscriptions/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              contentType: "application/json",
              Accept: "application/json",
            },
          }
        );
        const data = await res.json();

        if (!isCancelled) {
          if (!res.ok) {
            console.log(data);
            return;
          }
          setTranscriptions(data["transcriptions"]);
          dispatch(setTranscription(data));
          console.log(transcriptions);
        }
      } catch (error) {
        console.error("Error fetching transcriptions:", error);
      }
    };

    fetchTranscriptions();

    return () => {
      isCancelled = true;
    };
  }, []);

  const deleteTranscript = async (t_id) => {
    const result = confirm("Are you sure you want to delete this transcript");
    if (result) {
      try {
        const res = await fetch(
          `/api/transcriptions/deleteTranscription/${currentUser._id}/${t_id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Something bad happened");
          return;
        }
        alert(data);
        setTranscriptions((prevItems) => prevItems.filter((item) => item._id !== t_id));
        window.location.reload();
      } catch (error) {
        console.log("Error deleting transcription:", error);
      }
    }
  };

  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-left my-7">
        Your Transcriptions
      </h1>

      {/* <ul>
        {transcriptions
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((transcription, index) => (
            <li key={index}>
              {index + 1} {transcription.transcription}
            </li>
          ))}
      </ul> */}

      <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {currentTranscription && currentTranscription.transcriptions.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((transcription, index) => (
            <>
              <li key={index} className="pb-3 py-3 sm:pb-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}. {transcription.transcription}
                    </p>

                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      Date :{" "}
                      {transcription.createdAt
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                      ; Time :{" "}
                      {transcription.createdAt.split("T")[1].split(".")[0]}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <button
                      type="button"
                      className=" bg-red-700 text-white p-2 rounded-md uppercase hover:opacity-90 disabled:opacity-80"
                      onClick={() => deleteTranscript(transcription._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            </>
          ))}
      </ul>
    </div>
  );
};

export default TranscriptionHistory;
