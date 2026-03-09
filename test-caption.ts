import { getSubtitles } from 'youtube-caption-extractor';

async function test() {
  try {
    const subtitles = await getSubtitles({ videoID: 'fHsa9DqaCQ8', lang: 'en' });
    console.log("Length:", subtitles.length);
    console.log(subtitles.slice(0, 2));
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
