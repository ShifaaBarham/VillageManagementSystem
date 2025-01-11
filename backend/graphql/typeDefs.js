const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar JSON

type User {
  id: ID!
  username: String
  profile_image: String
  email:String
}
  type AuthPayload {
    token: String!
    role: String!
    username: String!
  }
   type Mutation {
    signUp(username: String!, password: String!, full_name: String!, role: String!, profileImage: String): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
  }

  type Village {
    id: ID!
    name: String!
    region: String!
    land_area: Float!
    latitude: Float!
    longitude: Float!
    image: String
    tags: JSON
    population: Int
    population_distribution: JSON
    gender_ratios: JSON
    population_growth_rate: Float
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
    villages: [Village!]!
    village(id: ID!): Village
    getGallery: [Image]
    currentUser: User
  }

  type Mutation {
    addVillage(
      name: String!
      region: String!
      land_area: Float!
      latitude: Float!
      longitude: Float!
      image: String!
      tags: JSON
    ): Village

  addDemographicData(
    villageId: Int!,
    population: Int!,
    population_distribution: String!,  
    gender_ratios: String!,         
    population_growth_rate: Float!
    ): Village
     updateUser(
      id: ID!,
      username: String,
      email: String,
      password: String,
      profile_image: String
    ): User

              




    updateVillage(
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
    ): Village

    deleteVillage(id: ID!): Boolean
    signup(username: String!, password: String!, full_name: String!, role: String!): AuthPayload   # تم تعديل الاستجابة إلى AuthPayload
    login(username: String!, password: String!): AuthPayload
    logout: Message

    addImage(imgBase64: String!, imgText: String!): Image
  }
`;

module.exports = typeDefs;
