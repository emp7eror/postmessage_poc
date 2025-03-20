// app2/src/App.js
import React, { useEffect, useState } from 'react';

const App2 = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResponse = (event) => {
            // Check the origin of the message
            if (event.origin !== 'http://localhost:3000') { // Replace with the actual origin of App1
                return; // Ignore messages from untrusted origins
            }

            const { data } = event;

            // Handle token response
            if (data.type === 'tokenResponse') {
                if (data.payload.error) {
                    console.error('Error received:', data.payload.error);
                } else {
                    console.log('Received token:', data.payload);
                }
            }

            // Handle customers response
            if (data.type === 'customersResponse') {
                if (data.payload.error) {
                    console.error('Error fetching customers:', data.payload.error);
                } else {
                    setCustomers(data.payload);
                }
                setLoading(false); // Stop loading when response is received
            }
        };

        // Add event listener for messages from App 1
        window.addEventListener('message', handleResponse);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('message', handleResponse);
        };
    }, []); // Empty dependency array to run only on mount and unmount

    const getToken = () => {
        const messageId = Date.now(); // Unique ID based on timestamp
        const message = { type: 'getToken', id: messageId }; // Include ID in the message
        window.parent.postMessage(message, '*'); // Send request to App 1
    };

    const showCustomers = () => {
        setLoading(true); // Set loading state
        const messageId = Date.now(); // Unique ID based on timestamp
        const message = { type: 'showCustomers', id: messageId }; // Include ID in the message
        window.parent.postMessage(message, '*'); // Send request to App 1
    };

    return (
        <div>
            <h1>INBOX</h1>
            <button onClick={getToken}>Get INBOX Token</button>
            <button onClick={showCustomers}>Show Customers</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {customers.map(c => (
                    <li key={c.id}>
                        <h2>{c.first_name} {c.last_name}</h2>
                        <p>Email: {c.email}</p>
                        <img src={c.avatar} alt={`${c.first_name} ${c.last_name}`} style={{ width: '100px' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App2;