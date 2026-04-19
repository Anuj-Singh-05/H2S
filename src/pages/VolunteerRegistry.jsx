import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Users, UserPlus, MapPin, CheckCircle, XCircle } from 'lucide-react';

const AddVolunteerModal = ({ isOpen, onClose }) => {
  const { addVolunteer } = useStore();
  const [formData, setFormData] = useState({ name: '', skills: '', availability: '', zone: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    addVolunteer({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      is_available: true
    });
    setFormData({ name: '', skills: '', availability: '', zone: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserPlus size={20} className="text-primary-600" />
            Register Volunteer
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="e.g., Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label>
            <input type="text" required value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="e.g., Medical, Driving, Logistics" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <input type="text" required value={formData.availability} onChange={e => setFormData({ ...formData, availability: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="e.g., Weekends" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operating Zone</label>
              <input type="text" required value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" placeholder="e.g., North Zone" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all">Add Volunteer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function VolunteerRegistry() {
  const { volunteers } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={28} className="text-primary-600" />
            Volunteer Registry
          </h1>
          <p className="text-gray-500 mt-1">Manage and view all registered volunteers and their skill sets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary-600/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
          <UserPlus size={20} />
          Add Volunteer
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-sm tracking-wide text-gray-500 uppercase">
                <th className="px-6 py-4 font-medium">Volunteer</th>
                <th className="px-6 py-4 font-medium">Skills</th>
                <th className="px-6 py-4 font-medium">Zone & Availability</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volunteers.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{v.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {v.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 list-none">
                      {v.skills.map(skill => (
                        <span key={skill} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-medium border border-blue-100/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <MapPin size={14} className="mr-1.5 text-gray-400" />
                      {v.zone}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded-sm">
                      {v.availability}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {v.is_available ? (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                         Available
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                         Busy
                       </span>
                    )}
                  </td>
                </tr>
              ))}
              {volunteers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No volunteers registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddVolunteerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
