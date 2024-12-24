import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MainSideNavbar = () => {
  const [activePanel, setActivePanel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const panels = ['Settings1', 'Settings2', 'Settings3'];
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderPanel = (panel) => (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="panel bg-white p-4 rounded-r-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{panel}</h3>
        <button onClick={() => setActivePanel(null)} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {['Name', 'Email', 'Phone'].map((field) => (
          <div key={field} className="input-group">
            <label htmlFor={`${panel}-${field.toLowerCase()}`} className="block text-sm font-medium text-gray-700 mb-1">
              {field}:
            </label>
            <input
              type={field === 'Email' ? 'email' : 'text'}
              id={`${panel}-${field.toLowerCase()}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
          Submit
        </button>
      </form>
    </motion.div>
  );

  return (
    <div
    style={{ marginTop: '80px' }}
      ref={navRef}
      className={`main-side-navbar fixed top-0 left-0 h-screen bg-gray-100 shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => !activePanel && setIsOpen(false)}
    >
      <div className="buttons flex flex-col h-full">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              {panels.map((panel) => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(activePanel === panel ? null : panel)}
                  className={`w-full text-left py-2 px-4 mb-2 rounded-md transition-colors ${
                    activePanel === panel
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {panel}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>{activePanel && renderPanel(activePanel)}</AnimatePresence>
    </div>
  );
};

export default MainSideNavbar;