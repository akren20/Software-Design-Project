import React, { useState, useEffect } from "react";

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]);
  const [sortBy, setSortBy] = useState("event_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: 'email', label: 'Email', sortable: true },
    { field: 'event_name', label: 'Event Name', sortable: true },
    { field: 'event_description', label: 'Event Description', sortable: true },
    { field: 'location', label: 'Location', sortable: true },
    { field: 'required_skills', label: 'Required Skills', sortable: false },
    { field: 'urgency', label: 'Urgency', sortable: true },
    { field: 'event_date', label: 'Event Date', sortable: true },
    { field: 'participation_status', label: 'Status', sortable: true }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/volunteer-history", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      const formattedData = data.map(item => ({
        ...item,
        required_skills: typeof item.required_skills === 'string' 
          ? JSON.parse(item.required_skills) 
          : item.required_skills || []
      }));
      
      setHistory(formattedData);
    } catch (error) {
      console.error("Error fetching volunteer history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (!columns.find(col => col.field === field)?.sortable) return;

    const order = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(order);

    const sortedHistory = [...history].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      // Handle different data types
      if (field === 'event_date') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      } else if (field === 'required_skills') {
        valueA = valueA.join(',');
        valueB = valueB.join(',');
      } else if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });

    setHistory(sortedHistory);
  };

  const SortIndicator = ({ field }) => {
    if (!columns.find(col => col.field === field)?.sortable) return null;
    
    return (
      <span className="ml-1">
        {sortBy === field ? (
          <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>
        ) : (
          <span className="text-gray-300">↕</span>
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Volunteer Participation History</h2>
        <span className="text-sm text-gray-500">
          {history.length} {history.length === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              {columns.map(({ field, label, sortable }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`py-3 px-4 text-left text-sm font-semibold text-gray-600 ${
                    sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center">
                    {label}
                    <SortIndicator field={field} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((event, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{event.email}</td>
                <td className="py-3 px-4 text-sm font-medium">{event.event_name}</td>
                <td className="py-3 px-4 text-sm">{event.event_description}</td>
                <td className="py-3 px-4 text-sm">{event.location}</td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(event.required_skills) && event.required_skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    {
                      'High': 'bg-red-100 text-red-800',
                      'Medium': 'bg-yellow-100 text-yellow-800',
                      'Low': 'bg-green-100 text-green-800',
                      'Critical': 'bg-purple-100 text-purple-800'
                    }[event.urgency] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.urgency}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  {new Date(event.event_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    {
                      'Completed': 'bg-green-100 text-green-800',
                      'Pending': 'bg-yellow-100 text-yellow-800',
                      'Cancelled': 'bg-red-100 text-red-800'
                    }[event.participation_status]
                  }`}>
                    {event.participation_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerHistory;