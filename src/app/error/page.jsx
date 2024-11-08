async function getData() {
    const endpoint = "http://loclhost:3000/api/post"
    const res = await fetch(endpoint);

    if (!res.ok) {
        throw new Error("Failed to fetch the data")
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
