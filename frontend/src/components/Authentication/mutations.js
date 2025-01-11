import { gql } from '@apollo/client';

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($username: String!, $password: String!, $full_name: String!, $role: String!, $profileImage: String) {
    signUp(username: $username, password: $password, full_name: $full_name, role: $role, profileImage: $profileImage) {
      token
      role
      username
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      role
      username
    }
  }
`;
