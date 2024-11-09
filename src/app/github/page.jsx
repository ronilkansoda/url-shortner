'use client'
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function GitProfile() {
    const myGithubRepoProfile = "https://api.github.com/repos/ronilkansoda/url-shortner";

    const { data, error } = useSWR(myGithubRepoProfile, fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;
    console.log(data);


    return (
        <div>
            <h1>{data.name}</h1>
            <p>{data.owner.login}</p>
            <p>{data.owner.type}</p>
        </div>
    );
}
