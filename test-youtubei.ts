import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('jNQXAC9IVRw');
    const transcript = await info.getTranscript();
    console.log("Transcript length:", transcript?.transcript?.content?.body?.initial_segments?.length);
    if (transcript?.transcript?.content?.body?.initial_segments) {
      const text = transcript.transcript.content.body.initial_segments.map((s: any) => s.snippet.text).join(' ');
      console.log("Text preview:", text.substring(0, 100));
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
