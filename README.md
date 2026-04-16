# AI History Deck

Fichiers utiles:
- `ai-history-timeline-deck.html`: deck principal
- `assets/narration/slide-XX.txt`: narration, un fichier par slide
- `assets/images/`: images du deck
- `assets/audio/tts/`: WAV générés
- `models/piper/`: modèle de voix française
- `scripts/setup_piper.sh`: installe Piper + la voix française
- `scripts/generate_piper_audio.mjs`: régénère les WAV dans `assets/audio/tts/`

Setup:
```bash
chmod +x scripts/setup_piper.sh
./scripts/setup_piper.sh
node scripts/generate_piper_audio.mjs
```

Usage:
```bash
open ai-history-timeline-deck.html
```

Workflow:
1. Modifier `assets/narration/slide-XX.txt`
2. Relancer `node scripts/generate_piper_audio.mjs`
3. Ouvrir le deck
