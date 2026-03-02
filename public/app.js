function statusClass(status) {
  if (!status) return 'status-unknown';
  return 'status-' + status.toLowerCase().replace(/ /g, '.');
}

function renderEventCard(event) {
  return `
    <div class="event-card">
      <h3>${event.Name || 'Untitled'}</h3>
      <span class="status ${statusClass(event.Status)}">${event.Status || 'Unknown'}</span>
      <p>${event.Description || ''}</p>
      <p><strong>Due:</strong> ${new Date(event['End Date']).toLocaleDateString()}</p>
      ${event.Website ? `<a href="${event.Website}" class="btn">Learn More →</a>` : ''}
    </div>
  `;
}

function renderHackathonCard(hackathon) {
  return `
    <div class="event-card">
      <h3>${hackathon.Name}</h3>
      <span class="status ${statusClass(hackathon.Status)}">${hackathon.Status}</span>
      <p>${hackathon.Description || ''}</p>
      <p><strong>Dates:</strong> ${new Date(hackathon['Start Date']).toLocaleDateString()} — ${new Date(hackathon['End Date']).toLocaleDateString()}</p>
      ${hackathon.yswsCount > 0 ? `<p><strong>YSWS Challenges:</strong> ${hackathon.yswsCount}</p>` : ''}
      ${hackathon.yswsDetails ? hackathon.yswsDetails.map(ysws => `
        <div class="ysws-nested">
          <strong>${ysws.Name}</strong>
          <p>${ysws.Description || ''}</p>
          ${ysws.Website ? `<a href="${ysws.Website}" class="btn btn-small">View →</a>` : ''}
        </div>
      `).join('') : ''}
      ${hackathon.Website ? `<a href="${hackathon.Website}" class="btn">Learn More →</a>` : ''}
    </div>
  `;
}

// Fetch YSWS events
fetch('/api/events')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('events-container');
    if (data.success && data.data.length > 0) {
      container.innerHTML = data.data.map(renderEventCard).join('');
    } else {
      container.innerHTML = '<p>No events found</p>';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('events-container').innerHTML =
      `<p>Error: ${error.message}</p>`;
       '<p>Error loading events. Make sure the API is running!</p>';
  });

// Fetch hackathons with their YSWS
fetch('/api/events/hackathons')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('hackathons-container');
    if (data.success && data.data.length > 0) {
      container.innerHTML = data.data.map(renderHackathonCard).join('');
    } else {
      container.innerHTML = '<p>No hackathons found</p>';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('hackathons-container').innerHTML =
      '<p>Error loading hackathons. Make sure the API is running!</p>';
  });
