import { useState } from 'react'
import style from '../styles/Home.module.css'

export default function Home() {
  const [file, setFile] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [animatedText, setAnimatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  const animateText = (fullText) => {
    let index = 0
    let currentText = ''
    setAnimatedText('')
    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText.charAt(index)
        setAnimatedText(currentText)
        index++
      } else {
        clearInterval(interval)
      }
    }, 6)
  }

  const uploadAndTranscribe = async () => {
    if (!file) return alert('Please upload an audio file.')
    setLoading(true)
    setTranscript('')
    setAnimatedText('')
    setShowTranscript(false)

    const formData = new FormData()
    formData.append('audio', file)

    try {
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      const result = data.text || data.error || 'No result'

      setTranscript(result)
      animateText(result)
      setShowTranscript(true)
    } catch (err) {
      const errorMessage = 'Error connecting to backend'
      setTranscript(errorMessage)
      setAnimatedText(errorMessage)
      setShowTranscript(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style.containerWidth}>
      <div className={style.box}>
        <h1>Voice Note To Text</h1>
        <p>Upload an audio file and get the transcription. Super easy!</p>

        <label htmlFor="file-upload" className="py-2">
          Upload an Audio File
        </label>

        <div className={style.fileRow}>
          <label
            htmlFor="file-upload"
            className={`${style.chooseBtn} ${loading ? style.disabled : ''}`}
          >
            {file ? 'CHOSEN FILE' : 'CHOOSE FILE'}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".mp3, .wav, .aiff"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
            className={style.fileInput}
          />
          <button
            onClick={uploadAndTranscribe}
            disabled={loading || !file}
            className={`${style.uploadBtn} ${
              loading || !file ? style.disabled : ''
            }`}
          >
            {loading ? 'UPLOADING...' : 'UPLOAD'}
          </button>
        </div>

        {showTranscript && (
          <>
            <label htmlFor="transcript" className={style.label}>
              Transcript:
            </label>
            <textarea
              id="transcript"
              readOnly
              value={animatedText}
              rows={10}
              className={style.textarea}
            />
          </>
        )}
      </div>
    </div>
  )
}
