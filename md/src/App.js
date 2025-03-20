// md/src/App.js
import React, { useEffect } from 'react';

const App1 = () => {
    useEffect(() => {
        const handleMessage = async (event) => {
            // Check the origin of the message
            if (event.origin !== 'http://localhost:3001') { // Replace with the actual origin of App2
                return; // Ignore messages from untrusted origins
            }

            const { data } = event;

            // Handle login request
            if (data.type === 'getToken') {
                try {
                    const response = await fetch('https://reqres.in/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: 'eve.holt@reqres.in',
                            password: 'cityslicka',
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const tokenData = await response.json();
                    // Include the message ID in the response
                    event.source.postMessage({ type: 'tokenResponse', payload: tokenData, id: data.id }, event.origin);
                } catch (error) {
                    console.error('Error during login:', error);
                    event.source.postMessage({ type: 'tokenResponse', payload: { error: error.message }, id: data.id }, event.origin);
                }
            }

            // Handle request for customers
            if (data.type === 'showCustomers') {
                try {
                    const customerResponse = await fetch('https://reqres.in/api/users?page=2');
                    const customerData = await customerResponse.json();
                    event.source.postMessage({ type: 'customersResponse', payload: customerData.data, id: data.id }, event.origin);
                } catch (error) {
                    console.error('Error fetching customers:', error);
                    event.source.postMessage({ type: 'customersResponse', payload: { error: error.message }, id: data.id }, event.origin);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage); // Clean up the listener
        };
    }, []);

    return (
        <div>
            <h1>MD</h1>
            <p>MD is running. Waiting for requests from INBOX...</p>
            <iframe src="http://localhost:3001" title="INBOX" style={{ width: '100%', height: '400px', border: '1px solid black' }} />
        </div>
    );
};

export default App1;