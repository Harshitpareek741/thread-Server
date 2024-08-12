export const type = `#graphql
  input TweetPayload {
  content : String !
  }
  type Tweet {
    id: ID!
    content: String!
    authorId: String!
    author: User!
  }
  
`
