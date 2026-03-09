import { YoutubeTranscript } from "youtube-transcript";
import { getSubtitles } from 'youtube-caption-extractor';

async function test() {
  const url = "https://youtu.be/P_q7-2gkIjQ?si=OvadAuAQHLvdvho4";
  
  // Extract video ID
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  console.log("Video ID:", videoId);

  try {
    console.log("Trying youtube-transcript...");
    const t1 = await YoutubeTranscript.fetchTranscript("fHsa9DqaCQ8");
    console.log("Success! Length:", t1.length);
  } catch (err: any) {
    console.error("youtube-transcript failed:", err.message);
  }

  if (videoId) {
    try {
      console.log("Trying youtube-caption-extractor...");
      const t2 = await getSubtitles({ videoID: videoId, lang: 'en' });
      console.log("Success! Length:", t2.length);
    } catch (err: any) {
      console.error("youtube-caption-extractor failed:", err.message);
    }
  }
}

test();
