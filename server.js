require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/events', eventsRouter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'YSWS Events API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Hack Clubs Events API!',
    documentation: {
      ysws: {
        allEvents: {
          url: '/api/events',
          method: 'GET',
          description: 'Returns all YSWS events (optionally filtered by status)',
          queryParams: {
            status: 'Upcoming | In Progress | Ended'
          },
          example: '/api/events?status=Upcoming'
        },
        activeEvents: {
          url: '/api/events/active',
          method: 'GET',
          description: 'Returns all YSWS events with status "In Progress"'
        },
        upcomingEvents: {
          url: '/api/events/upcoming',
          method: 'GET',
          description: 'Returns all YSWS events with status "Upcoming" and a future start date'
        },
        endedEvents: {
          url: '/api/events/ended',
          method: 'GET',
          description: 'Returns all YSWS events with status "Ended"'
        },
        eventsByCategory: {
          url: '/api/events/category/:category',
          method: 'GET',
          description: 'Returns YSWS events filtered by category',
          example: '/api/events/category/Prototype'
        },
        singleEvent: {
          url: '/api/events/:id',
          method: 'GET',
          description: 'Returns a single YSWS event by its Airtable record ID',
          example: '/api/events/recABC123'
        },
        createEvent: {
          url: '/api/events',
          method: 'POST',
          auth: 'x-api-key header required',
          description: 'Creates a new YSWS event'
        },
        updateEvent: {
          url: '/api/events/:id',
          method: 'PATCH',
          auth: 'x-api-key header required',
          description: 'Updates an existing YSWS event'
        },
        deleteEvent: {
          url: '/api/events/:id',
          method: 'DELETE',
          auth: 'x-api-key header required',
          description: 'Deletes a YSWS event'
        }
      },
      hackathons: {
        allHackathons: {
          url: '/api/events/hackathons',
          method: 'GET',
          description: 'Returns all hackathons with their linked YSWS events (optionally filtered by status)',
          queryParams: {
            status: 'Upcoming | In Progress | Ended'
          },
          example: '/api/events/hackathons?status=Ended'
        },
        activeHackathons: {
          url: '/api/events/hackathons/active',
          method: 'GET',
          description: 'Returns hackathons with status "In Progress"'
        },
        hackathonById: {
          url: '/api/events/hackathons/:id',
          method: 'GET',
          description: 'Returns a single hackathon with its linked YSWS events',
          example: '/api/events/hackathons/recPpy3V60jTUcCng'
        },
        hackathonYSWS: {
          url: '/api/events/hackathons/:id/ysws',
          method: 'GET',
          description: 'Returns only the YSWS events linked to a specific hackathon',
          example: '/api/events/hackathons/recPpy3V60jTUcCng/ysws'
        }
      },
      health: {
        url: '/health',
        method: 'GET',
        description: 'Returns API status and current timestamp'
      },
      mutationExamples: {
        createEventPowerShell:
          "Invoke-RestMethod -Uri 'https://ysws-events-api.vercel.app/api/events' -Method Post -Headers @{'x-api-key'='your-api-key-here'; 'Content-Type'='application/json'} -Body '{\"Name\":\"Test Event\",\"Status\":\"Upcoming\",\"Start Date\":\"2026-04-01\",\"End Date\":\"2026-04-30\",\"Description\":\"A test event\"}'",
        updateEventPowerShell:
          "Invoke-RestMethod -Uri 'https://ysws-events-api.vercel.app/api/events/RECORD_ID_HERE' -Method Patch -Headers @{'x-api-key'='your-api-key-here'; 'Content-Type'='application/json'} -Body '{\"Status\":\"In Progress\"}'",
        deleteEventPowerShell:
          "Invoke-RestMethod -Uri 'https://ysws-events-api.vercel.app/api/events/RECORD_ID_HERE' -Method Delete -Headers @{'x-api-key'='your-api-key-here'}"
      }
    }
  });
});


app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/events`);
  console.log(`Health check at http://localhost:${PORT}/health`);
});

module.exports = app;
