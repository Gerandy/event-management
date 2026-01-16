/**
 * Convert array of objects to CSV format
 */
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headerRow = headers.map(h => `"${h}"`).join(',');

  // Create data rows
  const dataRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) {
        return '';
      }
      // Escape quotes and wrap in quotes if contains comma or newline
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Export events to CSV
 */
export const exportEventsToCSV = (events) => {
  const headers = ['Title', 'Date', 'Time', 'Location', 'Category', 'Capacity', 'Registered', 'Description'];

  const data = events.map(event => ({
    'Title': event.title || '',
    'Date': event.date ? new Date(event.date).toLocaleDateString() : '',
    'Time': event.time || '',
    'Location': event.location || '',
    'Category': event.category || '',
    'Capacity': event.capacity || '',
    'Registered': event.registered || 0,
    'Description': event.description || '',
  }));

  const csv = convertToCSV(data, headers);
  const filename = `events_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};

/**
 * Export attendees to CSV
 */
export const exportAttendeesToCSV = (attendees, eventTitle) => {
  const headers = ['Name', 'Email', 'Ticket Code', 'Status', 'Registered At'];

  const data = attendees.map(attendee => ({
    'Name': attendee.name || '',
    'Email': attendee.email || '',
    'Ticket Code': attendee.ticketCode || '',
    'Status': attendee.checkedIn ? 'Checked In' : 'Not Checked In',
    'Registered At': attendee.registeredAt ? new Date(attendee.registeredAt).toLocaleString() : '',
  }));

  const csv = convertToCSV(data, headers);
  const filename = `attendees_${eventTitle}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, filename);
};
