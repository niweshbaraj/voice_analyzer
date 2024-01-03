import { Link } from 'react-router-dom';

function Home() {
  // const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        Welcome to Voice Analyzer!
      </h1>
      
      <p className="mb-4 text-slate-700">
        Unleash the potential of your voice with <span className="text-pink-400 font-bold">Voice Analyzer</span>, your go-to
        platform for powerful speech insights. Our innovative application
        transforms spoken words into meaningful data, offering a comprehensive
        suite of features designed to enhance your communication experience.
      </p>

      <p className="mb-4 text-slate-700">
        Built with the MERN (MongoDB,Express, React, Node.js) tech stack and using Whisper.ai model from <span className="text-yellow-400 font-bold">HuggingFace</span> . It includes authentication
        features that allow users to sign up, log in, and log out, and provides
        access to protected routes only for authenticated users. It also
        includes <span className="underline">Google Authentication</span>{" "}
        features where you can use your google Id to signup/signin.
      </p>

      <h3 className="text-2xl font-bold mb-4 text-slate-800">Key Features :</h3>

      <p className="mb-4 text-slate-700">

        <ul>
            <li>
            <span className="font-bold">Speech Transcription :</span> Effortlessly convert spoken words into text in real-time.
            </li>

            <li>
            <span className="font-bold">Language Translation :</span> Seamlessly translate transcriptions to English for a global communication experience.
            </li>

            <li>
            <span className="font-bold">User History :</span> Keep track
        of your speech history, stored securely for easy reference.
            </li>

            <li>
            <span className="font-bold">Word
        Frequency Analysis :</span> Gain insights into your speech patterns with a
        breakdown of the most frequently used words.
            </li>

            <li>
            <span className="font-bold">Unique Phrase
        Identification :</span> Discover the top three unique phrases that make your
        voice distinctive.
            </li>

            <li>
            <span className="font-bold">Similarity Detector :</span> Explore connections with others
        by finding users with similar speech patterns.
            </li>
            
        </ul> 
      </p>

      <h3 className="text-2xl font-bold mb-4 text-slate-800">How It Works :</h3>

      <p className="mb-4 text-slate-700">
      <ul>
            <li>
            <span className="font-bold">Speak :</span> Input your speech through the app speech recognition feature.
            </li>

            <li>
            <span className="font-bold">Analyze :</span> Explore transcriptions, translations, and detailed analytics.
            </li>

            <li>
            <span className="font-bold">Connect :</span> Discover similar users and build connections based on shared speech patterns.
            </li>

            </ul>
      </p>

      <h3 className="text-2xl font-bold mb-4 text-slate-800">Join Us Now and Amplify Your Voice!</h3>
      <p className="mb-4 text-slate-700">
      [<Link to="/sign-up">Sign Up</Link> / <Link to="/sign-in">Sign In</Link>]
      </p>

    </div>
  );
}

export default Home;
