export default function BlogPostDetails(slug) {
    console.log(slug);

    return (
        <main className='flex justify-center '>
            <h1 className='bg-slate-300 text-black p-3 rounded-lg'>
                This is params: {slug}
            </h1>
        </main>
    );
}
