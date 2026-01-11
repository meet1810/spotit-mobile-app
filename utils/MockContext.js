import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReports } from './api';
import { NATIVE_PUBLIC_URL } from '../constants/Config';

const MockContext = createContext();

export const MockProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [issues, setIssues] = useState([]); // Manage Global Issues
    const [points, setPoints] = useState(0);
    const [userLocation, setUserLocation] = useState(null);

    // restore token/user/data on load
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                const tokenStr = await AsyncStorage.getItem('userToken');
                const pointsStr = await AsyncStorage.getItem('userPoints');
                // const issuesJson = await AsyncStorage.getItem('userIssues'); // Deprecated: We fetch valid list from API

                if (userJson) setUser(JSON.parse(userJson));
                if (tokenStr) setToken(tokenStr);
                if (pointsStr) setPoints(parseInt(pointsStr, 10));

                // Fetch issues if logged in
                if (tokenStr) {
                    await refreshIssues();
                }

            } catch (e) {
                console.log('Restoring data failed', e);
            }
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const refreshIssues = async () => {
        try {
            const response = await getReports();
            if (response.reports) {
                const mappedIssues = response.reports.map(report => ({
                    id: report.id.toString(),
                    imageUri: report.imagePath ? `${NATIVE_PUBLIC_URL}/${report.imagePath}` : 'https://via.placeholder.com/150',
                    timestamp: new Date(report.createdAt).getTime(),
                    status: report.status || 'Pending',
                    locationText: report.aiResponse?.description || `Lat: ${report.latitude.toFixed(4)}, Long: ${report.longitude.toFixed(4)}`,
                    category: report.aiResponse?.issue_type || 'Unidentified',
                    points: report.points || 0
                }));
                // Show newest first
                setIssues(mappedIssues.reverse());
            }
        } catch (error) {
            console.log('Error refreshing issues:', error);
        }
    };

    const login = async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);

        if (userData?.points !== undefined) {
            setPoints(userData.points);
            try {
                await AsyncStorage.setItem('userPoints', userData.points.toString());
            } catch (e) {
                console.log('Error saving points', e);
            }
        }

        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            if (authToken) await AsyncStorage.setItem('userToken', authToken);
            // Refresh issues on login
            await refreshIssues();
        } catch (e) {
            console.log('Login storage error', e);
        }
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        setIssues([]);
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userToken');
        } catch (e) {
            console.log('Logout storage error', e);
        }
    };

    const addIssue = async (issue) => {
        // Optimistic Update
        const newIssues = [issue, ...issues];
        const newPoints = points + (issue.points || 0);

        setIssues(newIssues);
        setPoints(newPoints);

        try {
            // await AsyncStorage.setItem('userIssues', JSON.stringify(newIssues)); 
            await AsyncStorage.setItem('userPoints', newPoints.toString());
        } catch (e) {
            console.log('Save issue error', e);
        }
    };

    const updatePoints = async (newPoints) => {
        setPoints(newPoints);
        try {
            await AsyncStorage.setItem('userPoints', newPoints.toString());
            // Also update user object
            if (user) {
                const updatedUser = { ...user, points: newPoints };
                setUser(updatedUser);
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (e) {
            console.log('Error updating points', e);
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
            refreshIssues,
            updatePoints,
            userLocation,
            setUserLocation
        }}>
            {children}
        </MockContext.Provider>
    );
};

export const useMockContext = () => useContext(MockContext);
