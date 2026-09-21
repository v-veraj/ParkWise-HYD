# ParkWise HYD — Hackathon Presenter Guide

## 30-second opening

“Parking at a large campus is not just a question of how many spaces are empty. Employees need to know which gate to enter, which zone is reliable for their destination, whether a closure changes the route, and how to find their car later. ParkWise HYD is a privacy-first parking concierge that orchestrates that complete journey and gives Facilities aggregate utilization insight.”

## Three-minute live demonstration

### 1. Start in the employee app

Show the MoveInSync-style home screen.

Say:

“We are not asking employees to install another disconnected transport application. ParkWise appears as a campus-parking module in the commute experience they already use. For the hackathon, this is a simulated shell connected through a replaceable adapter.”

Select **Find parking**.

### 2. Transfer arrival intent

Point out that Building 4 and 10:00 AM were transferred.

Say:

“The host app shares only approved arrival intent. ParkWise does not read a private calendar by default.”

Select a preference, then choose **Find the best parking**.

### 3. Explain the recommendation

Point to:

- MLCP Level 4, Zone B.
- Gate 3.
- Live availability.
- Confidence.
- Plain-language reason.
- Backup option.

Say:

“This is more than availability. The recommendation combines occupancy, data confidence, predicted demand, walking distance, accessibility, closures, and gate rules. Forecasts are explicitly labeled rather than presented as guarantees.”

Select **Choose this zone**.

### 4. Reserve fairly

Point to B-17, the ten-minute hold, and auto-release.

Say:

“A reservation cannot lock capacity indefinitely. If the employee does not arrive and check in during the grace period, the bay automatically returns to the pool.”

Select **Confirm reservation**.

### 5. Navigate safely

Point to Gate 3, MLCP, Level 4, Zone B, and the countdown.

Say:

“Guidance becomes progressively finer—from gate, to facility, to level, to zone. In production, physical signs and voice-first guidance reduce phone use while driving.”

Select **I have reached Gate 3** and then **I have parked in B-17**.

### 6. Check in and remember the vehicle

Select **Simulate QR scan**.

Say:

“The QR confirms the bay without requiring continuous location tracking. Remember-my-car is optional and purpose-limited.”

### 7. Complete the return journey

Select **Find my car later**.

Say:

“The employee receives a return route, while Facilities sees only aggregate utilization, closures, no-shows, and sensor health.”

Select **Return to employee app**.

Say:

“Parking status flows back through the adapter, preserving one employee commute experience.”

## Architecture explanation

“The stall build is an installable PWA using HTML, responsive CSS, and browser-native JavaScript. `app.js` owns the journey state, live occupancy simulation, and reservation timer. `moveinsync-adapter.js` is the integration boundary. Today it supplies mock commute context and records callback events. In a pilot, we replace that adapter with the approved MoveInSync UAT API, deep link, or webview contract without rewriting the ParkWise screens.”

“The production design introduces a secure backend, Entra authentication, API Management, server-side reservation transactions, IoT occupancy metadata, an approved spatial model, Azure Maps for outdoor routing, and aggregate Power BI analytics.”

## Why this is technically credible

1. The MVP is narrow: one MLCP zone and 20–40 bays.
2. It degrades from bay guidance to zone guidance when sensing is incomplete.
3. It represents uncertainty rather than inventing availability.
4. Reservations auto-release.
5. Host integration is isolated behind an adapter.
6. Occupancy metadata is separated from employee identity.
7. The employee and Facilities views have different data boundaries.
8. The architecture can expand without replacing the user journey.

## Likely judge questions

### Is this connected to the real MoveInSync app?

“Not yet. This is an explicitly labeled integration prototype. MoveInSync supports enterprise SSO and customer integration patterns, but production work requires the Microsoft-approved UAT API or deep-link contract. We designed the adapter so that vendor-specific work is isolated.”

### Is the availability real?

“The hackathon feed is simulated. A pilot would ingest metadata from approved entry counters, aisle cameras running edge inference, or selected bay sensors. Every observation includes freshness and confidence.”

### Why use AI?

“AI is used where a rule-only screen is insufficient: forecasting demand, ranking several valid options, detecting contradictory telemetry, and explaining the recommendation. Reservations and access controls remain deterministic.”

### What happens when the AI is wrong?

“Availability carries confidence, stale data becomes uncertain, every recommendation has a backup, and Facilities can override closures. AI does not issue penalties.”

### Are you tracking employees?

“No continuous tracking is required. ParkWise uses selected destination, arrival time, reservation status, and optional bay confirmation. Facilities sees aggregate outcomes, not named parking histories.”

### Why not reserve every bay?

“Full bay-level reservation can reduce flexibility and increase no-shows. ParkWise supports a mixed model: reserve accessible, EV, or high-value bays and use best-available zone guidance elsewhere.”

### How does this scale?

“The hierarchy is campus, gate, facility, level, zone, bay, and sensor. New levels and facilities are data additions. The recommendation and reservation APIs operate on identifiers rather than hard-coded screens.”

### What is needed for a real pilot?

“One approved MLCP zone, a baseline study, MoveInSync UAT access, Entra configuration, a server-side reservation store, approved occupancy telemetry, Facilities ownership, accessibility testing, and privacy/security review.”

### What is the success metric?

“The primary metric is median gate-to-park time versus baseline. We also track incorrect availability, occupancy balance between zones, no-shows, auto-releases, sensor freshness, accessible journey completion, and repeat usage.”

## Closing

“ParkWise turns parking from a search problem into an orchestrated employee journey. It helps employees arrive predictably and helps Facilities use existing capacity more effectively—without continuous employee tracking. Don’t circle. Ask ParkWise.”
