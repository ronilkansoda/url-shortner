import { getLinks } from "../lib/db";

export default async function LinksTable() {
    const linkResponse = await getLinks();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Links Table</h1>

                {linkResponse?.length ? (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">ID</th>
                                    <th scope="col" className="px-6 py-3">URL</th>
                                    <th scope="col" className="px-6 py-3">Short URL</th>
                                    <th scope="col" className="px-6 py-3">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {linkResponse.map((link) => (
                                    <tr key={link.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{link.id}</td>
                                        <td className="px-6 py-4 text-blue-500 truncate">
                                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                                        </td>
                                        <td className="px-6 py-4">{link.short || "N/A"}</td>
                                        <td className="px-6 py-4">{new Date(link.createdAt).toLocaleString()}</td>
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
