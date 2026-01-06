import { useNavigate } from 'react-router-dom';
import { Layout, Building2, LogIn } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-3xl text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-2xl">
                        <Layout className="text-white w-10 h-10" />
                    </div>
                </div>
                <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                    Manage your workspace <span className="text-blue-600">smarter.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10">
                    The all-in-one platform for multi-tenant project management and team collaboration.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                    >
                        <LogIn size={20} /> Login to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="flex items-center justify-center gap-2 bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold hover:border-blue-600 transition"
                    >
                        <Building2 size={20} /> Register Organization
                    </button>
                </div>
            </div>
        </div>
    );
}