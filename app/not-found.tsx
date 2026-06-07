"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  // Your searchable content with associated keywords
  const searchData = [
    {
      keywords: ["login", "sign in", "access"],
      answer: "To log in, Go to Homepage click 'Signin' at the top right and enter your credentials.",
    },
    {
      keywords: ["register", "signup", "create account"],
      answer: "To register, Go to Homepage click 'Signin' and complete the sign-up form.",
    },
    {
      keywords: ["contact", "support", "help"],
      answer: "You can contact support through our contact form available below.",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSubmittedQuery(query.trim().toLowerCase());
    }
  };

  const matchedResult = searchData.find((item) =>
    item.keywords.some((keyword) =>
      submittedQuery.includes(keyword.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-10 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div>
        <Image
          src="/magic-hat.svg"
          alt="Magic Hat Illustration"
          width={500}
          height={300}
          className="w-full h-auto mx-auto drop-shadow-md dark:opacity-90"
        />
      </div>

      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Uh-oh! This page has disappeared into thin air.
      </h1>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
        Like a magician’s trick gone slightly sideways... but don’t worry—we’ve still got plenty of magic to help you out.
      </p>

      <form onSubmit={handleSearch} className="flex w-full max-w-md mb-6 shadow-sm rounded-lg">
        <input
          type="text"
          placeholder="Search DraftDeckAI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      {submittedQuery && (
        <div className="max-w-md w-full text-left mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Search Results:</h2>
          {matchedResult ? (
            <p className="text-gray-700 dark:text-gray-300">{matchedResult.answer}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No results found for "<strong className="text-gray-900 dark:text-white">{submittedQuery}</strong>"
            </p>
          )}
        </div>
      )}

      <div className="space-x-4 mb-8 mt-4">
        <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-sm inline-block">
          Back to Homepage
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <Link href="/documentation" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline font-medium">
          Browse Docs
        </Link>
        <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline font-medium">
          Contact Support
        </Link>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-12">
        Looks like this spell didn’t work. Let’s try a different trick! 🪄
      </p>
    </div>
  );
}