import React, { useState, useEffect } from 'react';

const ReportGenerator = ({ isAuthenticated, authToken }) => {
  const [reportData, setReportData] = useState({
    events: [],
    volunteerHistory: [],
    loading: true,
    error: null
  });

  const fetchReportData = async () => {
    try {
      console.log('Auth status:', { isAuthenticated, authToken });
      
      if (!isAuthenticated || !authToken) {
        throw new Error('Authentication required');
      }

      // Fetch events
      const eventsResponse = await fetch('/api/events', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Request-Source': 'ReportGenerator'
        }
      });

      if (!eventsResponse.ok) {
        throw new Error(`Events fetch failed: ${eventsResponse.status}`);
      }

      const events = await eventsResponse.json();
      console.log('Events data:', events);

      // Fetch volunteer history with auth token
      const historyResponse = await fetch('/api/volunteer-history', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-Request-Source': 'ReportGenerator'
        }
      });

      if (!historyResponse.ok) {
        throw new Error(`Volunteer history fetch failed: ${historyResponse.status}`);
      }

      const history = await historyResponse.json();
      console.log('Volunteer history:', history);

      // Combine the data
      const combinedData = events.map(event => {
        const volunteersForEvent = history.filter(h => h.event_name === event.event_name);
        return {
          eventName: event.event_name || 'Unnamed Event',
          date: event.event_date ? new Date(event.event_date).toLocaleDateString() : 'No Date',
          location: event.location || `${event.city}, ${event.state_name}`,
          description: event.description || 'No Description',
          urgency: event.urgency || 'Not Specified',
          volunteersRegistered: volunteersForEvent.length,
          volunteers: volunteersForEvent.map(v => ({
            name: v.volunteer_name,
            email: v.email,
            status: v.participation_status
          })),
          skills: Array.isArray(event.required_skills) 
            ? event.required_skills.join(', ') 
            : typeof event.required_skills === 'string' 
              ? JSON.parse(event.required_skills).join(', ') 
              : 'None',
          status: event.event_date 
            ? new Date(event.event_date) > new Date() ? 'Upcoming' : 'Completed'
            : 'Unknown'
        };
      });

      console.log('Combined data:', combinedData);

      setReportData({
        events: combinedData,
        volunteerHistory: history,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error in fetchReportData:', error);
      setReportData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load report data'
      }));
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [isAuthenticated, authToken]);

  if (reportData.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading report data...</div>
      </div>
    );
  }

  if (reportData.error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{reportData.error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Event Reports</h2>
          <button
            onClick={() => {
              const headers = [
                'Event Name',
                'Date',
                'Location',
                'Description',
                'Urgency',
                'Volunteers Registered',
                'Volunteer Names',
                'Volunteer Status',
                'Required Skills',
                'Status'
              ];

              const csvData = reportData.events.map(event => [
                event.eventName,
                event.date,
                event.location,
                event.description,
                event.urgency,
                event.volunteersRegistered,
                event.volunteers.map(v => v.name).join('; '),
                event.volunteers.map(v => `${v.name}:${v.status}`).join('; '),
                event.skills,
                event.status
              ]);

              csvData.unshift(headers);
              const csvString = csvData
                .map(row => row.map(cell => `"${cell || ''}"`).join(','))
                .join('\n');

              const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `volunteer-events-${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            disabled={reportData.events.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to CSV
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          {reportData.events.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.events.map((event, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{event.eventName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        {
                          'High': 'bg-red-100 text-red-800',
                          'Medium': 'bg-yellow-100 text-yellow-800',
                          'Low': 'bg-green-100 text-green-800'
                        }[event.urgency] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.volunteersRegistered}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {event.volunteers.map((volunteer, idx) => (
                          <div key={idx} className="mb-1">
                            <span className="font-medium">{volunteer.name}</span>
                            <span className={`ml-2 px-2 text-xs rounded-full ${
                              {
                                'Completed': 'bg-green-100 text-green-800',
                                'Pending': 'bg-yellow-100 text-yellow-800',
                                'Cancelled': 'bg-red-100 text-red-800'
                              }[volunteer.status]
                            }`}>
                              {volunteer.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">No events found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;