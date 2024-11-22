import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventRegistration = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events');
                setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleRegistration = async () => {
        if (!selectedEvent) {
            setError('Please select an event');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/event-users', {
                event_id: parseInt(selectedEvent),
                email: user.email
            });
            
            setSuccess('Successfully registered for the event!');
            setError('');
            setSelectedEvent('');
            
            const response = await axios.get('http://localhost:8080/api/events');
            setEvents(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register for event');
            setSuccess('');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Event Registration</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Event
                </label>
                <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Choose an event...</option>
                    {events.map((event) => (
                        <option key={event.event_id} value={event.event_id}>
                            {event.event_name} - {new Date(event.event_date).toLocaleDateString()}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleRegistration}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Register for Event
            </button>
        </div>
    );
};

export default EventRegistration;