import React, { useState } from 'react';
import { FulaProvider } from '@functionland/fula-client-react'
import { Fula } from '@functionland/fula'
import DownloadForm, { DownloadRequest } from './components/DownloadForm';
import Queue from './components/Queue';
import { createJobGQL } from './queries';
import Connect from './Connect';

function App() {
  const [fulaClient, setFulaClient] = useState<Fula>();
  const [connected, setConnected] = useState<boolean>(false)

  const submit = (req: DownloadRequest) => {
    const _req = { ...req, id: `${Math.ceil(Math.random() * 100)}` }
    console.log(_req)
    // @ts-ignore
    fulaClient?.graphql(createJobGQL, { values: [_req] }).then((res) => console.log({ res }))

  }

  return (
    <div className="App">
      <FulaProvider fula={fulaClient}>
        <Connect fulaClient={fulaClient} setFulaClient={setFulaClient} connected={connected} setConnected={setConnected}>
          <div>
            <DownloadForm submit={submit} />
            <Queue />
          </div>
        </Connect>
      </FulaProvider>
    </div>
  );
}

export default App;
