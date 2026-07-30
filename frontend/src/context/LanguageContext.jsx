import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [isNepali, setIsNepali] = useState(false);
    return (
        <LanguageContext.Provider value={{ isNepali, setIsNepali }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
