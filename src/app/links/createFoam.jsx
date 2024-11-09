'use client'
import { useState } from "react";

export default function LinkCreateFoarm() {
    const [results, setResults] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const foarmData = new FormData(e.target);
        const data = Object.fromEntries(foarmData);
        const JSONData = JSON.stringify(data);

        const endPoint = "/api/links"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSONData
        }
        
        try {
            const response = await fetch(endPoint, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result)
            setResults(result);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input className="p-2 border-black border-2 rounded-md" type="text" name="url" placeholder="Enter Your Url" />
                <button type="submit" className="bg-slate-400 px-2 py-1 rounded-lg m-3 text-lg">Shorten</button>
            </form>
            {results && JSON.stringify(results)}
        </div>
    )
}
