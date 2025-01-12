const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar JSON
  type User {
    id: ID!
    username: String!
    full_name: String!
    role: String!
    profileImage: String
  } 
     type User {
    id: ID!
    full_name:String!
    username: String!
    profile_image: String
  }

  type AuthPayload {
    token: String!
    role: String!
    username: String!
  }
  
  type Village {
  id: ID!
  name: String
  region: String
  land_area: Float
  latitude: Float
  longitude: Float
  image: String
  tags: JSON
  population: Int
  population_distribution: JSON
  gender_ratios: JSON
  population_growth_rate: Float
}
type Village {
  id: ID!
  name: String
  region: String
  land_area: Float
  latitude: Float
  longitude: Float
  image: String
}

  type Image {
    id: Int
    imgBase64: String
    imgText: String
    createdAt: String
  }

  type Message {
    message: String!
  }

   type Query {
   villages: [Village]
  village(id: ID!): Village
    getGallery: [Image]
    currentUser: User
        user(id: ID!): User
          getVillageById(id: ID!): Village

  }

 type Mutation {
  addVillage(
    name: String!
    region: String!
    land_area: Float!
    latitude: Float!
    longitude: Float!
    image: String
    tags: [String!]!
  ): Village

  updateUser(
      id: ID!
      username: String
      password: String
      profile_image: String
    ): User
     

  addDemographicData(
    villageId: Int!,
    population: Int!,
    population_distribution: String!,  
    gender_ratios: String!,         
    population_growth_rate: Float!
    ): Village


     updateVillage(
    id: ID!
    name: String!
    region: String!
    land_area: Float!
    latitude: Float!
    longitude: Float!
    image: String
  ): Village

    deleteVillage(id: ID!): Boolean
   signUp(username: String!, password: String!, full_name: String!, role: String!, profileImage: String): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    logout: Message

    addImage(imgBase64: String!, imgText: String!): Image
  }
`;

module.exports = typeDefs;
