MARKARONI SIM LEAGUE — SEPARATE VERCEL TEST DEPLOYMENT 0.3

WHAT THIS IS
- A separate static website built from the recovered Markaroni Playable Demo 0.3.
- Includes the 20-club 2026/27 league setup, squad editor, manager profile workshop,
  match simulation, full-time player ratings, fixtures/table and career export/import.
- Ready to import as a static project on Vercel. No build command is required.

IMPORTANT LIMITATIONS
- This is a separate test deployment. It does NOT connect to the existing Supabase
  account, cloud careers, or original Netlify website.
- Career data is saved in the browser/device using local storage. Use Export career
  backup regularly; another browser/device will not automatically have those saves.
- It uses the interim Engine Alpha, not the advanced historical-data engine.
- Player ratings are experimental in-app ratings, not official FotMob/SofaScore ratings.

VERCEL DEPLOYMENT
1. Extract this ZIP.
2. Create a new GitHub repository (keep it separate from the original project).
3. Upload index.html and vercel.json to the repository root.
4. In Vercel, Add New → Project → import that repository.
5. Framework Preset: Other. Leave Build Command and Install Command blank.
   Output Directory: .
6. Deploy. Vercel will provide a .vercel.app address.

DO NOT replace the existing Netlify site or original Supabase-connected files with this
separate preview. Test this deployment independently first.
