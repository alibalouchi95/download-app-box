import React, { useEffect, useRef, useState } from 'react';
import { FulaProvider, useLazyQuery, useSubscription } from '@functionland/fula-client-react'
import { createClient, Fula, Status } from '@functionland/fula'
import * as graphql from 'graphql';
import DownloadForm, { DownloadRequest } from './components/DownloadForm';
import Queue from './components/Queue';

function App() {
  const inputRef = useRef<any>(null);
  const [fulaClient, setFulaClient] = useState<Fula>();
  const [serverIds, setServerIds] = useState<string[]>();
  const [connected, setConnected] = useState(false);
  const [serverIdsInput, setServerIdsInput] = useState("");
  const [connecting, setConnecting] = useState(false);

  const createJobGQL = graphql.parse(`
  mutation addTodo($values:JSON){
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
`);

  const [createJobMutation, {data: createdJob}] = useLazyQuery(createJobGQL)

  useEffect(() => {
    const startFula = async () => {
      const fulaClient = await createClient();
      setFulaClient(fulaClient);
    }
    startFula();
    let temp = localStorage.getItem("serverId")
    if (temp && temp.length > 5) {
      setServerIds(temp.split(','))
    }
    inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (serverIds && fulaClient) {
      (async () => {
        setConnecting(true)
        const conn = fulaClient.connect(serverIds)
        conn.on('status', (status) => {
          switch (status) {
            case Status.Connecting:
              setConnecting(true)
              setConnected(false)
              break
            case Status.Online:
              setConnected(true)
              setConnecting(false)
              break
            case Status.Offline:
              setConnected(false)
              setConnecting(false)
          }
        })
      })()
    }

  }, [fulaClient, serverIds]);

  const handleChange = (e: any) => {
    setServerIdsInput(e.target.value);
  };

  const handleConnect = (e: any) => {
    e.preventDefault();
    if (serverIdsInput && serverIdsInput.length > 5) {
      setServerIds(serverIdsInput.split(','))
      localStorage.setItem("serverId", serverIdsInput)
    }
  };

  const submit = (req: DownloadRequest) => {
    createJobMutation({variables: {values: [{...req, id: Math.random()*100}]}})
  }

  return (
    <div className="App">
      <FulaProvider fula={fulaClient}>
        <>
        {connected ? <div>CONNECTED</div> : <div className='connect-container'>
          <div className='app-header'>
            {!connecting ? <h1>Connect to BOX!</h1> : null}
            {connecting ? <div className='lds-ellipsis'><div /><div /><div /><div /></div> : null}
          </div>
          <input
            placeholder='Enter your server Id'
            value={serverIdsInput}
            onChange={handleChange}
            name='text'
            ref={inputRef}
            className='todo-input'
          />
          <button disabled={!fulaClient} onClick={handleConnect} className='todo-button'>
            Connect
          </button>

        </div>}
        {
          connected ? <div><DownloadForm submit={submit} /><Queue /></div> : null
        }
        </>
      </FulaProvider>
    </div>
  );
}

export default App;
