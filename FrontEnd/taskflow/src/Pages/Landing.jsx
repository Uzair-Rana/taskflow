import { useNavigate } from 'react-router-dom';
import { Layout, LogIn } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-brand-900 to-accent-900 flex flex-col items-center justify-center p-6">
            <div className="max-w-3xl text-center text-white">
                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 ring-1 ring-white/20 p-3 rounded-2xl backdrop-blur">
                        <Layout className="text-white w-10 h-10" />
                    </div>
                </div>
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
                    Manage your workspace <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-200 to-accent-200">smarter.</span>
                </h1>
                <p className="text-xl text-brand-200 mb-10">
                    The all-in-one platform for multi-tenant project management and team collaboration.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-[1.02] transition shadow-hover"
                    >
                        <LogIn size={20} /> Login to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
