// quaries/index.js
import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query Query($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      statusCode
      message
      error
      data {
        token
        userId
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      statusCode
      message
      error
      data {
        _id
        username
        email
      }
    }
  }
`;

export const GET_POSTS = gql`
  query Query {
    getPosts {
      statusCode
      message
      error
      data {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          authorId
          content
          createdAt
          updatedAt
        }
        likes {
          authorId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation Mutation($input: PostInput!) {
    addPost(input: $input) {
      statusCode
      message
      error
      data {
        content
        tags
        imgUrl
        authorId
        comments
        likes
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    getPostById(_id: $id) {
      statusCode
      message
      error
      data {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          authorId
          content
          createdAt
          updatedAt
        }
        likes {
          authorId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($id: ID!, $comment: String!) {
    commentPost(_id: $id, comment: $comment) {
      statusCode
      message
      error
      data {
        authorId
        content
        createdAt
        updatedAt
      }
    }
  }
`;

export const SEARCH_USER = gql`
  query SearchUsersByUsername($username: String!) {
    searchUsersByUsername(username: $username) {
      _id
      username
      email
      followers {
        _id
        username
      }
      following {
        _id
        username
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(_id: $id) {
      statusCode
      message
      error
      data {
        _id
        username
        email
        followers {
          _id
          username
        }
        following {
          _id
          username
        }
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($id: ID!) {
    likePost(_id: $id) {
      statusCode
      message
      error
      data {
        authorId
        createdAt
        updatedAt
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation LikePost($userId: ID!, $followUserId: ID!) {
    followUser(userId: $userId, followUserId: $followUserId) {
      statusCode
      message
      error
      data {
        followingId
        followerId
        createdAt
        updatedAt
      }
    }
  }
`;
