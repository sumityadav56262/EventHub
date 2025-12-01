import { useState } from 'react';
import UpcomingEvents from './UpcomingEvents';
import ClubList from './ClubList';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('events');

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex gap-2 px-6">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-6 py-4 font-semibold transition-all relative ${activeTab === 'events'
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Upcoming Events
                        {activeTab === 'events' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('clubs')}
                        className={`px-6 py-4 font-semibold transition-all relative ${activeTab === 'clubs'
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Clubs
                        {activeTab === 'clubs' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'events' ? <UpcomingEvents /> : <ClubList />}
            </div>
        </div>
    );
};

export default StudentDashboard;
