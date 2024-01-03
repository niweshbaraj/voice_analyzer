import natural from "natural";
import { ObjectId } from 'mongodb';

import { errorHandler } from "../utils/error.js";

import User from "../models/user.model.js";
import Transcription from "../models/transcription.model.js";

const stopWords = [
  "a",
  "an",
  "and",
  "the",
  "is",
  "are",
  "in",
  "on",
  "at",
  "to",
  "of",
  "for",
  "with",
  "I",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "your",
  "his",
  "its",
  "our",
  "their",
  "mine",
  "yours",
  "hers",
  "ours",
  "theirs",
  "this",
  "that",
  "these",
  "those",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "can",
  "could",
  "may",
  "might",
  "must",
  "am",
  "is",
  "was",
  "were",
  "about",
  "above",
  "across",
  "after",
  "against",
  "along",
  "among",
  "around",
  "as",
  "at",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "between",
  "beyond",
  "but",
  "by",
  "concerning",
  "considering",
  "despite",
  "down",
  "during",
  "except",
  "for",
  "from",
  "in",
  "inside",
  "into",
  "like",
  "near",
  "of",
  "off",
  "on",
  "onto",
  "out",
  "outside",
  "over",
  "past",
  "regarding",
  "round",
  "since",
  "through",
  "to",
  "toward",
  "under",
  "underneath",
  "until",
  "unto",
  "up",
  "upon",
  "with",
  "within",
  "without",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export const transcriptionStats = async (req, res, next) => {
  if (req.user._id !== req.params.id) {
    return next(
      errorHandler(401, "You can only get your trasncriptions stats!")
    );
  }
  const userId = req.user._id;
  try {
    const transcriptions = await getUserTranscriptions(userId);
    const mostFrequentWords = await calculateMostFrequentWords(transcriptions);
    const sortedWords = Object.keys(mostFrequentWords)
      .sort((a, b) => mostFrequentWords[b] - mostFrequentWords[a])
      .slice(0, 5)
      .map((word) => ({ word, frequency: mostFrequentWords[word] }));

    // Identify the top 3 unique phrases spoken by the user
    const topUniquePhrases = await identifyTopUniquePhrases(transcriptions);

    const allTranscriptions = await getAllTranscriptions();
    const mostFrequentWordsAllUsers = await calculateMostFrequentWords(
      allTranscriptions
    );
    const sortedWordsAllUsers = Object.keys(mostFrequentWordsAllUsers)
      .sort(
        (a, b) => mostFrequentWordsAllUsers[b] - mostFrequentWordsAllUsers[a]
      )
      .slice(0, 5)
      .map((word) => ({ word, frequency: mostFrequentWordsAllUsers[word] }));

    const allUsers = await fetchAllUsers();
    const allUsersWordFrequency = {};
    for (const user of allUsers) {
      const userTranscriptions = await getUserTranscriptions(user._id);
      console.log(userTranscriptions);
      allUsersWordFrequency[user._id] = await calculateMostFrequentWords(
        userTranscriptions
      );
    }

    // similar users speech
    const currentUserVector = calculateTFIDFVector(transcriptions);
    const allUsersVectors = await calculateTFIDFVectorsForAllUsers();
    const similarUsers = findMostSimilarUsers(
      userId,
      currentUserVector,
      allUsersVectors
    );

    const comparisonResults = await compareWordFrequencyWithAllUsers(
      userId,
      sortedWords,
      allUsersWordFrequency
    );

    res
      .status(200)
      .json({
        sortedWords,
        sortedWordsAllUsers,
        topUniquePhrases,
        similarUsers,
        comparisonResults,
      });
  } catch (error) {
    console.error("Error calculating most frequent words:", error);
    next(error);
  }
};

const calculateMostFrequentWords = async (userTranscriptions) => {
  try {
    const wordFrequency = {};
    // const allTranscriptions = userTranscriptions.map(transcription => transcription.transcription);
    userTranscriptions.forEach((transcription) => {
      const words = transcription.toLowerCase().match(/\b\w+\b/g) || [];
      const s_words = stopWords.map((word) => word.toLowerCase());
      const filteredWords = words.filter((word) => !s_words.includes(word));
      filteredWords.forEach((word) => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });
    return wordFrequency;
  } catch (error) {
    console.error("Error calculating most frequent words:", error);
    throw new Error(error);
  }
};

// Fetch all users from the database
const fetchAllUsers = async () => {
  try {
    const allUsers = await User.find().lean();
    return allUsers;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error(error);
  }
};

// Fetch all transcriptions for a user
const getUserTranscriptions = async (userId) => {
  try {
    const userTranscriptions = await Transcription.find({ userId }).lean();
    return userTranscriptions.map(
      (transcription) => transcription.transcription
    );
  } catch (error) {
    console.error("Error fetching user transcriptions:", error);
    throw new Error(error);
  }
};

// Fetch all transcriptions for all users
const getAllTranscriptions = async () => {
  try {
    const allTranscriptions = await Transcription.find().lean();
    return allTranscriptions.map(
      (transcription) => transcription.transcription
    );
  } catch (error) {
    console.error("Error fetching all transcriptions:", error);
    throw new Error(error);
  }
};

const compareWordFrequencyWithAllUsers = async (
  currentUserId,
  mostFrequentWords,
  allUsersWordFrequency
) => {
  try {
    // Compare word frequency of the current user with all users
    const comparisonResults = {};

    for (const userId of Object.keys(allUsersWordFrequency)) {
      if (userId !== currentUserId) {
        const otherUserWordFrequency = allUsersWordFrequency[userId];

        // Calculate a similarity score based on common words 
        const similarityScore = mostFrequentWords.reduce((score, wordInfo) => {
          const word = wordInfo.word;
          const currentFrequency = wordInfo.frequency || 0;
          const otherUserFrequency = otherUserWordFrequency[word] || 0;
          score += Math.min(currentFrequency, otherUserFrequency);
          return score;
        }, 0);

        comparisonResults[userId] = similarityScore;
      }
    }

    return comparisonResults;
  } catch (error) {
    console.error("Error comparing word frequency with all users:", error);
    throw new Error(error);
  }
};

const identifyTopUniquePhrases = async (allUserTranscriptions) => {
  try {
    // Combine all user transcriptions into a single text
    const combinedText = allUserTranscriptions.join(" ");

    // Tokenize the text into phrases (you may need a more sophisticated tokenizer)
    const phrases = combinedText.split(/[\.\?!]/);

    // Count the frequency of each phrase
    const phraseFrequency = {};
    phrases.forEach((phrase) => {
      const normalizedPhrase = phrase.toLowerCase().trim();
      if (normalizedPhrase !== "") {
        phraseFrequency[normalizedPhrase] =
          (phraseFrequency[normalizedPhrase] || 0) + 1;
      }
    });

    // Sort phrases by frequency in descending order
    const sortedPhrases = Object.keys(phraseFrequency).sort(
      (a, b) => phraseFrequency[b] - phraseFrequency[a]
    );

    // Return the top 3 unique phrases
    return sortedPhrases
      .slice(0, 3)
      .map((phrase) => ({ phrase, frequency: phraseFrequency[phrase] }));
  } catch (error) {
    console.error("Error identifying top unique phrases:", error);
    throw new Error("Internal Server Error");
  }
};

// Speech Similarity

const calculateTFIDFVector = (transcriptions) => {
  const tfidf = new natural.TfIdf();

  // Add each transcription to the TF-IDF model
  transcriptions.forEach((transcription) => {
    const words = transcription.toLowerCase().match(/\b\w+\b/g) || [];
    const s_words = stopWords.map((word) => word.toLowerCase());
    const filteredWords = words.filter((word) => !s_words.includes(word));
    tfidf.addDocument(filteredWords);
  });

  // Calculate the TF-IDF vector for the user
  const vector = {};
  tfidf.listTerms(0).forEach((term) => {
    vector[term.term] = term.tfidf;
  });

  return vector;
}

const calculateTFIDFVectorsForAllUsers = async () => {
  try {
    const allUsers = await fetchAllUsers();
    const allUsersVectors = [];

    for (const user of allUsers) {
      const userTranscriptions = await getUserTranscriptions(user._id);
      const userVector = calculateTFIDFVector(userTranscriptions);
      allUsersVectors.push({ userId: user._id, username: user.username, vector: userVector });
    }

    return allUsersVectors;
  } catch (error) {
    console.error("Error calculating TF-IDF vectors for all users:", error);
    throw new Error("Internal Server Error");
  }
};

const findMostSimilarUsers = (
  currentUserId,
  currentUserVector,
  allUsersVectors
) => {
  try {
    const similarityResults = [];
    const currentUserIdObject = new ObjectId(currentUserId);
    // Calculate cosine similarity between the current user and all other users
    allUsersVectors.forEach((user) => {
        const userObjectId = new ObjectId(user.userId);
      if (!userObjectId.equals(currentUserIdObject)) {
        const similarity = calculateCosineSimilarity(
          currentUserVector,
          user.vector
        );
        if (similarity > 0.2){
            similarityResults.push({ userId: user.userId, username: user.username, similarity });
        }
      }
    });

    // Sort users by similarity in descending order
    const sortedUsers = similarityResults.sort(
      (a, b) => b.similarity - a.similarity
    );

    // Return the top 3 most similar users
    return sortedUsers.slice(0, 3);
  } catch (error) {
    console.error("Error finding most similar users:", error);
    throw new Error("Internal Server Error");
  }
};

const calculateCosineSimilarity = (vectorA, vectorB) => {
  const dotProduct = Object.keys(vectorA).reduce((product, term) => {
    return product + (vectorA[term] || 0) * (vectorB[term] || 0);
  }, 0);

  const magnitudeA = Math.sqrt(
    Object.values(vectorA).reduce((sum, value) => sum + value ** 2, 0)
  );
  const magnitudeB = Math.sqrt(
    Object.values(vectorB).reduce((sum, value) => sum + value ** 2, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Prevent division by zero
  }

  return dotProduct / (magnitudeA * magnitudeB);
};
