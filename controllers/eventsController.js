const Airtable = require('airtable');

// Configure Airtable
const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(process.env.AIRTABLE_BASE_ID);

const eventsTable = process.env.AIRTABLE_EVENTS_TABLE || 'Events';
const hackathonsTable = process.env.AIRTABLE_HACKATHONS_TABLE || 'Hackathons';


const formatRecord = (record) => {
  return {
    id: record.id,
    ...record.fields,
    createdTime: record._rawJson.createdTime
  };
};

// Helper function to get YSWS event details for linked records
const getYSWSDetails = async (yswsIds) => {
  if (!yswsIds || yswsIds.length === 0) return [];
  
  try {
    const events = await Promise.all(
      yswsIds.map(id => base(eventsTable).find(id))
    );
    return events.map(formatRecord);
  } catch (error) {
    console.error('Error fetching YSWS details:', error);
    return [];
  }
};

// Helper function to get hackathon details for linked records
const getHackathonDetails = async (hackathonIds) => {
  if (!hackathonIds || hackathonIds.length === 0) return [];
  
  try {
    const hackathons = await Promise.all(
      hackathonIds.map(id => base(hackathonsTable).find(id))
    );
    return hackathons.map(formatRecord);
  } catch (error) {
    console.error('Error fetching hackathon details:', error);
    return [];
  }
};

// Helper to resolve hackathon links on an event record
const resolveHackathonLinks = async (record) => {
  if (record['Hackathons']) {
    record.hackathonDetails = await getHackathonDetails(record['Hackathons']);
  }
  return record;
};

// ===== EVENT ENDPOINTS =====

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const records = [];
    
    await base(eventsTable)
      .select({
        view: 'Grid view',
        sort: [{ field: 'Start Date', direction: 'desc' }]
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push(formatRecord(record));
        });
        fetchNextPage();
      });

    const resolved = await Promise.all(records.map(resolveHackathonLinks));

    res.json({
      success: true,
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const record = await base(eventsTable).find(req.params.id);
    const formatted = await resolveHackathonLinks(formatRecord(record));
    
    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(404).json({
      success: false,
      error: 'Event not found'
    });
  }
};

// Get active events
exports.getActiveEvents = async (req, res) => {
  try {
    const records = [];
    
    await base(eventsTable)
      .select({
        filterByFormula: "{Status} = 'Active'",
        sort: [{ field: 'Start Date', direction: 'asc' }]
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push(formatRecord(record));
        });
        fetchNextPage();
      });

    const resolved = await Promise.all(records.map(resolveHackathonLinks));

    res.json({
      success: true,
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    console.error('Error fetching active events:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const records = [];
    const today = new Date().toISOString();
    
    await base(eventsTable)
      .select({
        filterByFormula: `AND({Status} = 'Upcoming', {Start Date} > '${today}')`,
        sort: [{ field: 'Start Date', direction: 'asc' }]
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push(formatRecord(record));
        });
        fetchNextPage();
      });

    const resolved = await Promise.all(records.map(resolveHackathonLinks));

    res.json({
      success: true,
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get events by category
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const records = [];
    
    await base(eventsTable)
      .select({
        filterByFormula: `{Category} = '${category}'`,
        sort: [{ field: 'Start Date', direction: 'desc' }]
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push(formatRecord(record));
        });
        fetchNextPage();
      });

    const resolved = await Promise.all(records.map(resolveHackathonLinks));

    res.json({
      success: true,
      count: resolved.length,
      data: resolved
    });
  } catch (error) {
    console.error('Error fetching events by category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const record = await base(eventsTable).create(eventData);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: formatRecord(record)
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const record = await base(eventsTable).update(id, updates);
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: formatRecord(record)
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await base(eventsTable).destroy(id);
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ===== HACKATHON ENDPOINTS =====

// Get all hackathons with their YSWS events
exports.getAllHackathons = async (req, res) => {
  try {
    const records = [];
    
    await base(hackathonsTable)
      .select({
        view: 'Grid view',
        sort: [{ field: 'Start Date', direction: 'desc' }]
      })
      .eachPage(async (pageRecords, fetchNextPage) => {
        for (const record of pageRecords) {
          const formattedRecord = formatRecord(record);
          
          // If hackathon has associated YSWS, fetch their details
          if (formattedRecord['Associated YSWS']) {
            formattedRecord.yswsDetails = await getYSWSDetails(
              formattedRecord['Associated YSWS']
            );
            formattedRecord.yswsCount = formattedRecord['Associated YSWS'].length;
          } else {
            formattedRecord.yswsCount = 0;
          }
          
          records.push(formattedRecord);
        }
        fetchNextPage();
      });

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get active hackathons with their YSWS
exports.getActiveHackathons = async (req, res) => {
  try {
    const records = [];
    
    await base(hackathonsTable)
      .select({
        filterByFormula: "{Status} = 'Active'",
        sort: [{ field: 'Start Date', direction: 'asc' }]
      })
      .eachPage(async (pageRecords, fetchNextPage) => {
        for (const record of pageRecords) {
          const formattedRecord = formatRecord(record);
          
          if (formattedRecord['Associated YSWS']) {
            formattedRecord.yswsDetails = await getYSWSDetails(
              formattedRecord['Associated YSWS']
            );
            formattedRecord.yswsCount = formattedRecord['Associated YSWS'].length;
          } else {
            formattedRecord.yswsCount = 0;
          }
          
          records.push(formattedRecord);
        }
        fetchNextPage();
      });

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error fetching active hackathons:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get hackathon by ID with all its YSWS events
exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await base(hackathonsTable).find(req.params.id);
    const formattedHackathon = formatRecord(hackathon);
    
    // Get detailed YSWS information
    if (formattedHackathon['Associated YSWS']) {
      formattedHackathon.yswsDetails = await getYSWSDetails(
        formattedHackathon['Associated YSWS']
      );
      formattedHackathon.yswsCount = formattedHackathon['Associated YSWS'].length;
    } else {
      formattedHackathon.yswsDetails = [];
      formattedHackathon.yswsCount = 0;
    }
    
    res.json({
      success: true,
      data: formattedHackathon
    });
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    res.status(404).json({
      success: false,
      error: 'Hackathon not found'
    });
  }
};

// Get YSWS events for a specific hackathon
exports.getYSWSForHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    // First verify the hackathon exists and get it
    let hackathon;
    try {
      hackathon = await base(hackathonsTable).find(hackathonId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'Hackathon not found'
      });
    }
    
    const formattedHackathon = formatRecord(hackathon);
    
    // Get the YSWS events
    let yswsEvents = [];
    if (formattedHackathon['Associated YSWS']) {
      yswsEvents = await getYSWSDetails(formattedHackathon['Associated YSWS']);
    }
    
    res.json({
      success: true,
      hackathon: {
        id: formattedHackathon.id,
        name: formattedHackathon.Name,
        description: formattedHackathon.Description,
        status: formattedHackathon.Status
      },
      count: yswsEvents.length,
      data: yswsEvents
    });
  } catch (error) {
    console.error('Error fetching YSWS for hackathon:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new hackathon
exports.createHackathon = async (req, res) => {
  try {
    const hackathonData = req.body;
    
    // Associated YSWS should be an array of YSWS event record IDs
    const record = await base(hackathonsTable).create(hackathonData);
    const formattedRecord = formatRecord(record);
    
    if (formattedRecord['Associated YSWS']) {
      formattedRecord.yswsDetails = await getYSWSDetails(
        formattedRecord['Associated YSWS']
      );
      formattedRecord.yswsCount = formattedRecord['Associated YSWS'].length;
    }
    
    res.status(201).json({
      success: true,
      message: 'Hackathon created successfully',
      data: formattedRecord
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update hackathon
exports.updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const record = await base(hackathonsTable).update(id, updates);
    const formattedRecord = formatRecord(record);
    
    if (formattedRecord['Associated YSWS']) {
      formattedRecord.yswsDetails = await getYSWSDetails(
        formattedRecord['Associated YSWS']
      );
      formattedRecord.yswsCount = formattedRecord['Associated YSWS'].length;
    }
    
    res.json({
      success: true,
      message: 'Hackathon updated successfully',
      data: formattedRecord
    });
  } catch (error) {
    console.error('Error updating hackathon:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete hackathon
exports.deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    await base(hackathonsTable).destroy(id);
    
    res.json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};