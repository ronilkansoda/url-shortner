'use client';

// import { getLinks } from "../lib/db";  // it was directly using the function from the db 
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());
// const fetcher = async (url) => (await fetch(url)).ok ? await fetch(url).then(res => res.json()) : Promise.reject('Failed to fetch data');

export default function LinksTable() {
    const endpoint = "/api/links";

    const { data, error } = useSWR(endpoint, fetcher, { refreshInterval: 1000 }); // Fetch only when user is active from links api

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;
    console.log(data);


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Links Table</h1>

                {data?.length ? (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-2">ID</th>
                                    <th scope="col" className="px-6 py-2">URL</th>
                                    <th scope="col" className="px-6 py-2">Short URL</th>
                                    <th scope="col" className="px-6 py-2">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((link) => (
                                    <tr key={link.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">{link.id}</td>
                                        <td className="px-6 py-3 text-blue-500 truncate">
                                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                                        </td>
                                        <td className="px-6 py-3">{link.short || "N/A"}</td>
                                        <td className="px-6 py-3">{new Date(link.createdAt).toLocaleString()}</td>
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
    );
}