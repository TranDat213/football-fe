import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Download, TrendingUp, ArrowUpRight, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OwnerAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">

        <main className="flex-1 px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Insights</h1>
              <p className="mt-1 text-sm text-gray-500">Track your business performance and growth metrics.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-gray-100 bg-white text-gray-600 h-10 px-4 text-xs font-bold uppercase tracking-wider">
                <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
              </Button>
              <Button variant="outline" className="rounded-xl border-emerald-100 bg-emerald-50 text-emerald-700 h-10 px-4 text-xs font-bold uppercase tracking-wider">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {/* Main Growth Chart Placeholder */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-bold text-gray-900">Revenue Growth</h3>
                        <p className="text-xs text-gray-500 mt-1">Daily revenue comparison for current period.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-700">$12,450.00</p>
                        <p className="flex items-center justify-end gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                            <TrendingUp className="h-3 w-3" /> +18.4%
                        </p>
                    </div>
                </div>
                
                {/* Visual Chart Placeholder */}
                <div className="h-64 w-full flex items-end gap-2 px-2">
                    {[40, 65, 45, 80, 55, 90, 75, 40, 60, 85, 30, 55, 70, 95, 60].map((h, i) => (
                        <div key={i} className="flex-1 bg-emerald-600/10 rounded-t-lg relative group transition-all hover:bg-emerald-600/30">
                            <div 
                                className="absolute bottom-0 left-0 right-0 bg-emerald-600 rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-emerald-500" 
                                style={{ height: `${h}%` }} 
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                ${h * 10}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 border-t border-gray-50 pt-4 flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>June 01</span>
                    <span>June 15</span>
                    <span>June 30</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-gray-900">Pitch Occupancy</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'San Siro Premium', value: 88, color: 'emerald' },
                            { name: 'Old Trafford Mini', value: 65, color: 'indigo' },
                            { name: 'Main Stadium', value: 42, color: 'amber' }
                        ].map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-gray-500">{item.name}</span>
                                    <span className="text-gray-900">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-${item.color}-500 rounded-full`} 
                                        style={{ width: `${item.value}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <PieChartIcon className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-gray-900">Traffic Source</h3>
                    </div>
                    <div className="flex items-center justify-center h-48 relative">
                        <div className="h-32 w-32 rounded-full border-[16px] border-emerald-600 border-r-indigo-500 border-b-amber-400 rotate-45" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Direct</p>
                            <p className="text-lg font-bold text-gray-900">65%</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Direct</p>
                            <p className="text-sm font-bold text-emerald-600">65%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Social</p>
                            <p className="text-sm font-bold text-indigo-600">25%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Others</p>
                            <p className="text-sm font-bold text-amber-600">10%</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
