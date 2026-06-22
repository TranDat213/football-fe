import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PENDING_REVIEWS = [
  { id: 1, name: 'San Siro Premium', owner: 'David Beckham', date: 'June 21, 2026', status: 'Pending' },
  { id: 2, name: 'Old Trafford Mini', owner: 'Sarah Wilson', date: 'June 22, 2026', status: 'Pending' },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 border-b-4 border-indigo-600 inline-block pb-1">Admin Control</h1>
                <p className="mt-2 text-sm text-gray-500 font-medium">System status and platform governance overview.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-white border border-gray-100 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest leading-none">System Live</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
                { label: 'Total Users', value: '1,240', icon: Users, color: 'indigo' },
                { label: 'Active Pitches', value: '85', icon: MapPin, color: 'emerald' },
                { label: 'Daily Bookings', value: '312', icon: Activity, color: 'blue' },
                { label: 'Growth', value: '+24%', icon: TrendingUp, color: 'orange' },
            ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className={`h-10 w-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4`}>
                        <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="mt-1 text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Pending Approvals */}
            <div className="lg:col-span-8 space-y-6">
                <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                            <ShieldCheck className="h-5 w-5 text-indigo-600" /> Pending Pitch Approvals
                        </h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg italic">
                            Strict checking required
                        </span>
                    </div>

                    <div className="space-y-4">
                        {PENDING_REVIEWS.map((pitch) => (
                            <div key={pitch.id} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gray-100" />
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{pitch.name}</h4>
                                        <p className="text-[11px] text-gray-500 font-medium">Owner: {pitch.owner} • {pitch.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                    <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                        <XCircle className="h-4 w-4" />
                                    </button>
                                    <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="rounded-3xl bg-indigo-900 p-8 text-white flex items-center justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 h-full w-1/3 bg-indigo-800 skew-x-12 -mr-12" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-black uppercase tracking-tight">Security Audit</h3>
                        <p className="mt-2 text-sm text-indigo-100/70 max-w-md italic font-medium leading-relaxed">No critical vulnerabilities detected. Last scan completed 15 minutes ago. All platform systems are operating at optimal security levels.</p>
                    </div>
                    <Button className="relative z-10 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 h-11 px-8 text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-900/50">
                        View Logs
                    </Button>
                </div>
            </div>

            {/* Support / Quick Admin Links */}
            <div className="lg:col-span-4 space-y-8">
                <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Manage Permissions', icon: ShieldCheck, color: 'indigo' },
                            { label: 'Global Notifications', icon: AlertCircle, color: 'blue' },
                            { label: 'Platform Settings', icon: Activity, color: 'emerald' },
                        ].map((action) => (
                            <button key={action.label} className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest text-gray-700">
                                <div className="flex items-center gap-3">
                                    <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                                    {action.label}
                                </div>
                                <ArrowRight className="h-3 w-3 text-gray-300" />
                            </button>
                        ))}
                    </div>
                </section>

                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center border-dashed">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                        <AlertCircle className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Need Help?</h4>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-6">System administrative support is available 24/7 for critical platform issues.</p>
                    <Link href="#" className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
                        Contact Core Support
                    </Link>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
