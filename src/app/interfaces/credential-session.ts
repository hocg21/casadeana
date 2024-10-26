export interface CredentialSession {
    accessToken: string,
    idToken: string,
    pendingToken: any
    providerId: string,
    signInMethod: string,
}
