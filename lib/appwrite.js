import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    plartform: 'com.kunal.aura',
    projectId: '67083af3003b4d9f3428',
    databaseId: '67083be500305feddf27',
    userCollectionId: '67083bfe00263f41f119',
    videCollectionId: '67083c1c00194c5c1902',
    storageId: '67083d7000205d0a96b6'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.plartform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)


export const createUser = async (email, password, username) => {
    try{
        const newAccount = await account.create(ID.unique(), email, password, username)
        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username)
        await signIn(email, password)
        const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), {
            username, email, accountId: newAccount.$id, avatar: avatarUrl
        })
        return newUser
    }catch(e){
        console.log(e)
        throw new Error(e)
    }
}


export const signIn = async (email, password) => {
    const session = await account.createEmailPasswordSession(email, password)
    return session
}


export const getCurrentUser = async () => {
    try{
        const currentAccount = await account.get()
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0]
    }catch(e){
        console.log(e)
    }
}