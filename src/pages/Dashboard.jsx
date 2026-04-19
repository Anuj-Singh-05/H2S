import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { LayoutDashboard, AlertCircle, Sparkles, Check, X, Clock, HelpCircle } from 'lucide-react';
import { runGeminiMatch } from '../services/gemini';

const URGENCY_STYLES = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  critical: 'bg-red-50 text-red-700 border-red-200'
};

const AddNeedModal = ({ isOpen, onClose }) => {
  const { addNeed } = useStore();
  const [formData, setFormData] = useState({ title: '', description: '', skills: '', urgency: 'low', location: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addNeed({
      ...formData,
      skills_required: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setFormData({ title: '', description: '', skills: '', urgency: 'low', location: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle size={20} className="text-primary-600" />
            Declare Community Need
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., Medical Supplies Needed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" rows="3" placeholder="Describe the need..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
            <input type="text" required value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., Medical, Rescue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select value={formData.urgency} onChange={e => setFormData({ ...formData, urgency: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Zone</label>
              <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g., North Zone" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-md">Post Need</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose }) => {
  const [key, setKey] = useState(localStorage.getItem('gemini_api_key') || '');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4 font-sans text-gray-900">Settings</h3>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gemini API Key</label>
        <input type="password" value={key} onChange={e => {setKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value);}} className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4" placeholder="AIZA..." />
        <p className="text-xs text-gray-500 mb-4">You need an active Gemini API Key for the AI matching to work.</p>
        <button onClick={onClose} className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium">Save & Close</button>
      </div>
    </div>
  );
}

const MatchModal = ({ need, isOpen, onClose }) => {
  const { volunteers, confirmMatch } = useStore();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState('');

  // Start matching process when modal opens
  React.useEffect(() => {
    if (isOpen && need && !matches) {
      const apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
         setError("Please set your Gemini API Key in the settings first.");
         return;
      }
      setLoading(true);
      setError('');
      const availableVols = volunteers.filter(v => v.is_available);
      runGeminiMatch(need, availableVols, apiKey)
        .then(res => setMatches(res))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, need]);

  if (!isOpen || !need) return null;

  const handleConfirm = (volunteerId) => {
    confirmMatch(Date.now().toString(), need.id); // For prototype, ignoring matchId uniqueness
    // Ideally we would add to matches store, but this updates the need status
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-500" />
            AI Matching Results
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6 bg-primary-50 border border-primary-100 p-4 rounded-xl">
            <h4 className="font-semibold text-primary-900">{need.title}</h4>
            <div className="flex gap-2 mt-2">
               {need.skills_required.map(s => <span key={s} className="bg-white/60 text-xs px-2 py-1 rounded text-primary-700 font-medium border border-primary-200">{s}</span>)}
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Sparkles size={40} className="text-primary-500 animate-pulse" />
              <p className="text-gray-500 font-medium">Gemini is analyzing volunteers and finding the best match...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex flex-col items-center justify-center py-8">
               <AlertCircle size={32} className="mb-2" />
               <p className="font-medium text-center">{error}</p>
            </div>
          )}

          {!loading && matches && (
            <div className="space-y-4 animate-slide-up">
              {matches.map((match, idx) => {
                 const v = volunteers.find(v => v.id === match.volunteer_id);
                 if (!v) return null;
                 return (
                  <div key={match.volunteer_id} className={`border rounded-xl p-4 transition-all relative overflow-hidden ${idx === 0 ? 'bg-gradient-to-br from-yellow-50/50 to-orange-50/50 border-yellow-200 shadow-md' : 'bg-white border-gray-200'}`}>
                    {idx === 0 && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">Top Match</div>}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{v.name}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">{v.zone} • {v.availability}</p>
                        
                        <div className="mt-3 bg-white/60 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 italic border-l-4 border-l-primary-500 font-serif">
                          "{match.reason}"
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                         <div className="flex items-center gap-1 font-bold text-xl text-primary-600">
                           {match.score}<span className="text-sm text-gray-400 font-normal">/10</span>
                         </div>
                         <button onClick={() => handleConfirm(v.id)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm whitespace-nowrap">
                           Confirm Match
                         </button>
                      </div>
                    </div>
                  </div>
                 )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { needs, volunteers, matches } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [matchNeed, setMatchNeed] = useState(null);

  const openNeeds = needs.filter(n => n.status === 'open');
  const fulfilledNeeds = needs.filter(n => n.status === 'fulfilled').length;
  const thisWeekMatches = matches.length;

  return (
    <div className="space-y-8">
      {/* Settings Gear - top absolute */}
      <button onClick={() => setIsSettingsOpen(true)} className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-xl border border-gray-200 text-gray-600 hover:text-primary-600 z-50">
        <Sparkles size={24} />
      </button>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
           <div className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2"><LayoutDashboard size={16}/> Open Needs</div>
           <div className="text-3xl font-bold text-gray-900">{openNeeds.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
           <div className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2"><Check size={16}/> Active Volunteers</div>
           <div className="text-3xl font-bold text-gray-900">{volunteers.length}</div>
        </div>
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl shadow-md border border-primary-500 flex flex-col justify-center text-white">
           <div className="text-primary-100 text-sm font-medium mb-1 flex items-center gap-2"><Sparkles size={16}/> AI Matches Made</div>
           <div className="text-3xl font-bold">{thisWeekMatches}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Needs Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Needs Board</h2>
            <button onClick={() => setIsAddOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium shadow shadow-gray-900/20 hover:bg-gray-800 transition-colors">
              + Post Need
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {needs.map(need => (
              <div key={need.id} className="relative bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 group hover:shadow-md transition-shadow">
                <div className={`absolute top-0 right-5 transform -translate-y-1/2 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${URGENCY_STYLES[need.urgency]}`}>
                  {need.urgency}
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 leading-tight pr-4">{need.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{need.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {need.skills_required.map(s => <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">{s}</span>)}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                   <div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> Just now</div>
                   
                   {need.status === 'open' ? (
                     <button onClick={() => setMatchNeed(need)} className="flex items-center gap-1.5 text-sm font-semibold bg-primary-50 text- प्राथमिक600 text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
                       <Sparkles size={16} /> Find AI Match
                     </button>
                   ) : need.status === 'matched' ? (
                     <span className="text-sm font-semibold text-green-600 flex items-center gap-1 border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg"><Check size={16}/> Matched</span>
                   ) : (
                     <span className="text-sm font-semibold text-gray-500">Fulfilled</span>
                   )}
                </div>
              </div>
            ))}
            {needs.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No active needs right now.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2"><HelpCircle size={20} className="text-gray-400"/> How it works</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2"><span className="font-bold text-primary-600">1.</span> Post a critical community need.</li>
              <li className="flex gap-2"><span className="font-bold text-primary-600">2.</span> Our AI engine scans all active volunteer profiles.</li>
              <li className="flex gap-2"><span className="font-bold text-primary-600">3.</span> It correlates skills, location, and urgency in seconds.</li>
              <li className="flex gap-2"><span className="font-bold text-primary-600">4.</span> Review the match reason and dispatch help.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <AddNeedModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <MatchModal need={matchNeed} isOpen={!!matchNeed} onClose={() => setMatchNeed(null)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
