import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setTranscription } from '../redux/transcriptions/transcriptionSlice';
import { setTranscriptionStats } from '../redux/transcriptions/transcriptionStatsSlice';

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchTranscriptions = async () => {
    try {
      const res = await fetch(
        `/api/transcriptions/getTranscriptions/${currentUser._id}`,
        {
            method: "POST",
            headers: {
            Authorization: `Bearer ${currentUser.token}`,
            contentType: "application/json",
          },
        }
      );
      const data = await res.json();

        if (!res.ok) {
          console.log(data);
          return;
        }
        dispatch(setTranscription(data));
    } catch (error) {
      console.error("Error fetching transcriptions:", error);
    }
  };

  const fetchTranscriptionStats = async () => {
    try {
      const res = await fetch(
        `/api/transcriptions/getStats/${currentUser._id}`,
        {
            method: "POST",
            headers: {
            Authorization: `Bearer ${currentUser.token}`,
            contentType: "application/json",
          },
        }
      );
      const data = await res.json();

        if (!res.ok) {
          console.log(data);
          return;
        }
        dispatch(setTranscriptionStats(data));
      
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold">Voice Analyzer</h1>
        </Link>
        <ul className="flex gap-4">
          {currentUser ? (
            <>
              <Link to="/voice_analyzer">
                <li>Voice Analyzer</li>
              </Link>

              <Link to="/transcription_history">
                <li onClick={fetchTranscriptions}>Transcriptions</li>
              </Link>

              <Link to="/stats">
                <li onClick={fetchTranscriptionStats}>Stats</li>
              </Link>

              <Link to="/profile">
                <img
                  src={currentUser.profilePicture}
                  alt={`profile picture of ${currentUser.name}`}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <li>Sign In</li>
              </Link>
              <Link to="/sign-up">
                <li>Sign Up</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;
