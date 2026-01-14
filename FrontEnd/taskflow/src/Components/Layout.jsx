import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ user, children }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-white to-brand-50">
            {/* Sidebar - Dynamic based on role */}
            <Sidebar role={user?.role} />

            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <Navbar user={user} />

                {/* Main Content Area */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
