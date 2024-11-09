import getDomain from "../lib/getDomain";
import Card from "./Card";

async function getData() {
    try {
        const domain = getDomain();
        const endpoint = `${domain}/api/post`;

        const res = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error('Fetch error:', res.status, res.statusText);
            return { items: [] };
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return { items: [] };
    }
}

export default async function Page() {
    const data = await getData();
    const items = data?.items || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-stone-950 text-2xl font-bold mb-6 text-center">Blog Posts</h1>

                {items.length === 0 ? (
                    <div className="text-center bg-white p-6 rounded-lg shadow">
                        <p className="text-stone-950">No posts found</p>
                    </div>
                ) : (
                    <div className="text-black flex justify-evenly">
                        {items.map((item) => {
                            return <Card title={item.title} key={item.id} />
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}