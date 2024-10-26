export interface UserSession {
    uid: string, 
    email: string, 
    emailVerified: string, 
    displayName: boolean, 
    isAnonymous: boolean, 
    photoURL: string, 
    providerData: Array<any>, 
    stsTokenManager: string, 
    createdAt: string, 
    lastLoginAt: string, 
    apiKey: string, 
    appName: string
}
