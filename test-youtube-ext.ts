import { videoInfo } from 'youtube-ext';

async function test() {
  try {
    const info = await videoInfo('jNQXAC9IVRw');
    console.log("Transcript:", info.transcript);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
