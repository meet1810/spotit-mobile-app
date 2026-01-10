import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MockContext = createContext();

export const MockProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    // restore token/user/data on load
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                const tokenStr = await AsyncStorage.getItem('userToken');
                const pointsStr = await AsyncStorage.getItem('userPoints');
                const issuesJson = await AsyncStorage.getItem('userIssues');

                if (userJson) setUser(JSON.parse(userJson));
                if (tokenStr) setToken(tokenStr);
                if (pointsStr) setPoints(parseInt(pointsStr, 10));
                if (issuesJson) setIssues(JSON.parse(issuesJson));
            } catch (e) {
                console.log('Restoring data failed', e);
            }
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const login = async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            if (authToken) await AsyncStorage.setItem('userToken', authToken);
        } catch (e) {
            console.error('Login storage error', e);
        }
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userToken');
            // Optional: Clear points/issues on logout? Usually keep them or clear them. 
            // I will keep them for now or clear if user wants "clean" state.
            // But usually "logout" clears user data.
            // await AsyncStorage.removeItem('userPoints');
            // await AsyncStorage.removeItem('userIssues');
        } catch (e) {
            console.error('Logout storage error', e);
        }
    };

    const addIssue = async (issue) => {
        const newIssues = [issue, ...issues];
        const newPoints = points + (issue.points || 0);

        setIssues(newIssues);
        setPoints(newPoints);

        try {
            await AsyncStorage.setItem('userIssues', JSON.stringify(newIssues));
            await AsyncStorage.setItem('userPoints', newPoints.toString());
        } catch (e) {
            console.error('Save issue error', e);
        }
    };

    return (
        <MockContext.Provider value={{
            user,
            token,
            isLoading,
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
