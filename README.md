# YSWS Events API

API for Hack Club's YSWS (You Ship, We Ship) events and hackathons. Pulls data from Airtable and serves it as a REST API.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your Airtable credentials:
   ```
   AIRTABLE_API_KEY=your_personal_access_token
   AIRTABLE_BASE_ID=your_base_id
   AIRTABLE_EVENTS_TABLE=YSWS
   AIRTABLE_HACKATHONS_TABLE=Hackathons
   PORT=3000
   NODE_ENV=development
   ```

3. Run the server:
   ```
   npm run dev
   ```

## Project Structure

```
├── public/              # Static frontend files
│   └── index.html       # Demo page that displays events
├── controllers/
│   └── eventsController.js  # All API logic (Airtable queries, formatting)
├── routes/
│   └── events.js        # Maps URLs to controller functions
├── server.js            # Entry point — starts Express, loads middleware
├── .env                 # Your secrets (not committed to git)
└── package.json
```

## API Endpoints

### YSWS Events

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/events` | All YSWS events (supports `?status=Upcoming`, `?status=In%20Progress`, or `?status=Ended`) |
| GET | `/api/events/active` | Events with status "In Progress" |
| GET | `/api/events/upcoming` | Events with status "Upcoming" |
| GET | `/api/events/ended` | Events with status "Ended" |
| GET | `/api/events/category/:category` | Events filtered by category (e.g., `/category/Prototype`) |
| GET | `/api/events/:id` | Single event by Airtable record ID |

### Hackathons

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/events/hackathons` | All hackathons with linked YSWS events (supports `?status=Upcoming`, `?status=In%20Progress`, or `?status=Ended`) |
| GET | `/api/events/hackathons/active` | Active hackathons |
| GET | `/api/events/hackathons/:id` | Single hackathon with its YSWS events |
| GET | `/api/events/hackathons/:id/ysws` | Only the YSWS events for a hackathon |

### Other

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/` | API documentation (list of endpoints) |
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
