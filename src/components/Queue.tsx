// import { useLazyQuery, useSubscription } from '@functionland/fula-client-react'
import {Fula} from '@functionland/fula'
import React, { useContext, useEffect, useState } from 'react'
import { DownloadRequest } from './DownloadForm';
import { readQuery } from '../queries';
import { FulaContext } from '@functionland/fula-client-react';

// type Props = {
//   queue: Array<DownloadRequest>
// }

const Queue = () => {

  // const [readQueue] = useLazyQuery(readQuery)
  const fulaClient = useContext(FulaContext)
  const [queue, setQueue] = useState<Array<DownloadRequest>>()

  const get = () => {
    const _readQueue = async () => {
      const queue = await fulaClient?.graphql(readQuery)
      setQueue(queue as  Array<DownloadRequest>)
    }

    _readQueue()
  }

  useEffect(() => {
    console.log({queue})
  }, [queue])
    
  return (
    <div>Queue
        {/* {queue && queue.read && <div>{queue.read.map((job: DownloadRequest) => <div key={job.id}>{`${job.title} -- ${job.url}`}</div>)}</div>} */}
        <button onClick={get}>GET</button>
    </div>
  )
}

export default Queue