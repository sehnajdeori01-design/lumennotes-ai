import { YtTranscript } from 'yt-transcript';

async function test() {
  try {
    const transcript = new YtTranscript({ url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' });
    const res = await transcript.getTranscript();
    console.log("Length:", res?.length);
    console.log(res?.slice(0, 2));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
