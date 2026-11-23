# Suxess Schools website

React + Vite + TypeScript. Single-page site, no backend.

## Run locally
```bash
npm install
npm run dev
```

## Change the text
Open `src/data.ts`. Replace every line marked TODO (phone, WhatsApp, email, address).
The enquiry form opens the visitor's email app addressed to the email in that file.

## Add photos
Put images in `public/` and use them with `<img src="/your-photo.jpg" alt="..." />` in `src/App.tsx`.

## Deploy to Cloudflare Pages

### Method 1 – GitHub (recommended)
1. Create a new GitHub repository.
2. Upload **all files from this folder** to the **root** of the repository  
   (do **not** put them inside another folder).
3. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git.
4. Select the repository and use these settings:

| Setting                 | Value            |
|-------------------------|------------------|
| Framework preset        | Vite             |
| Build command           | `npm run build`  |
| Build output directory  | `dist`           |
| Root directory          | *(leave empty)*  |

5. Click **Save and Deploy**.

### Method 2 – Direct upload
```bash
npm install
npm run build
```
Then upload the generated `dist` folder in Cloudflare Pages → Upload assets.


## 3D design

The 3D scenes are pure CSS 3D transforms (no WebGL, no extra dependencies), in `src/Stage3D.tsx`
with styles at the bottom of `src/styles.css`.

- `Stairs`: Nursery > Primary > Secondary steps in the Schools section.
- Photos marked `data-tilt` tilt slightly on hover (desktop only).

Everything scales with its container (1u = 1% of the stage width) and animations are switched off
for visitors who prefer reduced motion.

## Hero slider

The hero is a full-width photo slider (`Hero` in `src/App.tsx`). Slides, photos, headlines and buttons
live in the `slides` list in `src/data.ts`; photos are in `public/hero-*.jpg`. Add `portrait: true` to a
slide whose photo is tall, so it is shown large on the right instead of being cropped. Autoplay pauses on
hover or focus, and it supports arrows, the numbered progress bars, the keyboard and touch swipe.
