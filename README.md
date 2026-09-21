# ParkWise HYD

ParkWise HYD is an installable mobile web prototype for a smart parking concierge at Microsoft Hyderabad. It demonstrates an employee journey from MoveInSync-style commute context through parking recommendation, reservation, gate routing, garage guidance, QR check-in, and vehicle-location recall.

## Run locally

From this folder:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8765
```

The app must be served over HTTP rather than opened directly from disk because the PWA service worker requires an HTTP origin. `localhost` is treated as a secure development origin by modern browsers.

## Source map

| File | Purpose |
|---|---|
| `index.html` | Application screens and semantic UI structure |
| `styles.css` | Desktop, kiosk, and mobile responsive presentation |
| `app.js` | Journey state, reservation timer, occupancy simulation, and UI events |
| `moveinsync-adapter.js` | Replaceable integration boundary for MoveInSync |
| `manifest.webmanifest` | Installable PWA metadata |
| `service-worker.js` | Offline application-shell cache |
| `icon.svg` | ParkWise application icon |
| `TECHNICAL_GUIDE.md` | Architecture, data flow, production design, and security |
| `PRESENTER_GUIDE.md` | Live demonstration script and judge Q&A |

## Prototype notice

This hackathon build does not connect to a production MoveInSync environment, Microsoft employee data, campus sensors, or a real reservation system. The adapter and telemetry are deliberately simulated. Production integration requires approved API contracts, UAT credentials, identity configuration, privacy review, and Facilities/Security ownership.
