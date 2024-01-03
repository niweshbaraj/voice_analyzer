import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import About from './views/About';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Profile from './views/Profile';
import Header from './components/Header';
import TranscriptionHistory from './views/TranscriptionHistory';
import VoiceAnalyzer from './views/VoiceTranscription';
import TranscriptionStats from './views/TranscriptionStats';
import PrivateRoute from './components/PrivateRoute';

function App() {
  
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/voice_analyzer" element={<VoiceAnalyzer />} /> 
          <Route path="/transcription_history" element={<TranscriptionHistory />} />
          <Route path="/stats" element={<TranscriptionStats />} />     
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
