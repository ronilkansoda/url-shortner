import { notFound, redirect } from "next/navigation";
import { getShortLinksRecord } from "../lib/db";

export default async function ShortPage({ params }) {
    const { short } = await params;
    if (!short) notFound();
    const [record] = await getShortLinksRecord(short)
    if (!record) notFound();

    const { url } = record;
    if (!url) notFound();

    redirect(url, "push");
}