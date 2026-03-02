# YSWS Events API

<a id="readme-top"></a>

<p align="center">
  <a href="https://ysws-events-api.vercel.app/api">
    <img src="https://img.shields.io/badge/API-Live-ec3750?style=for-the-badge" alt="Live API">
  </a>
  <a href="https://expressjs.com/">
    <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express" alt="Express">
  </a>
  <a href="https://airtable.com/">
    <img src="https://img.shields.io/badge/Airtable-Data%20Source-18BFFF?style=for-the-badge&logo=airtable&logoColor=white" alt="Airtable">
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel" alt="Vercel">
  </a>
</p>

<br />

<div align="center">
  <img src="https://hackclub.com/stickers/orphmoji_yippee.png" alt="YSWS Events API" width="120">
</div>

<h3 align="center">Hack Club YSWS + Hackathons API</h3>

<p align="center">
  REST API for listing, filtering, and managing YSWS events and hackathons backed by Airtable.
</p>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#powershell-examples-production-api">PowerShell Examples (Production API)</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

This API powers Hack Club YSWS and hackathon event data from Airtable.

It can be used [here](https://ysws-events-api.vercel.app/)!

It supports:
- Read endpoints for events and hackathons
- Status filtering (`Upcoming`, `In Progress`, `Ended`) on list endpoints
- Category filtering for events
- Protected create/update/delete endpoints using `x-api-key`

Live API docs: `https://ysws-events-api.vercel.app/api`

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Airtable](https://airtable.com/)
- [Vercel](https://vercel.com/)
- [Upstash Redis](https://upstash.com/) (cache)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env.example`) with your credentials.
3. Run locally:
   ```bash
   npm run dev
   ```

## Project Structure

```txt
public/                  # Static frontend demo
controllers/             # API controller logic
routes/                  # Express route definitions
middleware/              # Auth + cache middleware
server.js                # App entrypoint
```

## API Endpoints

### YSWS Events

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/events` | All YSWS events (supports `?status=Upcoming`, `?status=In%20Progress`, or `?status=Ended`) |
| GET | `/api/events/active` | Events with status `In Progress` |
| GET | `/api/events/upcoming` | Events with status `Upcoming` |
| GET | `/api/events/ended` | Events with status `Ended` |
| GET | `/api/events/category/:category` | Events filtered by category |
| GET | `/api/events/:id` | Single event by Airtable record ID |
| POST | `/api/events` | Create event (`x-api-key` required) |
| PATCH | `/api/events/:id` | Update event (`x-api-key` required) |
| DELETE | `/api/events/:id` | Delete event (`x-api-key` required) |

### Hackathons

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/events/hackathons` | All hackathons (supports `?status=Upcoming`, `?status=In%20Progress`, or `?status=Ended`) |
| GET | `/api/events/hackathons/active` | Hackathons with status `In Progress` |
| GET | `/api/events/hackathons/:id` | Single hackathon with linked YSWS |
| GET | `/api/events/hackathons/:id/ysws` | Linked YSWS events for one hackathon |
| POST | `/api/events/hackathons` | Create hackathon (`x-api-key` required) |
| PATCH | `/api/events/hackathons/:id` | Update hackathon (`x-api-key` required) |
| DELETE | `/api/events/hackathons/:id` | Delete hackathon (`x-api-key` required) |

### Other

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api` | API documentation JSON |
| GET | `/health` | Health check |

## PowerShell Examples (Production API)

Create an event:

```powershell
Invoke-RestMethod -Uri "https://ysws-events-api.vercel.app/api/events" -Method Post -Headers @{"x-api-key"="your-api-key-here"; "Content-Type"="application/json"} -Body '{"Name":"Test Event","Status":"Upcoming","Start Date":"2026-04-01","End Date":"2026-04-30","Description":"A test event"}'
```

Update an event:

```powershell
Invoke-RestMethod -Uri "https://ysws-events-api.vercel.app/api/events/RECORD_ID_HERE" -Method Patch -Headers @{"x-api-key"="your-api-key-here"; "Content-Type"="application/json"} -Body '{"Status":"In Progress"}'
```

Delete an event:

```powershell
Invoke-RestMethod -Uri "https://ysws-events-api.vercel.app/api/events/RECORD_ID_HERE" -Method Delete -Headers @{"x-api-key"="your-api-key-here"}
```

## Contact

Tanishq Goyal - @Tanuki - [tanishqgoyal590@gmail.com](mailto:tanishqgoyal590@gmail.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
