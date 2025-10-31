export async function playAudioFromBlob(blob: Blob) {
  // Create an audio context
  const audioContext = new AudioContext()
  const blobUrl = URL.createObjectURL(blob)

  // Fetch the blob as ArrayBuffer
  const response = await fetch(blobUrl)
  const arrayBuffer = await response.arrayBuffer()

  // Decode it into audio buffer
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  // Create a buffer source and play it
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start(0)

  // Cleanup URL
  URL.revokeObjectURL(blobUrl)
}
