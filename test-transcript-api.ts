import TranscriptClient from 'youtube-transcript-api';

async function test() {
  try {
    const client = new TranscriptClient();
    await client.ready;
    const transcript = await client.getTranscript('jNQXAC9IVRw');
    console.log("Length:", transcript.length);
    console.log(transcript.slice(0, 2));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
