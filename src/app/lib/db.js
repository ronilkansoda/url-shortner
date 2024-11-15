import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { LinksTable } from "./schema";


const sql = neon(process.env.DATABASE_URL)
neonConfig.fetchConnectionCache = true;
const db = drizzle(sql);


export async function helloworld() {

    const [dbResponse] = await sql`SELECT NOW()`
    const dbNow = dbResponse && dbResponse.now ? dbResponse.now : ""; // this will gives me string
    return dbNow
}

async function configureDatabase() {
    try {
        const [dbResponse] = await sql`CREATE TABLE IF NOT EXISTS "links" (
            "id" serial PRIMARY KEY NOT NULL,
            "url" text NOT NULL,
            "short" varchar(50),
            "created_at" timestamp DEFAULT now()
        );`
        console.log("Db response for new table: ", dbResponse);
    } catch (err) {
        console.error("Database error during table creation: ", err);
    }
}


configureDatabase().catch(err => console.log("db config err ", err))

export async function addLink(url) {
    const newLinks = { url: url };
    return await db.insert(LinksTable).values(newLinks).returning();  // returning gives row added
}