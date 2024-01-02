import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { setTranscriptionStats } from '../redux/transcriptions/transcriptionStatsSlice';

const TranscriptionStats = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { transcriptionStats } = useSelector((state) => state.stats);
  const [mostFrequentWords, setMostFrequentWords] = useState([]);
  const [mostFrequentWordsAllUsers, setMostFrequentWordsAllUsers] = useState(
    []
  );
  const [topUniquePhrases, setTopUniquePhrases] = useState([]);
  const [similarUsers, setSimilarUsers] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    const fetchTranscriptions = async () => {
      try {
        const res = await fetch(
          `/api/transcriptions/getStats/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              contentType: "application/json",
            },
          }
        );
        const data = await res.json();

        if (!isCancelled) {
          if (!res.ok) {
            console.log(data);
            return;
          }
          setMostFrequentWords(data["sortedWords"]);
          setMostFrequentWordsAllUsers(data["sortedWordsAllUsers"]);
          setTopUniquePhrases(data["topUniquePhrases"]);
          setSimilarUsers(data["similarUsers"]);
          setTranscriptionStats(data);
          console.log(data);
          console.log(mostFrequentWords);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchTranscriptions();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-left my-7">
        Transcription Stats
      </h1>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Your Frequent Words
              </th>
              <th scope="col" className="px-6 py-3">
                All Frequent Words
              </th>
            </tr>
          </thead>
          <tbody>
            {transcriptionStats && transcriptionStats.sortedWords.map((words, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {words.word}
                </th>

                {transcriptionStats && transcriptionStats.sortedWordsAllUsers[index] && (
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {transcriptionStats && transcriptionStats.sortedWordsAllUsers[index].word}
                  </th>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />

      {transcriptionStats && transcriptionStats.topUniquePhrases.length > 0 ? (
        <>
          <h2 className="text-3xl font-semibold text-left my-7">
            Your Top 3 Phrases :
          </h2>

          <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            {transcriptionStats && transcriptionStats.topUniquePhrases.map((phrase, index) => (
              <>
                <li key={index} className="pb-3 py-3 sm:pb-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}. {phrase.phrase}
                      </p>
                    </div>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </>
      ) : (
        <h2 className="text-3xl font-semibold text-left my-7">
          No Top Phrases to display yet!
        </h2>
      )}

      <br />

      {transcriptionStats && transcriptionStats.similarUsers.length > 0 ? (
        <>
          <h2 className="text-3xl font-semibold text-left my-7">
            Similar Users :
          </h2>

          <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            {transcriptionStats && transcriptionStats.similarUsers.map((user, index) => (
              <>
                <li key={index} className="pb-3 py-3 sm:pb-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}. {user.username}
                      </p>
                    </div>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </>
      ) : (
        <h2 className="text-3xl text-red-400 font-semibold text-left my-7">
          Similar Speeches Not Found!
        </h2>
      )}

      {/* <ul>
        {mostFrequentWords
          .map((words, index) => (
            <li key={index}>
              {index + 1} {words.word}
            </li>
          ))}
      </ul>

      <ul>
        {mostFrequentWordsAllUsers
          .map((words, index) => (
            <li key={index}>
              {index + 1} {words.word}
            </li>
          ))}
      </ul> */}
    </div>
  );
};

export default TranscriptionStats;
