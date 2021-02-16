export const schema = gql`
  type Page {
    id: String!
    name: String!
    path: String!
    body: String!
    metadata: JSON!
    computed: JSON!
    createdAt: DateTime!
    actions: [Action]!
  }

  type Query {
    pages: [Page!]!
  }

  input CreatePageInput {
    name: String!
    path: String!
    body: String!
    metadata: JSON!
    computed: JSON!
  }

  input UpdatePageInput {
    name: String
    path: String
    body: String
    metadata: JSON
    computed: JSON
  }
`
