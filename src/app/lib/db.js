import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { desc, eq, sql as sqld } from "drizzle-orm";
import * as schema from './schema'
import { LinksTable, VisitsTable,UsersTable } from "./schema";
import randomShortString from "./randomShortString";
import { getSessionUser } from "./session";
import { hashPassword } from "./passwordUtils";


const sql = neon(process.env.DATABASE_URL)
neonConfig.fetchConnectionCache = true;
const db = drizzle(sql, { schema });


export async function helloworld() {

    const [dbResponse] = await sql`SELECT NOW()`
    const dbNow = dbResponse && dbResponse.now ? dbResponse.now : ""; // this will gives me string
    return dbNow
}

async function configureDatabase() {

    await sql`CREATE TABLE IF NOT EXISTS "links" (
        	"id" serial PRIMARY KEY NOT NULL,
        	"url" text NOT NULL,
        	"short" varchar(50),
        	"user_id" integer,
        	"created_at" timestamp DEFAULT now()
        );`

    await sql`
            CREATE TABLE IF NOT EXISTS "users"(
            "id" serial PRIMARY KEY NOT NULL,
            "username" varchar(50) NOT NULL,
            "password" text NOT NULL,
            "email" text,
            "created_at" timestamp DEFAULT now()
        );`
    await sql`
            CREATE TABLE IF NOT EXISTS "visits"(
            "id" serial PRIMARY KEY NOT NULL,
            "link_id" integer NOT NULL,
            "created_at" timestamp DEFAULT now()
        );`
    await sql`
            DO $$ BEGIN
            ALTER TABLE "links" ADD CONSTRAINT "links_user_id_users_id_fk" FOREIGN KEY("user_id") REFERENCES "public"."users"       
            ("id") ON DELETE no action ON UPDATE no action;
            EXCEPTION
            WHEN duplicate_object THEN null;
            END $$;`
    await sql`
            DO $$ BEGIN
            ALTER TABLE "visits" ADD CONSTRAINT "visits_link_id_links_id_fk" FOREIGN KEY("link_id") REFERENCES "public"."links"         ("id") ON DELETE no action ON UPDATE no action;
            EXCEPTION
            WHEN duplicate_object THEN null;
            END $$;`
    await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" USING btree("username"); `


}


configureDatabase().catch(err => console.log("db config err ", err))

export async function addLink(url) {
    const short = randomShortString();
    const user = await getSessionUser();
    const newLinks = { url: url, short: short };
    if (user) {
        newLinks["userId"] = user;
    }
    console.log(newLinks)
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
    // console.log("Response:", response, "Status:", responseStatus);
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
export async function saveLinkVisit(linkIdValues) {
    return await db.insert(VisitsTable).values({ linkId: linkIdValues })
}

export async function getMinLinks(limit, offset) {
    const lookupLimit = limit ? limit : 10;
    const lookupOffset = offset ? offset : 0;

    return await db.select().from(LinksTable).limit(lookupLimit).offset(lookupOffset).orderBy(desc(LinksTable.createdAt));
}

export async function getMinLinksAndVisits(limit, offset) {
    const lookupLimit = limit || 10;
    const lookupOffset = offset || 0;
    const sessionUser = await getSessionUser();

    // console.log(db.query.LinksTable.findMany().toSQL());

    return await db.query.LinksTable.findMany({
        limit: lookupLimit,
        offset: lookupOffset,
        columns: {
            id: true,
            url: true,
            short: true,
            userId: true,
            createdAt: true,
        },
        where: eq(LinksTable.userId, sessionUser),
        with: {
            visits: {
                // limit: 5,
                columns: {
                    createdAt: true,
                }
            }
        }

    });
}
export async function registerUser(newUserData) {
    const { username } = newUserData
    const toInsertData = {
        username: username,
        password: await hashPassword(newUserData.password)
    }
    if (newUserData.email) {
        toInsertData['email'] = newUserData.email
    }

    let response = { message: `Failed to register. Please try again.` }
    let responseStatus = 400
    try {
        let dbResponse = await db.insert(UsersTable).values(toInsertData).returning()
        let dbResponseData = dbResponse[0]
        response = [{
            id: dbResponseData.id,
            username: dbResponseData.username,
            createdAt: dbResponseData.createdAt
        }]
        responseStatus = 201
    } catch ({ name, message }) {
        if (`${message}`.includes("duplicate key value violates unique constraint")) {
            response = { message: `${username} is taken.` }
        }
    }
    return { data: response, status: responseStatus }
}

export async function getUserByUsername(username) {
    return await db.select().from(UsersTable).where(eq(UsersTable.username, username))
}