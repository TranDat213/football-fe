'use client';

import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  MapPin,
  Clock
} from 'lucide-react';

interface PostCardProps {
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  matchInfo?: {
    location: string;
    time: string;
  };
}

export default function PostCard({
  author,
  content,
  image,
  likes,
  comments,
  time,
  matchInfo,
}: PostCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-4">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={author.avatar} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">{author.name}</h4>
              <p className="text-[11px] text-gray-500">{author.role} • {time}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-900 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{content}</p>

        {/* Match Info Badge (Optional) */}
        {matchInfo && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    <MapPin className="h-3.5 w-3.5" /> {matchInfo.location}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 border-l border-emerald-200 pl-4">
                    <Clock className="h-3.5 w-3.5" /> {matchInfo.time}
                </div>
            </div>
        )}

        {/* Image */}
        {image && (
          <div className="mb-4 overflow-hidden rounded-xl bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Post content" className="w-full object-cover max-h-96" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors group">
            <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
            {likes}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors group">
            <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
            {comments}
          </button>
          <button className="ml-auto flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors group">
            <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
