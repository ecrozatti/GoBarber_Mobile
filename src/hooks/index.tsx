import React from 'react';

import { AuthProvider } from './auth';

// Como se fosse um Provider Global
const AppProvider: React.FC = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
