import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/features/community/components/PostCard';
import MatchmakingCard from '@/features/community/components/MatchmakingCard';
import { Button } from '@/components/ui/button';
import { Plus, Flame, Users, Calendar, Search } from 'lucide-react';

const MOCK_POSTS = [
  {
    author: { name: 'David Beckham', avatar: 'https://i.pravatar.cc/150?u=david', role: 'Premium Member' },
    content: "Great match today at San Siro! The turf was incredible. Looking for a goalkeeper for next Tuesday's 7v7 match. Anyone interested?",
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    likes: 24,
    comments: 8,
    time: '2 hours ago',
    matchInfo: { location: 'San Siro Premium', time: 'Tue, 19:30' }
  },
  {
      author: { name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'Active User' },
      content: 'Just finished my 50th booking on PitchPro! Highly recommend the loyalty program. Does anyone know if Court B has new lights yet?',
      likes: 15,
      comments: 3,
      time: '5 hours ago'
  }
];

const RECRUITMENTS = [
    { title: 'Friendly 5v5 - Need 2 Players', type: 'Matchmaking', location: 'District 1 Arena', time: 'Tonight, 20:00', needed: 2, joined: 8, skillLevel: 'Intermediate' },
    { title: 'Corporate Friendly 7v7', type: 'Corporate', location: 'Stadium One', time: 'Sat, 14:00', needed: 5, joined: 9, skillLevel: 'Any' },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Feed Sidebar (Left/Desktop) */}
          <div className="hidden lg:col-span-3 lg:block space-y-4">
            <div className="rounded-2xl bg-white border border-gray-100 p-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm">
                    <Flame className="h-4 w-4" /> Trending Feed
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 font-medium text-sm transition-colors">
                    <Users className="h-4 w-4" /> My Groups
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 font-medium text-sm transition-colors">
                    <Calendar className="h-4 w-4" /> Events
                </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Recommended for you</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100" />
                        <div>
                            <p className="text-xs font-bold text-gray-900">District 1 Strikers</p>
                            <p className="text-[10px] text-gray-500">1.2k members</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-gray-100" />
                         <div>
                             <p className="text-xs font-bold text-gray-900">Goalkeeper Union</p>
                             <p className="text-[10px] text-gray-500">450 members</p>
                         </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Main Feed (Center) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gray-100" />
                    <div className="flex-1">
                        <input 
                            type="text" 
                            placeholder="Share a thought or find players..." 
                            className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                            <Plus className="h-5 w-5" />
                        </button>
                        <span className="text-xs text-gray-400 font-medium">Add photo, video, or location</span>
                    </div>
                    <Button className="rounded-xl bg-emerald-700 h-9 px-6 text-xs font-bold uppercase tracking-widest">
                        Post
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {MOCK_POSTS.map((post, idx) => (
                    <PostCard key={idx} {...post} />
                ))}
            </div>
          </div>

          {/* Matchmaking Sidebar (Right) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search matches..." 
                    className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
            </div>

            <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 px-1">Active Recruitments</h2>
                {RECRUITMENTS.map((rec, idx) => (
                    <MatchmakingCard key={idx} {...rec} />
                ))}
                <Button variant="ghost" className="w-full h-10 rounded-xl text-xs font-bold uppercase tracking-widest text-emerald-700 hover:bg-emerald-50">
                    See All Activities
                </Button>
            </section>

            <div className="rounded-2xl bg-gray-900 p-6 text-white text-center">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Host a match</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">Can't find a team? Create your own match and find players in minutes.</p>
                <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 h-10 text-[11px] font-bold uppercase tracking-widest">
                    Create Recruitment
                </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
