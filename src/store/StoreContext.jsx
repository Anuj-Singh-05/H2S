import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const DUMMY_NEEDS = [
  { id: 'n1', title: 'Medical Supplies for Relief Camp', description: 'Need basic first aid, bandages, and immediate care staff for the downstream flood relief camp.', skills_required: ['Medical', 'First Aid'], urgency: 'critical', location: 'North Zone', status: 'open', created_at: Date.now() },
  { id: 'n2', title: 'Food Distribution Coordination', description: 'Need organizers to pack and distribute 500 meal packets.', skills_required: ['Logistics', 'Physical Work'], urgency: 'medium', location: 'East Zone', status: 'open', created_at: Date.now() - 100000 },
  { id: 'n3', title: 'Data Entry for Displaced Families', description: 'Log family details into the central database for government compensation.', skills_required: ['Data Entry', 'Computer Skills'], urgency: 'low', location: 'Central Zone', status: 'open', created_at: Date.now() - 200000 },
  { id: 'n4', title: 'Rescue Boat Operator', description: 'Need experienced personnel to help navigate flooded streets.', skills_required: ['Navigation', 'Rescue'], urgency: 'critical', location: 'North Zone', status: 'matched', created_at: Date.now() - 500000 },
  { id: 'n5', title: 'Translation Services - Regional', description: 'Translate safety instruction broadcasts into local dialects.', skills_required: ['Translation', 'Communication'], urgency: 'medium', location: 'Remote', status: 'fulfilled', created_at: Date.now() - 800000 },
];

const DUMMY_VOLUNTEERS = [
  { id: 'v1', name: 'Dr. Priya Sharma', skills: ['Medical', 'First Aid', 'Triage'], availability: 'Weekends', zone: 'North Zone', is_available: true },
  { id: 'v2', name: 'Rahul Desai', skills: ['Logistics', 'Driving', 'Physical Work'], availability: 'Evenings', zone: 'East Zone', is_available: true },
  { id: 'v3', name: 'Amina Khan', skills: ['Data Entry', 'Translation', 'Communication'], availability: 'Flexible', zone: 'Central Zone', is_available: true },
  { id: 'v4', name: 'Commander Singh (Retd.)', skills: ['Rescue', 'Navigation', 'Logistics'], availability: 'Anytime', zone: 'North Zone', is_available: false },
  { id: 'v5', name: 'Anita Patel', skills: ['Counseling', 'Communication'], availability: 'Weekdays', zone: 'South Zone', is_available: true },
  { id: 'v6', name: 'James Wilson', skills: ['First Aid', 'Cooking'], availability: 'Weekends', zone: 'East Zone', is_available: true },
  { id: 'v7', name: 'Sarah Lee', skills: ['Data Entry', 'Computer Skills', 'Writing'], availability: 'Remote', zone: 'Remote', is_available: true },
  { id: 'v8', name: 'David Kim', skills: ['Construction', 'Physical Work'], availability: 'Weekends', zone: 'West Zone', is_available: true },
];

const DUMMY_MATCHES = [
  { id: 'm1', need_id: 'n4', volunteer_id: 'v4', ai_justification: 'Commander Singh possesses critical Rescue and Navigation skills required for boat operation, and is located in the North Zone where the alert was raised.', confirmed: true, created_at: Date.now() - 400000 }
];

export const StoreProvider = ({ children }) => {
  const [needs, setNeeds] = useState(() => {
    const saved = localStorage.getItem('vm_needs');
    return saved ? JSON.parse(saved) : DUMMY_NEEDS;
  });

  const [volunteers, setVolunteers] = useState(() => {
    const saved = localStorage.getItem('vm_volunteers');
    return saved ? JSON.parse(saved) : DUMMY_VOLUNTEERS;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('vm_matches');
    return saved ? JSON.parse(saved) : DUMMY_MATCHES;
  });

  useEffect(() => { localStorage.setItem('vm_needs', JSON.stringify(needs)); }, [needs]);
  useEffect(() => { localStorage.setItem('vm_volunteers', JSON.stringify(volunteers)); }, [volunteers]);
  useEffect(() => { localStorage.setItem('vm_matches', JSON.stringify(matches)); }, [matches]);

  const addNeed = (need) => {
    setNeeds(prev => [{ ...need, id: 'n' + Date.now(), created_at: Date.now(), status: 'open' }, ...prev]);
  };

  const updateNeedStatus = (needId, status) => {
    setNeeds(prev => prev.map(n => n.id === needId ? { ...n, status } : n));
  };

  const addVolunteer = (volunteer) => {
    setVolunteers(prev => [{ ...volunteer, id: 'v' + Date.now() }, ...prev]);
  };

  const addMatch = (match) => {
    setMatches(prev => [{ ...match, id: 'm' + Date.now(), created_at: Date.now(), confirmed: false }, ...prev]);
  };

  const confirmMatch = (matchId, needId) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, confirmed: true } : m));
    updateNeedStatus(needId, 'matched');
  };

  return (
    <StoreContext.Provider value={{
      needs, addNeed, updateNeedStatus,
      volunteers, addVolunteer,
      matches, addMatch, confirmMatch
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
