'use client'

import { useRef, useState } from 'react'
import { MicIcon, SquareIcon } from 'lucide-react'
import { playAudioFromBlob } from '@/lib/audio/play'
import { cn } from '@/utils/css'

export function AudioRecorder() {
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Array<BlobPart>>([])

  const [isRecording, setIsRecording] = useState(false)

  const RecordingIcon = isRecording ? SquareIcon : MicIcon

  async function handleRecordButtonClick() {
    if (!isRecording) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Reset audio chunks
          audioChunks.current = []
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
              await playAudioFromBlob(blob)
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
    <div>
      <button
        className="cursor-pointer rounded-full bg-zinc-200 p-2.5 transition-colors hover:bg-zinc-300"
        type="button"
        onClick={handleRecordButtonClick}
      >
        <RecordingIcon className={cn('size-4 stroke-zinc-800', isRecording && 'stroke-red-800')} />
      </button>
    </div>
  )
}
