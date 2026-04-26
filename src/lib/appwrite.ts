import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

// Configuration using environment variables
const endpoint = import.meta.env.PPV_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.PPV_APPWRITE_PROJECT_ID;

client
    .setEndpoint(endpoint)
    .setProject(projectId);

export const storage = new Storage(client);

// Helper for IDs
export const PROJECT_ID = import.meta.env.PPV_APPWRITE_PROJECT_ID;
export const BUCKET_ID = import.meta.env.PPV_APPWRITE_STORAGE_BUCKET_ID;

export default client;
