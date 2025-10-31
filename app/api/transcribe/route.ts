import { NextResponse } from 'next/server'
import { elevenlabs } from '@ai-sdk/elevenlabs'
import { experimental_transcribe as transcribe } from 'ai'
import { FORM_DATA_RECORDING_KEY } from '@/enums/constants'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the audio file from the request
    const formData = await request.formData()
    const file = formData.get(FORM_DATA_RECORDING_KEY)

    // Validate payload
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No audio file provided or the file is not a Blob' },
        { status: 400 }
      )
    }

    // Convert the Blob to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Transcribe the audio
    const result = await transcribe({
      model: elevenlabs.transcription('scribe_v1'),
      audio: arrayBuffer,
      providerOptions: {
        elevenlabs: {
          tagAudioEvents: false,
          numSpeakers: 1,
          diarize: false,
        },
      },
    })

    return NextResponse.json({
      ...result,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'An unknown error occurred while transcribing the audio' },
      { status: 500 }
    )
  }
}
