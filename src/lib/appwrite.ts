import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.PPV_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PPV_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Helper for IDs
export const PROJECT_ID = import.meta.env.PPV_APPWRITE_PROJECT_ID;
export const BUCKET_ID = import.meta.env.PPV_APPWRITE_STORAGE_BUCKET_ID;

export { client, account, databases, storage };
export default client;
