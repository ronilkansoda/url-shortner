import { notFound, redirect } from "next/navigation";
import { getShortLinksRecord, saveLinkVisit } from "../lib/db";
import getDomain from "../lib/getDomain";

async function triggerVisit(linkId) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ linkId: linkId })
    }
    const domain = getDomain()
    const endpoint = `${domain}/api/visits/`
    return await fetch(endpoint, options)
}

export default async function ShortPage({ params }) {
    const { short } = await params;
    if (!short) notFound();
    const [record] = await getShortLinksRecord(short)
    if (!record) notFound();

    const { url, id } = record;
    if (!url) notFound();

    if (id) {
        await triggerVisit(id)
    }
    // return <h1>{url}</h1>
    redirect(url, "push");
}