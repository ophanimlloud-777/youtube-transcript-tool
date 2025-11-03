// api/transcript.js
import { YoutubeTranscript } from 'youtube-transcript';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { videoId } = req.query;

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: 'ID vidéo invalide' });
  }

  try {
    // Essayer de récupérer la transcription
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'fr' });

    if (transcript && transcript.length > 0) {
      const text = transcript.map(t => t.text).join(' ');
      return res.status(200).json({ transcript: text });
    } else {
      throw new Error('Pas de transcription');
    }
  } catch (err) {
    // Si pas de transcription → on propose l'audio via un lien externe (yt-dlp via un service tiers)
    // Ici on utilise un service public temporaire (ou tu peux créer le tien)
    const audioProxy = `https://youtube-mp36.vercel.app/api?id=${videoId}`;
    
    return res.status(200).json({ 
      transcript: null,
      audioUrl: audioProxy,
      message: "Pas de transcription, mais audio disponible"
    });
  }
}