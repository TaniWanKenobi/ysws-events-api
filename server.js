require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'YSWS Events API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hack Clubs Events API!',
    endpoints: {
      health: '/health',
      allEvents: '/api/events',
      activeEvents: '/api/events/active',
      upcomingEvents: '/api/events/upcoming',
      eventsByCategory: '/api/events/category/:category',
      singleEvent: '/api/events/:id',
      allHackathons: '/api/events/hackathons',
      activeHackathons: '/api/events/hackathons/active',
      hackathonById: '/api/events/hackathons/:id',
      hackathonYSWS: '/api/events/hackathons/:id/ysws'
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