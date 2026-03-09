import { YoutubeTranscript } from 'youtube-transcript-scraper';

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('jNQXAC9IVRw');
    console.log("Length:", transcript.length);
    console.log(transcript.slice(0, 2));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
