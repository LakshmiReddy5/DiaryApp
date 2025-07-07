import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Calendar from './components/Calendar';
import DiaryEntry from './components/DiaryEntry';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaryEntry, setDiaryEntry] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentView('calendar');
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('calendar');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('home');
    setSelectedDate(null);
    setDiaryEntry(null);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/diary/${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const entry = await response.json();
        setDiaryEntry(entry);
      } else {
        setDiaryEntry(null);
      }
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      setDiaryEntry(null);
    }
    
    setCurrentView('diary');
  };

  const handleSaveDiary = async (entryData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(entryData)
      });

      if (response.ok) {
        const savedEntry = await response.json();
        setDiaryEntry(savedEntry);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving diary entry:', error);
      return false;
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'calendar':
        return <Calendar onDateSelect={handleDateSelect} user={user} />;
      case 'diary':
        return (
          <DiaryEntry
            date={selectedDate}
            entry={diaryEntry}
            onSave={handleSaveDiary}
            onBack={() => setCurrentView('calendar')}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navbar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;