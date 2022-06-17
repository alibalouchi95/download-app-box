import { createClient, Fula, Status } from '@functionland/fula';
import React, { useEffect, useRef, useState } from 'react'
import DownloadForm, { DownloadRequest } from './components/DownloadForm';
import Queue from './components/Queue';

type Props = {
  fulaClient: Fula | undefined,
  setFulaClient(fulaClient: Fula): void,
  connected: boolean,
  setConnected(inp: boolean): void,
  children: JSX.Element
}

const Connect = ({ fulaClient, setFulaClient, connected, setConnected, children }: Props) => {

  const inputRef = useRef<any>(null);
  const [serverIdsInput, setServerIdsInput] = useState<string>("");
  const [serverIds, setServerIds] = useState<string[]>();
  const [connecting, setConnecting] = useState(false);

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

  return (<>
    <>
      {connected ? {children} : <div className='connect-container'>
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
    </>
  </>)
}

export default Connect