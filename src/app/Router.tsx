import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Categories from '@/pages/Categories';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Categories />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;
