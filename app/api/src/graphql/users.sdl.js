export const schema = gql`
  type User {
    id: String!
    name: String!
    email: String!
    bot: Boolean!
    actions: [Action]!
  }

  type Query {
    users: [User!]!
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
`
