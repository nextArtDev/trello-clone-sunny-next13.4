import { Client, Account, ID, Databases, Storage } from 'appwrite'
import { APPWRITE_PROJECT_ID } from './data'
const client = new Client()

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(APPWRITE_PROJECT_ID)

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

export { client, account, databases, storage, ID }
