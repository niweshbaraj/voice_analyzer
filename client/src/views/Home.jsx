function Home() {
    return (
      <div className="px-4 py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">
          Welcome to Voice Analyzer!
        </h1>
        <p className="mb-4 text-slate-700">
          This is a voice analyzer web application built with the MERN (MongoDB,
          Express, React, Node.js) stack. It includes authentication features that
          allow users to sign up, log in, and log out, and provides access to
          protected routes only for authenticated users.
        </p>
      </div>
    );
  }
  
  export default Home;
  