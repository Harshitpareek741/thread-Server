export interface jwtToken { 
    id : string, 
    email : string 
}
export interface GraphQlserver{
    user ?: jwtToken
}