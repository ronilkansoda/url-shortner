'use client';
import { useState } from "react";

export default function LinkCreateFoarm({ didSubmit }) {
    const [results, setResults] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const JSONData = JSON.stringify(data);

        const endPoint = "/api/links";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONData,
        };

        try {
            const response = await fetch(endPoint, options);

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Something went wrong');
            }

            const result = await response.json();
            setResults(result);
            setErrorMessage(null);  // Reset error message on success
            if (didSubmit) {
                didSubmit(result)
            }
        } catch (error) {
            setResults(null);  // Reset results on error
            setErrorMessage(error.message);  // Display error message
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} >
                <input
                    className="p-2 border-black border-2 rounded-md"
                    type="text"
                    name="url"
                    placeholder="Enter Your Url"
                />
                <button
                    type="submit"
                    className="bg-slate-400 px-2 py-1 rounded-lg m-3 text-lg"
                >
                    Shorten
                </button>
            </form>

            {results && <div>{JSON.stringify(results)}</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
}
