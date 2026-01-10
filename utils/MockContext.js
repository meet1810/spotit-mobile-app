import React, { createContext, useState, useContext } from 'react';

const MockContext = createContext();

export const MockProvider = ({ children }) => {
    const [user, setUser] = useState({ name: 'Citizen User', location: 'New Delhi' });
    const [issues, setIssues] = useState([
        {
            id: '1',
            imageUri: 'https://via.placeholder.com/150', // Placeholder for demo
            timestamp: Date.now() - 10000000,
            status: 'Counted',
            locationText: 'Sector 4, New Delhi',
            category: 'Garbage Dump',
            points: 50
        },
        {
            id: '2',
            imageUri: 'https://via.placeholder.com/150',
            timestamp: Date.now() - 5000000,
            status: 'Analyzed',
            locationText: 'Market Road, Delhi',
            category: 'Overflowing Bin',
            points: 50
        }
    ]);
    const [points, setPoints] = useState(100);

    const [userLocation, setUserLocation] = useState(null);

    const login = (userData) => {
        setUser({ ...userData, level: 'Citizen' });
    };

    const logout = () => {
        setUser(null);
    };

    const addIssue = (issue) => {
        setIssues(prev => [issue, ...prev]);
        // Add points
        setPoints(prev => prev + (issue.points || 0));
    };

    return (
        <MockContext.Provider value={{
            user,
            issues,
            points,
            login,
            logout,
            addIssue,
            userLocation,
            setUserLocation
        }}>
            {children}
        </MockContext.Provider>
    );
};

export const useMockContext = () => useContext(MockContext);
