# For Ari, with love

The gift has three moments:

1. Ari sees an envelope and opens her love letter.
2. She folds the letter (or presses Escape) and discovers a rotating spiral galaxy literally made of sweet phrases.
3. She selects the heart at its center and reads “Sos mi mundo” / “You are my world.”

To personalize, edit `dist/content.js`: `letter` is your love letter, `phrases` are the words that form the galaxy, and `revealTitle` / `revealText` are the final surprise. The current letter is a draft to replace with your own.

Run `python3 build.py` after changing the content. Then open or share `a-universe-for-ari.html`. It includes all application code and content; online fonts are optional and fall back to system fonts.

For a local website, run `python3 app.py` and visit http://localhost:8000. A host can serve the `dist/` folder directly. No dependencies or build step are needed to serve it.

The gift does not import chat history or use browser storage. Reopening the page starts at the envelope. The letter and final reveal support keyboard navigation and Escape. Motion preferences are respected; animation pauses in background tabs.

This revision was prepared in `/tmp/ari-galaxy` because the original project moved outside this session's writable workspace. The existing Sites registration was preserved; this revision has not been deployed.
