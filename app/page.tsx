"use client"
import Image from "next/image";
import { useState, FormEvent } from "react";

export default function Home() {
  const [input, setInput] = useState<string>(''); // Manage the textarea input state
  const [response, setResponse] = useState<any>(null); // Store API response
  const [loading, setLoading] = useState<boolean>(false); // Manage loading state
  const [error, setError] = useState<string | null>(null); // Manage error state

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://127.0.0.1:5000/api?query=' + input, { // Update with your Flask API URL
        method: 'GET', // Use GET method for query parameter
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error: ${errorData.message}`);
      }

      const data = await res.json();
      setResponse(data.response); // Only store the 'response' field from the API response
    } catch (err: any) {
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl">Input your department goal here...</h1>
        
        {/* Textarea for user input */}
        <textarea
          className="center w-96 h-20 p-4 text-lg bg-gray-100 rounded-lg text-amber-950"
          placeholder="Type something..."
          value={input} // Controlled input
          onChange={(e) => setInput(e.target.value)} // Update state on change
        ></textarea>
        
        {/* Submit Button */}
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSubmit} // Call the API on button click
        >
          Submit
        </button>

        {/* Display Loading, Error, or Response */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {response && (
          <div>
            <h2>Response:</h2>
            <pre>{response}</pre> {/* Only show the 'response' field */}
          </div>
        )}
      </main>
      
      {/* Footer Section */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
