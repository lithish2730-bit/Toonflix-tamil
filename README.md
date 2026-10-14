# ToonFlix Tamil — starter streaming app

This is a working mobile-first streaming catalogue prototype that can be installed as a PWA (Progressive Web App) on Android when hosted over HTTPS. It is not yet a native APK or a production backend.

## Included
- Dark OTT-style home screen, movies, series, My List, search
- Details modal and browser video player for direct MP4/WebM/Ogg links
- Authorized YouTube/Vimeo embed URLs (paste the actual embed URL)
- Add movies, series, posters, descriptions, and episode links in Admin
- Import/export catalogue JSON
- Local browser storage for the catalogue, favourites and watch history
- Basic service-worker offline shell

## Run locally
1. Unzip this folder on a computer.
2. Open `index.html` in a modern browser for a quick UI demo. Some browser features may require a local server.
3. For PWA installation, deploy the folder to an HTTPS static host such as GitHub Pages or another provider, then open its URL in Chrome on Android and use the browser menu's **Install app** / **Add to Home screen** option.

## Important prototype limitations
- The Admin panel is intentionally a local demo and has no authentication. Anyone with access to the same browser can change its catalogue.
- Data is saved only in the current browser/device. It does not sync between users or devices.
- This starter has no server-side database, account system, DRM, payments, or secure admin permissions.
- Video hosting is not included. Store video files with a provider whose terms allow your intended distribution and use its authorized direct playback URL. External platforms may restrict embedding, downloads, or playback.
- Do not upload commercial films or episodes unless you own or have permission to distribute them.

## Production upgrade plan
For a public service, use a backend such as Supabase/Firebase for catalogues and user accounts, and a video provider with a suitable streaming/CDN plan. Keep admin credentials server-side, enforce role-based access and upload validation, and never place secret API keys in client code. Review free-tier limits before launch.

## To build a native Android APK
This folder is a PWA/web app source, not an Android Studio project. A native APK can be produced by wrapping the hosted app with a maintained Android WebView/Capacitor project and building it with Android Studio, or by rebuilding the interface in a native framework. PWA installation is the simplest no-cost way to try it on an Android phone first.
