import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { desc, eq } from "drizzle-orm";
import { LinksTable } from "./schema";
import randomShortString from "./randomShortString";


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
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS "url_idx" ON "links" ((lower(url)));`

        await sql`CREATE TABLE IF NOT EXISTS "visits" ("id" serial PRIMARY KEY NOT NULL,"link_id" integer NOT NULL,"created_at" timestamp DEFAULT now());`;

        await sql`
        DO $$ BEGIN
        ALTER TABLE "visits" ADD CONSTRAINT "visits_link_id_links_id_fk" FOREIGN KEY("link_id") REFERENCES "public"."links"("id") ON DELETE no action ON UPDATE no action;
        EXCEPTION
        WHEN duplicate_object THEN null;
        END $$;`



    } catch (err) {
        console.error("Database error during table creation: ", err);
    }
}


configureDatabase().catch(err => console.log("db config err ", err))

export async function addLink(url) {
    const short = randomShortString();
    const newLinks = { url: url, short: short };
    let response = [{ message: `${url} is not valid.Please try again` }];
    let responseStatus = 400;

    try {
        response = await db.insert(LinksTable).values(newLinks).returning();  // returning gives row added
        responseStatus = 201;
    } catch (error) {
        const message = error.message
        const name = error.name
        if (`${message} `.includes("duplicate key value violates unique constraint")) {
            response = { message: `${url} has already added.Please check the list` }
            responseStatus = 409;
        }
    }
    console.log("Response:", response, "Status:", responseStatus);
    return { data: response, status: responseStatus };
}

export async function getLinks(limit, offset) {
    const lookupLimit = limit ? limit : 10;
    const lookupOffset = offset ? offset : 0;
    return await db.select().from(LinksTable).limit(lookupLimit).offset(lookupOffset);
}
export async function getShortLinksRecord(shortSlugValue) {
    return await db.select().from(LinksTable).where(eq(LinksTable.short, shortSlugValue));
}

export async function getMinLinks(limit, offset) {
    const lookupLimit = limit ? limit : 10;
    const lookupOffset = offset ? offset : 0;

    return await db.select().from(LinksTable).limit(lookupLimit).offset(lookupOffset).orderBy(desc(LinksTable.createdAt));
}