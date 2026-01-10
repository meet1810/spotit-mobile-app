import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, LANGUAGES } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const storedLang = await AsyncStorage.getItem('userLanguage');
            if (storedLang) {
                setLanguage(storedLang);
            }
        } catch (error) {
            console.error('Failed to load language', error);
        }
    };

    const changeLanguage = async (langCode) => {
        try {
            setLanguage(langCode);
            await AsyncStorage.setItem('userLanguage', langCode);
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    // Translation function
    const t = (key) => {
        return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
