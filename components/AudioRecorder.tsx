'use client'

import { useRef, useState } from 'react'
import { MicIcon, SquareIcon } from 'lucide-react'
import { BaseSpinner } from '@/components/ui/BaseSpinner'
import { FORM_DATA_RECORDING_KEY } from '@/enums/constants'
import { cn } from '@/utils/css'
import type { Experimental_TranscriptionResult } from 'ai'

export function AudioRecorder() {
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Array<BlobPart>>([])

  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState<Experimental_TranscriptionResult | null>(null)

  const RecordingIcon = isRecording ? SquareIcon : MicIcon

  async function transcribeAudio(blob: Blob) {
    const formData = new FormData()
    formData.append(FORM_DATA_RECORDING_KEY, blob)

    setIsTranscribing(true)

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setTranscription(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsTranscribing(false)
    }
  }

  async function handleRecordButtonClick() {
    if (!isRecording) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Reset audio chunks
          audioChunks.current = []
          setTranscription(null)
          setIsRecording(true)

          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          mediaRecorder.current = new MediaRecorder(audioStream)

          if (mediaRecorder.current) {
            mediaRecorder.current.start()

            mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
              audioChunks.current.push(event.data)
            }

            mediaRecorder.current.onstop = async () => {
              const blob = new Blob(audioChunks.current, { type: 'audio/wav' })
              await transcribeAudio(blob)
            }
          }
        } catch (error) {
          console.error(error)
        }
      }
    } else {
      setIsRecording(false)
      mediaRecorder.current?.stop()
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-4">
        <button
          className="cursor-pointer rounded-full bg-zinc-200 p-2.5 transition-colors hover:bg-zinc-300"
          type="button"
          onClick={handleRecordButtonClick}
        >
          <RecordingIcon
            className={cn('size-4 stroke-zinc-800', isRecording && 'stroke-red-800')}
          />
        </button>

        {isTranscribing && (
          <p className="inline-flex items-center gap-2 text-sm">
            <BaseSpinner className="size-4 shrink-0" /> Transcribing...
          </p>
        )}
      </div>

      {transcription && (
        <article className="rounded-lg border border-zinc-200 p-4">
          <div className="mb-2 text-lg font-semibold text-zinc-900">Transcription</div>
          <p className="text-sm">{transcription.text}</p>
        </article>
      )}
    </>
  )
}
