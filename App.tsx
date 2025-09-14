import React, { useState, useEffect } from 'react';
import { ReminderFormModal } from './components/AddReminderForm';
import { Header } from './components/Header';
import { ReminderList } from './components/ReminderList';
import { useReminders } from './hooks/useReminders';
import { useNotifications } from './hooks/useNotifications';
import { BellIcon, PlusIcon, UserIcon, PencilIcon } from './components/icons';
import type { Reminder } from './types';

const App: React.FC = () => {
  const { 
    profiles, addProfile, updateProfileName, deleteProfile,
    addReminder, updateReminder, deleteReminder 
  } = useReminders();
  const { permission, requestPermission } = useNotifications(profiles);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeProfileId && profiles.length > 0) {
      setActiveProfileId(profiles[0].id);
    }
    if (profiles.length === 0) {
      setActiveProfileId(null);
    }
  }, [profiles, activeProfileId]);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const handleOpenAddModal = () => {
    setReminderToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reminder: Reminder) => {
    setReminderToEdit(reminder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReminderToEdit(null);
  };

  const handleSaveReminder = (data: Omit<Reminder, 'id'> | Reminder) => {
    if (!activeProfileId) return;
    if ('id' in data) {
      updateReminder(activeProfileId, data);
    } else {
      addReminder(activeProfileId, data);
    }
    handleCloseModal();
  };

  const handleDeleteReminder = (reminderId: string) => {
    if (!activeProfileId) return;
    deleteReminder(activeProfileId, reminderId);
  }

  const handleAddProfile = () => {
    const name = prompt("Enter the new person's name:");
    if (name) {
      const newProfile = addProfile(name);
      setActiveProfileId(newProfile.id);
    }
  };

  const handleEditProfileName = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    const newName = prompt("Enter the new name:", profile.name);
    if (newName && newName !== profile.name) {
      updateProfileName(profileId, newName);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        {permission !== 'granted' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6" role="alert">
            <div className="flex items-center">
              <BellIcon className="h-6 w-6 mr-3" />
              <div>
                <p className="font-bold">Enable Notifications</p>
                <p className="text-sm">To get reminders, please allow notifications.</p>
                 <button
                  onClick={requestPermission}
                  className="mt-2 bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-yellow-600 transition-colors text-sm"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Manager */}
        <div className="mb-6">
            <div className="flex items-center border-b border-slate-200">
                {profiles.map(profile => (
                    <button key={profile.id} onClick={() => setActiveProfileId(profile.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeProfileId === profile.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                    >
                        <UserIcon className="h-5 w-5" />
                        <span>{profile.name}</span>
                        {activeProfileId === profile.id && (
                           <PencilIcon onClick={(e) => { e.stopPropagation(); handleEditProfileName(profile.id); }} className="h-4 w-4 text-slate-400 hover:text-blue-600" />
                        )}
                    </button>
                ))}
                 <button onClick={handleAddProfile} className="ml-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-blue-600 rounded-md transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Person</span>
                </button>
            </div>
        </div>


        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-700">
            {activeProfile ? `${activeProfile.name}'s Reminders` : 'Reminders'}
          </h2>
          {activeProfile && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Reminder</span>
            </button>
          )}
        </div>

        <ReminderList 
          reminders={activeProfile?.reminders || []} 
          onDeleteReminder={handleDeleteReminder}
          onEditReminder={handleOpenEditModal}
        />
      </main>
      
      {isModalOpen && (
        <ReminderFormModal
          onClose={handleCloseModal}
          onSave={handleSaveReminder}
          reminderToEdit={reminderToEdit}
        />
      )}
    </div>
  );
};

export default App;
