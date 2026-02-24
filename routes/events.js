const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const cache = require('../middleware/cache');

// ===== EVENT ROUTES =====

// GET all events
router.get('/', cache(300), eventsController.getAllEvents);

// GET active events
router.get('/active', eventsController.getActiveEvents);

// GET upcoming events
router.get('/upcoming', eventsController.getUpcomingEvents);

// GET ended events
router.get('/ended', eventsController.getEndedEvents);

// GET events by category
router.get('/category/:category', eventsController.getEventsByCategory);

// ===== HACKATHON ROUTES (must come before /:id to avoid conflicts) =====

// GET all hackathons (with their YSWS)
router.get('/hackathons', eventsController.getAllHackathons);

// GET active hackathons (with their YSWS)
router.get('/hackathons/active', eventsController.getActiveHackathons);

// GET single hackathon with its YSWS events
router.get('/hackathons/:id', eventsController.getHackathonById);

// GET YSWS events for a specific hackathon
router.get('/hackathons/:hackathonId/ysws', eventsController.getYSWSForHackathon);

// POST create new hackathon
router.post('/hackathons', eventsController.createHackathon);

// PATCH update hackathon
router.patch('/hackathons/:id', eventsController.updateHackathon);

// DELETE hackathon
router.delete('/hackathons/:id', eventsController.deleteHackathon);

// ===== CATCH-ALL EVENT BY ID (must be last) =====

// GET single event by ID
router.get('/:id', eventsController.getEventById);

// POST create new event
router.post('/', eventsController.createEvent);

// PATCH update event
router.patch('/:id', eventsController.updateEvent);

// DELETE event
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;
