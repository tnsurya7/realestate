import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import { motion } from 'framer-motion';

const PublicLayout: React.FC = () => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <motion.main
            className="flex-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Outlet />
        </motion.main>
        <Footer />
        <FloatingButtons />
    </div>
);

export default PublicLayout;
