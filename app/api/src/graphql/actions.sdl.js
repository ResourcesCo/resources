export const schema = gql`
  type Action {
    id: String!
    name: String!
    path: String!
    type: String!
    body: String!
    metadata: JSON!
    computed: JSON!
    createdAt: DateTime!
    user: User!
    userId: String!
    page: Page!
    pageId: String!
  }

  type Query {
    actions: [Action!]!
  }

  input CreateActionInput {
    name: String!
    path: String!
    type: String!
    body: String!
    metadata: JSON!
    computed: JSON!
    userId: String!
    pageId: String!
  }

  input UpdateActionInput {
    name: String
    path: String
    type: String
    body: String
    metadata: JSON
    computed: JSON
    userId: String
    pageId: String
  }
`
