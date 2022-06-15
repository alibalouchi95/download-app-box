import React, { ChangeEvent, useState } from 'react'
import { UnionType } from 'typescript'

export type DownloadRequest = {
    title?: string
    url: string
    dirs: Array<string>
    id: string
}

type Props = {
    submit: (inp: DownloadRequest) => void
}

const DownloadForm = ({submit}: Props) => {
    const [downloadReq, setDownloadReq] = useState<DownloadRequest>({title: '', url: '', dirs: [], id: ''})

  return (
    <div>
        DownloadForm
        <input placeholder='title' type="text" onChange={(evt) => setDownloadReq({...downloadReq, title: evt.target.value})} />
        <input placeholder='url' type="text" onChange={(evt) => setDownloadReq({...downloadReq, url: evt.target.value})} />
        <input placeholder='dirs' type="text" onChange={(evt) => setDownloadReq({...downloadReq, dirs: evt.target.value.split('/')})} />
        <button onClick={() => submit(downloadReq)}>submit</button>
    </div>
  )
}

export default DownloadForm