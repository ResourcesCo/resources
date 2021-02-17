export const schema = gql`
  type User {
    id: String!
    name: String!
    email: String!
    bot: Boolean!
    actions: [Action]!
  }

  type CurrentUser {
    id: String
    name: String
    email: String
  }

  type Query {
    users: [User!]!
    currentUser: CurrentUser
  }

  input CreateUserInput {
    name: String!
    email: String!
    bot: Boolean!
  }

  input UpdateUserInput {
    name: String
    email: String
    bot: Boolean
  }

  input CreateCurrentUserInput {
    name: String
  }

  type Mutation {
    createCurrentUser(input: CreateCurrentUserInput!): CurrentUser
  }
`
