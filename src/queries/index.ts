import * as graphql from 'graphql';

export const createJobGQL = `
mutation addDownload($values:JSON){
  create(input:{
    collection:"download",
    values: $values
  }){
    id
    title
    url
    dirs
  }
}
`;

export const readQuery = `
  query {
    read(input:{
      collection:"download",
      filter:{}
    }){
        id
        title
        url
        dirs
    }
  } 
`;