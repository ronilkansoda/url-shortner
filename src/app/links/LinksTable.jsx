'use client';

// import { getLinks } from "../lib/db";  // it was directly using the function from the db 
import useSWR from 'swr';
import LinkCreateFoarm from './createFoam';
import { useState, useEffect } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());
// const fetcher = async (url) => (await fetch(url)).ok ? await fetch(url).then(res => res.json()) : Promise.reject('Failed to fetch data');

export default function LinksTable() {
    const endpoint = "/api/links";
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // const { data, error, mutate } = useSWR(endpoint, fetcher, { refreshInterval: 1000 }); // Fetch only when user is active from links api
    const { data, error, mutate } = useSWR(isLoggedIn ? endpoint : null, fetcher, { refreshInterval: 1000 }); // Only fetch data if logged in

    useEffect(() => {
        // Check session status
        const checkSession = async () => {
            try {
                const res = await fetch("/api/session"); // Assuming you create an API route for session check
                if (res.ok) {
                    const { user } = await res.json();
                    setIsLoggedIn(!!user); // Set logged-in status based on response
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking session:", error);
                setIsLoggedIn(false);
            }
        };

        checkSession();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="p-12 text-center">
                <p className="text-gray-800 text-3xl">Session Expired!! Login again</p>
            </div>
        );
    }
    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;
    console.log(data);

    const didSubmit = () => {
        mutate()
    }

    return (
        <div className="p-6 sm:p-12">
            <LinkCreateFoarm didSubmit={didSubmit} />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Links Table</h1>

                    {data?.length ? (
                        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                    <tr>
                                        <th scope="col" className="px-4 py-2 sm:px-6">ID</th>
                                        <th scope="col" className="px-4 py-2 sm:px-6">URL</th>
                                        <th scope="col" className="px-4 py-2 sm:px-6">Short URL</th>
                                        <th scope="col" className="px-4 py-2 sm:px-6">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((link) => (
                                        <tr key={link.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 sm:px-6 font-medium text-gray-900">{link.id}</td>
                                            <td className="px-4 py-3 sm:px-6 max-w-[200px] truncate overflow-hidden text-blue-500">
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.url}>
                                                    {link.url}
                                                </a>
                                            </td>
                                            {/* <td className="px-4 py-3 sm:px-6">{link.short || "N/A"}</td> */}
                                            <td className="px-4 py-3 sm:px-6 text-blue-500 truncate max-w-[200px]">
                                                <a
                                                    href={`https://url-shortner-ronils-projects.vercel.app/${link.short}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={`https://url-shortner-ronils-projects.vercel.app/${link.short}`}
                                                >
                                                    {`https://url-shortner-ronils-projects.vercel.app/${link.short}`}
                                                </a>
                                            </td>

                                            <td className="px-4 py-3 sm:px-6">{new Date(link.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center bg-white p-6 rounded-lg shadow">
                            <p className="text-gray-800">No links found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}