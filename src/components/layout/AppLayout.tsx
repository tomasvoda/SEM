import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export function AppLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex font-sans selection:bg-brand-500 selection:text-white">
            <Sidebar isCollapsed={isCollapsed} toggle={() => setIsCollapsed(!isCollapsed)} />
            <div className={cn("flex flex-col flex-1 min-h-screen relative w-full transition-all duration-300", isCollapsed ? "md:pl-20" : "md:pl-48")}>
                <TopBar />
                <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto w-full animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
