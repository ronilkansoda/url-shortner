import getDomain from "../lib/getDomain";

async function getData() {
    const domain = getDomain();
    const endpoint = `${domain}/api/post`
    const res = await fetch(endpoint);

    if (!res.ok) {
        throw new Error("Failed to fetch the data")
    }

    if (res.headers.get("content-type") != "application/json") {
        return { items: [] }
    }

    return res.json();
}

export default async function page() {
    const data = await getData();
    const items = data && data.items ? [...data.items] : [];

    return (
        <div className='flex justify-center '>
            {/* <h1 className='bg-slate-300 text-black p-3 rounded-lg'>Ronil</h1> */}
            {/* <p>and there is data <span>{data.items[0].title ? data.items[0].title : "none"}</span></p> */}

            {items.map((item) => (
                <li key={item.id}>{item.title}</li>
            ))}


        </div>
    )
}
