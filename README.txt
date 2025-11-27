# Apple Umbrellas — Data Decoupled

- All apple data now lives in **apples.json**.
- `script.js` tries to `fetch('apples.json')`. If it fails (e.g., opened with `file://` in some browsers), it **falls back** to inline data, so it still works offline.
- For a true fetch without fallback, serve with any local server (e.g., `python3 -m http.server`).

Files:
- index.html
- style.css
- script.js  (loads apples.json with safe fallback)
- apples.json (data only)
