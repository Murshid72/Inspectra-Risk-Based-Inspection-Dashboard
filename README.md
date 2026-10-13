# Inspectra — Risk-Based Inspection Dashboard

**A student-built web prototype for prioritising field inspections using explainable risk signals and evidence verification.**

Inspectra demonstrates how an inspection team could review submissions, spot missing evidence, prioritise risky records, and understand why a record was flagged. It uses fictional sample records and transparent rules—not a trained AI model or live government data.

## Features

- Responsive dark dashboard with inspection metrics and activity chart
- Search inspections by site, ID, or inspector
- Filter records by review status
- Create a new demo inspection
- Rule-based trust and risk scores with visible reasons
- Prioritised alert list
- Mark a record as reviewed/verified in the current page session
- Export inspection records to CSV
- No API keys, paid services, or installation required

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local development server, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a GitHub repository named `inspectra`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. Wait for the published URL to appear in the Pages section.

## How the demo scores work

The score rules are intentionally simple so they can be inspected and explained:

- Start with trust score 100 and risk score 0.
- Missing photo evidence subtracts 35 trust points and adds 45 risk points.
- Location mismatch subtracts 30 trust points and adds 40 risk points.
- Risk bands: low (0–34), medium (35–69), high (70–100).

These are illustrative prototype rules, not validated safety criteria. Real deployment would require domain experts, threat modelling, privacy controls, auditability, field testing, and calibrated thresholds. A score is a review aid, not proof of fraud or misconduct.

## Current limitations

- All records are fictional demo data.
- Changes exist only in the current browser session; there is no database or login.
- GPS, camera capture, evidence uploads, and identity verification are not implemented.
- The activity chart and some summary values are illustrative.
- Trust/risk scores use transparent rules, not machine learning.

## Roadmap

- Add authenticated roles for inspectors and administrators.
- Persist inspections in a database.
- Capture location and timestamps with appropriate consent and permissions.
- Add site geofencing and secure evidence storage.
- Build an audit log and tests for score calculations.
- Validate the scoring rules with domain experts before real use.

## Tech stack

HTML · CSS · JavaScript · CSV export · GitHub Pages

## Project status

**Prototype / learning project.** Built to demonstrate product thinking, frontend implementation, explainable rule-based prioritisation, and a clear README. Contributions and issues are welcome.

## Author

Murshid — Computer Science & Engineering student.
