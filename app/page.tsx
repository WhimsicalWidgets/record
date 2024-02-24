'use client'
import { useEffect, useRef, useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart'

import AudioPlayer from './AudioPlayer'
import styles from './Page.module.css'
function downloadFile(fileUrl: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = fileUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

function getCurrentDateString() {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Home() {
  const [recordingLength, setRecordingLength] = useState(10)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (!isRecording) {
        return
      }
      setElapsedTime(elapsedTime + 100)
      console.log(elapsedTime)
    }, 100)
  }, [elapsedTime, isRecording])

  async function startRecording() {
    setElapsedTime(0)
    if (!navigator.mediaDevices || !MediaRecorder) {
      alert('Recording is not supported in this browser.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm; codecs=opus',
      })
      audioChunksRef.current = []
      mediaRecorderRef.current.ondataavailable = function ode(event) {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setTimeout(() => {
        stopRecording()
      }, recordingLength * 1000)
    } catch (err) {
      console.error('Error accessing the microphone', err)
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop())
    setIsRecording(false)
  }

  const haveRecording = audioChunksRef.current.length > 0
  function getAudioUrl() {
    if (!haveRecording) return ''
    const audioBlob = new Blob(audioChunksRef.current, {
      type: 'audio/webm; codecs=opus',
    })
    const audioUrl = URL.createObjectURL(audioBlob)
    return audioUrl
  }

  function downloadRecording() {
    const audioUrl = getAudioUrl()
    if (audioUrl) {
      downloadFile(audioUrl, `recorder-${getCurrentDateString()}`)
    }
  }
  console.log(` Unrecorded ${recordingLength * 1000 - elapsedTime}`)
  return (
    <div className={styles.container}>
      <div className='length'>
        {' '}
        Length:{' '}
        <input
          className={styles.input}
          type='number'
          value={recordingLength}
          onChange={(e) => setRecordingLength(Number(e.target.value))}
        />{' '}
      </div>
      <div className={styles.recordSection}>
        <button onClick={startRecording} className={styles.recordButton}>
          {isRecording ? 'Stop ⏹️' : 'Record 🎙️'}
        </button>
        <PieChart
          className={styles.pie}
          animate
          data={[
            { title: 'Recorded', color: 'red', value: elapsedTime },
            {
              title: 'Unrecorded',
              color: 'grey',
              value: recordingLength * 1000 - elapsedTime,
            },
          ]}
        />
      </div>
      <AudioPlayer audioUrl={getAudioUrl()} />
      <div>
        {/* <button disabled={!haveRecording} onClick={playRecording}>
          {' '}
          ▶️ Play
        </button> */}
        <button disabled={!haveRecording} onClick={downloadRecording}>
          {' '}
          ⤵️ Download
        </button>
      </div>
    </div>
  )
}

export default Home
