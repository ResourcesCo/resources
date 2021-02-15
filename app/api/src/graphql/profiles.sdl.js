export const schema = gql`
  type Profile {
    id: String!
    name: String!
    email: String!
    bot: Boolean!
    actions: [Action]!
  }

  type Query {
    profiles: [Profile!]!
  }

  input CreateProfileInput {
    name: String!
    email: String!
    bot: Boolean!
  }

  input UpdateProfileInput {
    name: String
    email: String
    bot: Boolean
  }
`
