import { useSubscription } from '@functionland/fula-client-react'
import React, { useEffect } from 'react'
import * as graphql from 'graphql'
import { DownloadRequest } from './DownloadForm';

const readQuery = graphql.parse(`
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
`);

const Queue = () => {
    const [queue] = useSubscription(readQuery)
    
    
  return (
    <div>Queue
        {queue && <div>{queue.map((job: DownloadRequest) => <div key={job.id}>{`${job.title} -- ${job.url}`}</div>)}</div>}
    </div>
  )
}

export default Queue