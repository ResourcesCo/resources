export const schema = gql`
  type Action {
    id: String!
    profile: Profile!
    profileId: String!
    name: String!
    path: String!
    type: String!
    body: String!
    metadata: JSON!
    createdAt: DateTime!
    page: Page!
    pageId: String!
  }

  type Query {
    actions: [Action!]!
  }

  input CreateActionInput {
    profileId: String!
    name: String!
    path: String!
    type: String!
    body: String!
    metadata: JSON!
    pageId: String!
  }

  input UpdateActionInput {
    profileId: String
    name: String
    path: String
    type: String
    body: String
    metadata: JSON
    pageId: String
  }
`
