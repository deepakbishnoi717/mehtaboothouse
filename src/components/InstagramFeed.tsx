import React, { useState, useEffect } from "react";
import { 
  Instagram, Heart, MessageCircle, Grid, Play, Bookmark, AppWindow,
  Users, Check, ExternalLink, X, ChevronLeft, ChevronRight, Volume2, VolumeX, Flame
} from "lucide-react";
import { InstagramPost, InstagramStory } from "../types";

export default function InstagramFeed() {
  // Mock Stories
  const [stories, setStories] = useState<InstagramStory[]>([
    { id: "s1", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop", title: "Offers 🔥", viewed: false },
    { id: "s2", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop", title: "Sneakers", viewed: false },
    { id: "s3", imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop", title: "Oxfords 👞", viewed: false },
    { id: "s4", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop", title: "Ladies", viewed: false },
    { id: "s5", imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600&auto=format&fit=crop", title: "Kids Spec", viewed: false },
  ]);

  // Mock Posts
  const posts: InstagramPost[] = [
    {
      id: "p1",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
      caption: "Red Tape sneakers running at absolute clearance price! Was ₹7699, now grab yours at just ₹1199! Exclusive stock at Naya Bazar bookstore lane, Tohana. DM to check sizes! 👟🔥 #redtape #tohanashoes #mehtaboothouse",
      likes: 247,
      comments: 32,
      timestamp: "3 hours ago",
      tag: "Offers"
    },
    {
      id: "p2",
      imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
      caption: "Upgrade your casual footwear game. Classic burnished tan leather slippers designed for durability and ultimate comfort. Pair them with denim or kurtas. Buy any pair and get a premium carry-bag absolute free! 🛍️✨ #mehtaboothouse #tohana #casualwear",
      likes: 189,
      comments: 14,
      timestamp: "1 day ago",
      tag: "Casual"
    },
    {
      id: "p3",
      imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
      caption: "Autumn rugged leather boots have arrived! Heavy soles, comfort insulation, and custom water-repellent finish. Perfect for travel or styling. Tap 'Call Now' on our bio to book your size. 🍁🥾 #boots #leatherwear #mensfootwear",
      likes: 312,
      comments: 48,
      timestamp: "3 days ago",
      tag: "Sneakers"
    },
    {
      id: "p4",
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
      caption: "Ladies styling has never been more vibrant! Premium block heels and casual flat slides inside Tohana's favorite footwear collection. Buy 3 pairs and get a premium ladies custom shoulder bag absolutely free! 👠💃 #ladiesfashion #tohanaoffers",
      likes: 521,
      comments: 79,
      timestamp: "5 days ago",
      tag: "Ladies"
    },
    {
      id: "p5",
      imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
      caption: "Meticulous stitch patterns, premium Italian full-grain leather, and classic formals. Hand-made style Oxfords for gentlemen. Own the boardroom or shine at weddings. 🤵🤝 #formalwear #luxuryshoes #tohana",
      likes: 146,
      comments: 8,
      timestamp: "1 week ago",
      tag: "Oxfords"
    },
    {
      id: "p6",
      imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600&auto=format&fit=crop",
      caption: "Kids' active shoes designed for non-stop adventure! Lightweight soles, velcro straps, and colorful accents. Bring your little ones by our store in Naya Bazar for high-end fitting! 👦👧🎈 #kidsshoes #activewear #safeflex",
      likes: 98,
      comments: 11,
      timestamp: "1 week ago",
      tag: "Kids Spec"
    }
  ];

  // Feed controls
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts");
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);

  // Story handler ticks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStoryIdx !== null) {
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            // Next story
            if (activeStoryIdx < stories.length - 1) {
              setActiveStoryIdx(activeStoryIdx + 1);
              return 0;
            } else {
              // Close story view
              setActiveStoryIdx(null);
              return 0;
            }
          }
          return prev + 1.5; // speed rate of reading
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeStoryIdx]);

  const openStory = (idx: number) => {
    setActiveStoryIdx(idx);
    setStoryProgress(0);
    // Mark story as viewed
    setStories((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, viewed: true } : s))
    );
  };

  const closeStory = () => {
    setActiveStoryIdx(null);
  };

  const nextStory = () => {
    if (activeStoryIdx !== null && activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx(activeStoryIdx + 1);
      setStoryProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIdx !== null && activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
      setStoryProgress(0);
    }
  };

  return (
    <div id="instagram-feed" className="py-16 bg-black select-none border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Instagram Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-slate-900">
          
          {/* Circular logo replica */}
          <div className="relative shrink-0 group cursor-pointer" onClick={() => openStory(0)}>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 animate-gradient-xy flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black p-0.5 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop"
                  alt="@mehta_boot_house_tohana"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            {/* Pulsing ring indicator */}
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-black rounded-full flex items-center justify-center text-[10px] text-white">✓</span>
          </div>

          {/* Profile metadata */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 justify-center md:justify-start">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-1.5 font-mono">
                mehta_boot_house_tohana
                <span className="inline-block bg-blue-500 text-white rounded-full p-1 w-4 h-4 flex items-center justify-center text-[8px]" title="Verified local store">✓</span>
              </h1>
              
              <div className="flex gap-2">
                <a 
                  href="https://www.instagram.com/mehta_boot_house_tohana"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold text-xs px-5 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] shrink-0"
                >
                  <Instagram className="w-4 h-4" />
                  Follow Profile
                </a>
                <a 
                  href="https://wa.me/917876624340"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-700 hover:border-white text-slate-300 hover:text-white rounded-full text-xs font-semibold font-mono"
                >
                  DM Store
                </a>
              </div>
            </div>

            {/* Profile Statistics columns */}
            <div className="flex gap-6 text-sm mb-4 justify-center md:justify-start font-mono text-gray-300">
              <span><strong>146</strong> posts</span>
              <span><strong>4.1k</strong> followers</span>
              <span><strong>118</strong> following</span>
            </div>

            {/* Profile bio description */}
            <div className="text-xs md:text-sm text-gray-400 space-y-1">
              <p className="text-white font-bold text-sm">Mehta Boot House (Showroom)</p>
              <p className="text-amber-500 font-semibold text-xs font-mono">👟 Quality footwear is our signature style</p>
              <p>📍 Naya Bazar, Tohana - 125120, Haryana, India</p>
              <p>🛍️ Premium formal, casuals, sneakers & bags free collections!</p>
              <p className="flex items-center justify-center md:justify-start gap-1 text-sky-400 mt-2 hover:underline">
                <ExternalLink className="w-3.5 h-3.5" />
                <a href="https://www.instagram.com/mehta_boot_house_tohana" target="_blank" rel="noopener noreferrer">instagram.com/mehta_boot_house_tohana</a>
              </p>
            </div>
          </div>
        </div>

        {/* Stories list */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 mb-8 justify-start md:justify-center scrollbar-none scroll-smooth">
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => openStory(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none focus:scale-105 active:scale-95 transition-transform group"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 flex items-center justify-center ${
                story.viewed 
                  ? "border-2 border-slate-700" 
                  : "bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5"
              }`}>
                <div className="w-full h-full rounded-full bg-black p-0.5 flex items-center justify-center overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-xxs sm:text-xs text-gray-400 max-w-[70px] truncate leading-tight font-mono">
                {story.title}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-12 border-t border-slate-900 mb-8 pt-4">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1.5 pb-3 text-xs font-bold uppercase tracking-wider font-mono ${
              activeTab === "posts" 
                ? "border-t border-white text-white -mt-4 pt-4" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" />
            Posts
          </button>
          
          <button 
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-1.5 pb-3 text-xs font-bold uppercase tracking-wider font-mono ${
              activeTab === "reels" 
                ? "border-t border-white text-white -mt-4 pt-4" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Play className="w-4 h-4" />
            Reels
          </button>

          <button 
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-1.5 pb-3 text-xs font-bold uppercase tracking-wider font-mono ${
              activeTab === "saved" 
                ? "border-t border-white text-white -mt-4 pt-4" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </button>
        </div>

        {/* Tab content grids */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePost(post)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-slate-950 border border-slate-900 hover:border-amber-500/20"
              >
                <img
                  src={post.imageUrl}
                  alt={post.tag}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Overlay with info on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1.5 text-white font-extrabold text-sm font-mono">
                    <Heart className="w-5 h-5 fill-white text-white" />
                    {post.likes}
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-extrabold text-sm font-mono">
                    <MessageCircle className="w-5 h-5 fill-white text-white" />
                    {post.comments}
                  </div>
                </div>

                {/* Tag Badge */}
                <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-amber-500 border border-amber-500/10 text-[9px] font-mono px-2 py-0.5 rounded-full capitalize font-semibold shadow shadow-black">
                  #{post.tag.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reels" && (
          <div className="py-12 text-center text-gray-500">
            <Flame className="w-8 h-8 text-amber-500/30 mx-auto mb-3 animate-pulse" />
            <p className="text-xs font-mono">Reels view syncing with Meta Business Suite...</p>
            <a 
              href="https://www.instagram.com/mehta_boot_house_tohana" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline text-xs mt-2 inline-flex items-center gap-1"
            >
              Visit Instagram Reels <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {activeTab === "saved" && (
          <div className="py-12 text-center text-gray-500">
            <AppWindow className="w-8 h-8 text-amber-500/30 mx-auto mb-3" />
            <p className="text-xs font-mono">Save footwear catalog designs on your private login.</p>
          </div>
        )}
      </div>

      {/* Story Lightbox view */}
      {activeStoryIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-0 md:p-4 select-none">
          <div className="relative w-full h-full md:max-w-md md:h-[80vh] bg-slate-950 rounded-none md:rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-900">
            
            {/* Story loading progress bar */}
            <div className="absolute top-3 left-4 right-4 z-10 flex gap-1">
              {stories.map((s, idx) => {
                let widthPercent = 0;
                if (idx < activeStoryIdx) widthPercent = 100;
                if (idx === activeStoryIdx) widthPercent = storyProgress;
                return (
                  <div key={s.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Story Header */}
            <div className="absolute top-6 left-4 right-4 z-10 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop"
                    alt="@mehta_boot_house_tohana"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold leading-none block">mehta_boot_house_tohana</span>
                  <span className="text-[9px] text-gray-300 font-mono">Tohana Shopping Hub • Live</span>
                </div>
              </div>
              
              <button 
                onClick={closeStory}
                className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tap controls for previous/next overlaying the main image slide */}
            <div className="absolute inset-0 z-0 flex">
              <div onClick={prevStory} className="w-1/3 h-full cursor-pointer" />
              <div className="w-1/3 h-full cursor-auto" />
              <div onClick={nextStory} className="w-1/3 h-full cursor-pointer" />
            </div>

            {/* Main story slide graphic */}
            <div className="w-full h-full relative">
              <img
                src={stories[activeStoryIdx].imageUrl}
                alt={stories[activeStoryIdx].title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

              {/* Story text caption overlay */}
              <div className="absolute bottom-16 left-6 right-6 text-center text-white">
                <h3 className="text-2xl font-extrabold tracking-tight text-amber-400 font-mono drop-shadow-md">
                  {stories[activeStoryIdx].title}
                </h3>
                <p className="text-xs text-gray-200 mt-2 leading-relaxed max-w-sm mx-auto">
                  New collections loaded at Naya Bazar, Tohana. Direct orders open on WhatsApp. Check the details now!
                </p>
                
                <a
                  href="https://wa.me/917876624340"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wide rounded-full shadow-lg transition-transform inline-flex items-center gap-1.5 focus:scale-105 active:scale-95"
                >
                  Order on WhatsApp
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Left/Right manual sidebar arrows for desktop layout */}
            <button 
              onClick={prevStory}
              disabled={activeStoryIdx === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white transition-all disabled:opacity-0 focus:outline-none hidden md:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextStory}
              disabled={activeStoryIdx === stories.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white transition-all disabled:opacity-0 focus:outline-none hidden md:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
          </div>
        </div>
      )}

      {/* Post details Lightbox view */}
      {activePost && (
        <div 
          onClick={() => setActivePost(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 select-none"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl h-[90vh] md:h-auto max-h-[750px]"
          >
            {/* Left Image slide */}
            <div className="w-full md:w-1/2 bg-black relative flex items-center justify-center overflow-hidden">
              <img
                src={activePost.imageUrl}
                alt={activePost.tag}
                className="w-full h-full object-cover max-h-[400px] md:max-h-full"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Comment sidebar */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-slate-900 text-slate-300">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop"
                        alt="@mehta_boot_house_tohana"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block leading-none">mehta_boot_house_tohana</span>
                      <span className="text-[9px] text-gray-500 font-mono">Tohana, Haryana</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setActivePost(null)}
                    className="p-1 rounded-full text-slate-500 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption / Comments */}
                <div className="mt-4 overflow-y-auto max-h-[220px] pr-2 scrollbar-thin text-xs leading-relaxed space-y-4">
                  <div>
                    <span className="font-extrabold text-white mr-1.5 font-mono">mehta_boot_house_tohana</span>
                    <p className="inline text-gray-300 whitespace-pre-line">{activePost.caption}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/50">
                    <p className="text-[10px] text-amber-500 uppercase font-mono tracking-wider mb-2">Simulated Engagement Feedback</p>
                    <div className="space-y-2 text-xxs font-mono text-gray-400">
                      <p>💬 <strong className="text-slate-200">sandeep_tohana</strong>: Size 8 in red tape copy is available? Price is very reasonable.</p>
                      <p>💬 <strong className="text-slate-200">anil.mehta_owner</strong>: Yes Sandeep, size 8 in stock at Naya Bazar store! Please drop by or call us at 7876624340.</p>
                      <p>💬 <strong className="text-slate-200">shekhar_sharma</strong>: Bought loafers yesterday. High dynamic comfort, original styling. Perfect bag free too!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Interaction Footer */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-white mb-3">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs font-mono font-bold text-gray-300">{activePost.likes}</span>
                    </button>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs font-mono font-bold text-gray-300">{activePost.comments}</span>
                    </div>
                  </div>
                  <span className="text-xxs text-gray-500 font-mono font-bold uppercase">{activePost.timestamp}</span>
                </div>

                <a
                  href="https://wa.me/917876624340?text=Hello,%20I'm%20inquiring%20about%20the%20shoe%20on%20Instagram:%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-amber-500 text-black text-center text-xs font-mono font-extrabold uppercase rounded-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-1"
                >
                  Enquire Via Live WhatsApp
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
