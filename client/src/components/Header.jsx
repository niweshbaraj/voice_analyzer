import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);

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
                <li>Transcriptions</li>
              </Link>

              <Link to="/stats">
                <li>Stats</li>
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
