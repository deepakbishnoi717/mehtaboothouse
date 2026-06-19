import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, MapPin, Clock, User, Sparkles, ChevronRight, ChevronLeft, 
  Menu, X, Moon, Sun, Flame, ShieldCheck, ExternalLink, ShoppingBag, 
  Smartphone, Instagram, Facebook, BadgePercent, CheckCircle, HelpCircle
} from "lucide-react";

import MehtaLogo from "./components/MehtaLogo";
import ThreeDCarousel from "./components/ThreeDCarousel";
import EnquiryForm from "./components/EnquiryForm";
import InstagramFeed from "./components/InstagramFeed";
import AdminPanel from "./components/AdminPanel";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { ShoeCategory, SpecialOffer } from "./types";

// Seed local footwear categories with premium Unsplash source assets
const SHOE_CATEGORIES: ShoeCategory[] = [
  {
    id: "cat_casual",
    name: "Casual Shoes",
    slug: "casual-shoes",
    description: "Premium slip-on loafers, driving shoes & relaxed moccasins.",
    imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
    count: "45",
    badge: "1+1 BAG FREE"
  },
  {
    id: "cat_formal",
    name: "Formal Shoes",
    slug: "formal-shoes",
    description: "Elegant full-grain leather Oxfords, Derby dress style & brogues.",
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
    count: "38",
    badge: "PREMIUM"
  },
  {
    id: "cat_sports",
    name: "Sports Shoes",
    slug: "sports-shoes",
    description: "Highly cushioned running trainers, active wear & jogging spikes.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    count: "50",
    badge: "SPARX SPECIAL"
  },
  {
    id: "cat_sneaker",
    name: "Sneakers",
    slug: "sneakers",
    description: "Retro lifestyle sneakers, modern high-top vulcanized fits & colors.",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    count: "65",
    badge: "TRENDING"
  },
  {
    id: "cat_boots",
    name: "Boots",
    slug: "boots",
    description: "Rugged leather outdoor boots, smart Chelsea ankle-high variants.",
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
    count: "24",
    badge: "NEW ARRIVAL"
  },
  {
    id: "cat_slippers",
    name: "Slippers",
    slug: "slippers-sleepers",
    description: "Plush leather sliders, soft daily flip-flops & orthotic house sleepers.",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop",
    count: "40",
    badge: "₹199 START"
  },
  {
    id: "cat_ladies",
    name: "Ladies Footwear",
    slug: "ladies-footwear",
    description: "Premium block heels, ethnic flat sandals, daily slides & pumps.",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
    count: "55",
    badge: "BAG FREE ON 3"
  },
  {
    id: "cat_kids",
    name: "Kids Footwear",
    slug: "kids-footwear",
    description: "Comfort action shoes, lightweight velcro straps & school wear.",
    imageUrl: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600&auto=format&fit=crop",
    count: "30",
    badge: "COZY FITS"
  }
];

// Special offers dataset
const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: "off1",
    title: "Shoes + Free Premium Bag",
    priceTag: "₹1,299 Only",
    details: "Choose any category sneakers, slip-ons or casual sneakers and take a matching high-quality canvas carry-bag completely free! Limited Monsoon launch.",
    offerPrice: "1299",
    badge: "MOST POPULAR",
    saving: "You Save ₹800"
  },
  {
    id: "off2",
    title: "Most Demanding Shoe + Free Bag",
    priceTag: "₹1,499 Flat",
    details: "Premium heavy-sole sneakers and robust boots plus custom travel organizer rucksack completely free on checkout. Double reinforced quality.",
    offerPrice: "1499",
    badge: "BEST VALUE",
    saving: "Save ₹1000"
  },
  {
    id: "off3",
    title: "Red Tape Shoes Clearance Deal",
    priceTag: "₹1,199 Only",
    details: "Red Tape formal Oxfords & running sneakers at clearance prices! Flat discount on real retail tag worth ₹7,699. 100% original Tohana showroom items.",
    originalPrice: "7699",
    offerPrice: "1199",
    badge: "85% OFF TAG",
    saving: "Saves ₹6500"
  },
  {
    id: "off4",
    title: "Ladies Slippers Sparkle Bargain",
    priceTag: "₹199 / Buy 3 Get Bag Free",
    details: "Vibrant ethnic sandals, daily sleepers, and block slides at ₹199 each. Buy any 3 pairs and claim a premium accessory makeup pouch completely free!",
    offerPrice: "199",
    badge: "FESTIVE SALE",
    saving: "B3G1 Offer"
  }
];

function MainAppLayout() {
  const { theme, toggleTheme } = useTheme();

  // Selected default shoe category that automatically sets form field on tap
  const [selectedCategoryName, setSelectedCategoryName] = useState("Casual Shoes");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeOfferIdx, setActiveOfferIdx] = useState(0);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Auto-rotating announcements indices
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const announcements = [
    "🎉 EXCLUSIVE MONSOON FESTIVAL: Grab ₹1299 category Shoes and claim a Premium Carry-Bag FREE! 🛍️",
    "💥 MASSIVE CLEARANCE: Original Red Tape Shoes @ ₹1199 (Original Tag worth ₹7699) inside Tohana Naya Bazar! 👟",
    "💃 LADIES SPECIAL: Buy any 3 pairs of Slippers starting at ₹199 and get a Free Designer Handbag! 👛"
  ];

  // Ref to smooth-scroll directly to Quick Enquiry Desk
  const enquiryDeskRef = useRef<HTMLDivElement | null>(null);

  // Slower rotate announcements
  useEffect(() => {
    const annInterval = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4500);

    // Auto rotate offer deck cards every 5.5 seconds
    const offerInterval = setInterval(() => {
      setActiveOfferIdx((prev) => (prev + 1) % SPECIAL_OFFERS.length);
    }, 5500);

    return () => {
      clearInterval(annInterval);
      clearInterval(offerInterval);
    };
  }, []);

  const handleScrollToEnquiry = (shoeCategorySlug = "") => {
    if (shoeCategorySlug) {
      const found = SHOE_CATEGORIES.find((cat) => cat.slug === shoeCategorySlug);
      if (found) {
        setSelectedCategoryName(found.name);
      }
    }
    
    setTimeout(() => {
      enquiryDeskRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const handleCategorySelect = (category: ShoeCategory) => {
    setSelectedCategoryName(category.name);
    handleScrollToEnquiry();
  };

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden ${
      theme === "dark" 
        ? "bg-black text-slate-100" 
        : "bg-slate-50 text-slate-900 transition-colors duration-300"
    }`}>
      
      {/* 1. TOP INTERACTIVE ANNOUNCEMENT HEADER BANNER */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 py-2.5 px-4 text-center select-none shadow-md border-b border-red-700 relative z-45">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <BadgePercent className="w-4.5 h-4.5 text-yellow-300 animate-bounce shrink-0" />
          <p className="text-xxs sm:text-xs font-bold font-mono tracking-wide text-white truncate transition-all duration-300">
            {announcements[announcementIdx]}
          </p>
        </div>
      </div>

      {/* 2. STICKY GLASSY NAVIGATION BAR */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-300 border-b ${
        theme === "dark" 
          ? "bg-black/85 border-slate-900/85 shadow-lg shadow-black/30" 
          : "bg-white/85 border-slate-200/80 shadow-md shadow-slate-100/10"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* Logo linkage with beautiful vector */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group focus:outline-none">
            <MehtaLogo 
              size={56} 
              withCircle={theme === "light"} 
              dark={theme === "dark"} 
              className="drop-shadow-[0_0_8px_rgba(245,158,11,0.15)] group-hover:scale-105" 
            />
            <div className="text-left font-sans select-none block">
              <span className="text-sm sm:text-lg font-black tracking-widest text-[#ff6b00] dark:text-amber-400 block -mb-1 leading-none uppercase">
                Mehta
              </span>
              <span className={`text-[10px] sm:text-xs font-extrabold tracking-widest leading-none ${
                theme === "dark" ? "text-white" : "text-slate-800"
              }`}>
                BOOT HOUSE
              </span>
            </div>
          </a>

          {/* Core Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8 font-mono text-xs font-bold tracking-widest uppercase">
            <a href="#" className="text-amber-500 hover:text-[#ff6b00] transition-colors">Home</a>
            <a href="#rotating-showcase" className="hover:text-amber-500 transition-colors">Showcase</a>
            <a href="#products" className="hover:text-amber-500 transition-colors">Products</a>
            <a href="#offers" className="hover:text-amber-500 transition-colors">Offers</a>
            <a href="#about" className="hover:text-amber-500 transition-colors">About Us</a>
            <a href="#contact" className="hover:text-amber-500 transition-colors">Enquiry</a>
          </nav>

          {/* Control widgets: Light/Dark Mode Toggle & WhatsApp CTA */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Mode Selector Accessibility Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all ${
                theme === "dark" 
                  ? "bg-slate-900/40 border-slate-800 text-amber-400 hover:text-white" 
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
              title={theme === "dark" ? "Switch to Comfort Light Mode" : "Switch to Premium Black Mode"}
              aria-label="Toggle Theme Mode"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 animate-spin-slow" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick WhatsApp Call Header */}
            <a
              href="https://wa.me/917876624340"
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold font-mono px-5 py-2.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
            >
              <Smartphone className="w-3.5 h-3.5" />
              WhatsApp Store
            </a>
          </div>

          {/* Smartphone hamburger menu toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all sm:hidden ${
                theme === "dark" ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border focus:outline-none transition-all ${
                theme === "dark" 
                  ? "bg-slate-900 border-slate-800 text-white hover:border-amber-500" 
                  : "bg-slate-100 border-slate-200 text-slate-850 hover:border-slate-400"
              }`}
              title="Open Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Sliding Smartphone navigation drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t py-6 px-6 space-y-4 select-none ${
            theme === "dark" ? "bg-black border-slate-900 text-white" : "bg-white border-slate-200"
          }`}>
            <nav className="flex flex-col gap-4 font-mono text-xs font-bold tracking-widest uppercase">
              <a 
                href="#" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-500"
              >
                Home
              </a>
              <a 
                href="#rotating-showcase" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-500"
              >
                Showcase
              </a>
              <a 
                href="#products" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-500"
              >
                Products
              </a>
              <a 
                href="#offers" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-500"
              >
                Offers
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-500"
              >
                About Us
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-amber-500"
              >
                Enquiry Desk
              </a>
            </nav>

            <div className="pt-4 border-t border-slate-800/20 flex flex-col gap-3">
              <a
                href="https://wa.me/917876624340"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-emerald-500 text-white font-bold font-mono text-xs py-3 rounded-xl uppercase tracking-wider"
              >
                <Smartphone className="w-4 h-4" />
                WhatsApp Live
              </a>
              
              <a
                href="tel:7876624340"
                className="flex items-center justify-center gap-1 bg-slate-900 text-amber-500 border border-slate-800 font-bold font-mono text-xs py-3 rounded-xl uppercase tracking-wider"
              >
                <Phone className="w-4 h-4" />
                Call Manager
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO VIEWPORT CONTAINER WITH COMPACT ROTATING COMPONENT IN BACKGROUND */}
      <section className="relative min-h-[90vh] md:min-h-screen py-10 md:py-16 px-4 flex items-center justify-center bg-[#000000] select-none overflow-hidden border-b border-white/5">
        
        {/* Absolute Glowing background accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-[#ff6b00]/5 rounded-full select-none pointer-events-none animate-spin-slow duration-[45s]" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full mt-4">
          
          {/* Hero details column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center space-x-2 px-3 py-1 bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-full animate-pulse mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-[#ff6b00]"></span>
              <span className="text-[#ff6b00] text-[10px] md:text-xs font-bold uppercase tracking-widest font-mono">Tohana's #1 Footwear Choice</span>
            </div>

            <h1 className="hero-text font-black italic text-white uppercase tracking-tighter leading-none">
              MEHTA<br />
              <span className="text-[#ff6b00]">BOOT</span><br />
              HOUSE
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              Elevate your footwear aesthetics. Offering Tohana's finest inventory of running trainers, hand-burnished formal Oxfords, and original Red Tape specials at unbeatable rates.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 justify-center lg:justify-start mt-8">
              <div className="border-l-2 border-[#ff6b00] pl-4 text-left">
                <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">Location</div>
                <div className="text-sm text-white font-medium">Naya Bazar, Tohana, Haryana</div>
              </div>
              <div className="border-l-2 border-[#ff6b00] pl-4 text-left">
                <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">Timing</div>
                <div className="text-sm text-gray-300">Opens Daily: 10:00 AM - 9:00 PM</div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <a
                href="tel:7876624340"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#ff6b00] text-white font-extrabold uppercase tracking-widest text-xs md:text-sm rounded-sm transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Call Store Now
              </a>

              <a
                href="https://wa.me/917876624340?text=Hello%20Mehta%20Boot%20House!%20I%20am%20visiting%20your%2520website%20and%20want%2520to%20enquire%20about%20footwear%20sizes%20&%20offers."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white text-white hover:bg-white hover:text-black font-extrabold uppercase tracking-widest text-xs md:text-sm rounded-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-550" />
                WhatsApp Enquiry
              </a>
            </div>

            <div className="pt-2 flex items-center gap-6 justify-center lg:justify-start text-xxs font-mono text-gray-500">
              <span className="flex items-center gap-1">✓ Prime Location</span>
              <span className="flex items-center gap-1">✓ Expert Fitting</span>
              <span className="flex items-center gap-1">✓ Parking Available</span>
            </div>
          </div>

          {/* Hero Circular revolving mock shoe graphics WITH DESIGN CARDS */}
          <div className="lg:col-span-5 flex items-center justify-center relative min-h-[380px] sm:min-h-[460px] md:min-h-[500px] py-6 sm:py-10">
            <div className="circle-carousel flex items-center justify-center">
              
              {/* Card 1: Top Center */}
              <div 
                onClick={() => {
                  setSelectedCategoryName("Sports Shoes");
                  handleScrollToEnquiry("sports-shoes");
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shoe-card p-3 sm:p-4 w-36 sm:w-40 text-center cursor-pointer select-none z-10"
              >
                <div className="text-[10px] text-[#ff6b00] font-mono font-bold tracking-wider">REDTAPE SPECIAL</div>
                <div className="text-base sm:text-lg font-black text-white">₹1,199</div>
                <div className="text-[9px] line-through text-gray-500 uppercase tracking-widest font-mono">MRP ₹7699</div>
              </div>

              {/* Card 2: Mid Right */}
              <div 
                onClick={() => {
                  setSelectedCategoryName("Casual Shoes");
                  handleScrollToEnquiry("casual-shoes");
                }}
                className="absolute top-1/4 right-0 translate-x-[35%] sm:translate-x-1/2 shoe-card p-3 sm:p-4 w-40 sm:w-44 text-center border-[#ff6b00] gold-glow cursor-pointer select-none z-10"
              >
                <div className="text-[10px] font-mono font-bold text-white tracking-widest bg-[#ff6b00] px-1.5 py-0.5 rounded-full inline-block mb-1">BEST SELLER</div>
                <div className="text-[11px] text-gray-300">Shoes + Free Bag</div>
                <div className="text-lg sm:text-xl font-black text-[#ffd700]">₹1,299</div>
              </div>

              {/* Card 3: Bottom Right */}
              <div 
                onClick={() => {
                  setSelectedCategoryName("Ladies Handbags / Footwear");
                  handleScrollToEnquiry("ladies-footwear");
                }}
                className="absolute bottom-1/4 right-0 translate-x-[35%] sm:translate-x-1/2 shoe-card p-3 sm:p-4 w-36 sm:w-40 text-center cursor-pointer select-none z-10"
              >
                <div className="text-[10px] text-gray-400 font-mono">Ladies Slipper</div>
                <div className="text-xs sm:text-sm font-black text-white mt-1">Buy 3 Get Bag</div>
                <div className="text-[9px] text-[#ff6b00] font-semibold mt-1">FESTIVE PROMO</div>
              </div>

              {/* Card 4: Bottom Center */}
              <div 
                onClick={() => {
                  setSelectedCategoryName("Sports Shoes");
                  handleScrollToEnquiry("sports-shoes");
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shoe-card p-3 sm:p-4 w-36 sm:w-40 text-center bg-white text-black hover:bg-gray-100 border-white cursor-pointer select-none z-10"
              >
                <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#ff6b00]">NEW ARRIVAL</div>
                <div className="text-xs sm:text-sm font-black">Sports Series</div>
              </div>

              {/* Card 5: Mid Left */}
              <div 
                onClick={() => {
                  setSelectedCategoryName("Sneakers");
                  handleScrollToEnquiry("sneakers");
                }}
                className="absolute top-1/2 left-0 -translate-x-[35%] sm:-translate-x-1/2 -translate-y-1/2 shoe-card p-3 sm:p-4 w-40 sm:w-44 text-center cursor-pointer select-none z-10"
              >
                <div className="text-[10px] text-[#ff6b00] font-bold font-mono uppercase tracking-widest">COMBO OFFER</div>
                <div className="text-[11px] text-gray-400">Most Demanding</div>
                <div className="text-base sm:text-lg font-black text-white mt-1">₹1,499</div>
              </div>

              {/* Central Core Circle with vector logo inside replacing placeholder emoji */}
              <div className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] bg-gradient-to-b from-zinc-900 to-[#050505] rounded-full border border-white/10 flex flex-col items-center justify-center text-center p-3 sm:p-5 shadow-2xl shadow-black">
                <MehtaLogo size={Math.min(130, 130)} withCircle={false} dark={true} className="shrink-0 mb-1" />
                <div className="text-[9px] tracking-widest text-[#ff6b00] font-mono scale-90 sm:scale-100 uppercase">Mehta Footwear</div>
                <div className="text-[10px] font-black text-white hover:text-[#ff6b00] transition-colors scale-90 sm:scale-100 cursor-pointer uppercase tracking-wider" onClick={() => handleScrollToEnquiry()}>
                  DISCOVER NOW
                </div>
              </div>

            </div>
            {/* Glowing subtle radial light behind carousel */}
            <div className="absolute w-[340px] h-[340px] bg-amber-500/5 blur-3xl rounded-full pointer-events-none select-none" />
          </div>

        </div>
      </section>

      {/* 4. THREE D HORIZONTAL REVOLVING STAGE SECTION */}
      <ThreeDCarousel 
        categories={SHOE_CATEGORIES} 
        onSelectCategory={handleCategorySelect} 
      />

      {/* 5. GRID BASE CATEGORIES SHOWCASE SECTION */}
      <section id="products" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-16 select-none">
          <span className="text-amber-500 font-mono text-xs tracking-widest uppercase block mb-2">
            Categories Directory
          </span>
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-4 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            Explore Footwear Vault
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Each Category represents curated lines sourced directly from manufacturers. Tap any block card to lock selected type and compose immediate price inquiries on the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          {SHOE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className={`p-1.5 rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:gold-glow-strong ${
                theme === "dark" 
                  ? "bg-[#111111] border-white/10" 
                  : "bg-white border-slate-200 shadow shadow-slate-100"
              }`}
            >
              {/* Product graphic display */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Hot Tag */}
                {cat.badge && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-[#ff6b00] text-white text-[9px] font-bold font-mono px-2.5 py-1 rounded-sm uppercase tracking-wider shadow">
                    {cat.badge}
                  </span>
                )}

                {/* Cover filter */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-85" />
              </div>

              {/* Body stats */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className={`text-base md:text-lg font-extrabold group-hover:text-gold transition-colors ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono text-gold font-extrabold bg-[#ff6b00]/10 px-2 py-0.5 rounded">
                    {cat.count} Variants
                  </span>
                </div>
                
                <p className="text-gray-400 text-xs font-light line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold font-mono text-[#ff6b00]">
                  <span>🔒 Safe Fit Guarantee</span>
                  <span className="flex items-center gap-1 text-slate-400 hover:text-gold transition-all font-bold">
                    Select & Enquire
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CURRENT AUTO-ROTATING SPECIAL BARGAIN DECK SECTION */}
      <section id="offers" className="py-20 px-4 bg-[#000000] select-none border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-[#ff6b00] font-mono text-xs tracking-widest uppercase block mb-2">
              ★ LIMITED TIMEFRAME DISCOUNTS ★
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic uppercase">
              Bargains Of The Week
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-xs md:text-sm font-light">
              Mehta Boot House brings original premium brands at wholesale stock values inside Tohana. Select, call, or reserve yours immediately before stock finishes.
            </p>
          </div>

          {/* Interactive Offer Cards Auto-deck */}
          <div className="max-w-2xl mx-auto relative h-[250px] sm:h-[220px]">
            {SPECIAL_OFFERS.map((offer, idx) => {
              const isActive = idx === activeOfferIdx;
              
              return (
                <div
                  key={offer.id}
                  onClick={() => {
                    setSelectedCategoryName("Casual Shoes");
                    handleScrollToEnquiry();
                  }}
                  className={`absolute inset-0 p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all duration-700 ease-in-out cursor-pointer group select-none border ${
                    theme === "dark" 
                      ? "bg-[#111111] border-white/10" 
                      : "bg-white border-slate-200"
                  } ${
                    isActive 
                      ? "opacity-100 scale-100 z-20 shadow-[0_0_35px_rgba(255,107,0,0.3)] border-[#ff6b00]!" 
                      : "opacity-0 scale-95 -z-10 border-transparent!"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold font-mono bg-[#ff6b00] text-white px-2.5 py-0.5 rounded-sm uppercase tracking-wider mb-2 inline-block">
                        {offer.badge}
                      </span>
                      <h3 className="text-white text-lg sm:text-xl font-extrabold group-hover:text-gold transition-colors">
                        {offer.title}
                      </h3>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="block text-2xl sm:text-3xl font-black text-[#ff6b00] font-mono">
                        {offer.priceTag}
                      </span>
                      {offer.originalPrice && (
                        <span className="text-xs line-through text-gray-500 block font-mono">
                          M.R.P. ₹{offer.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed max-w-xl font-light">
                    {offer.details}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">{offer.saving || "Claim Offer Now"}</span>
                    <span className="text-gray-500 flex items-center gap-0.5 font-bold group-hover:text-white">
                      Click to Secure this Package
                      <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Offer Carousel small dots bar indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {SPECIAL_OFFERS.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setActiveOfferIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === activeOfferIdx 
                    ? "bg-amber-500 w-8" 
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 7. IN      {/* 8. DETAILED ABOUT INFORMATION TILES SECTION */}
      <section id="about" className={`py-20 px-4 border-t border-b select-none ${
        theme === "dark" ? "bg-[#000000] border-white/5" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-[#ff6b00] font-mono text-xs tracking-widest uppercase block mb-2 font-bold">
              Corporate Dossier
            </span>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight italic uppercase ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Tohana's Heritage Store
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xs md:text-sm mt-3 font-light leading-relaxed">
              Serving premium comfort footwear to thousands of residential families, wedding clients and sportswear athletes since day one. Built on trust, quality fitting, and highly personalized service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tile 1: Leadership */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:border-[#ff6b00]/30 hover:shadow-[0_10px_30px_rgba(255,107,0,0.1)] ${
              theme === "dark" ? "bg-[#111111] border-white/10" : "bg-white border-slate-200"
            }`}>
              <div className="w-10 h-10 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] mb-4">
                <User className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-extrabold mb-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Showroom Owner
              </h3>
              <p className="text-xs text-gold font-bold font-mono uppercase mb-4 tracking-wider">
                Founder: Anil Mehta
              </p>
              <p className="text-gray-400 text-xs leading-relaxed font-light">
                Under the expert management of Anil Mehta, the boutique shop focuses on personalized shoe fits and sourcing high-quality leather selections across dynamic Indian manufacturing channels.
              </p>
            </div>

            {/* Tile 2: Prime Location */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:border-[#ff6b00]/30 hover:shadow-[0_10px_30px_rgba(255,107,0,0.1)] ${
              theme === "dark" ? "bg-[#111111] border-white/10" : "bg-white border-slate-200"
            }`}>
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-extrabold mb-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Naya Bazar Location
              </h3>
              <p className="text-xs text-red-400 font-bold font-mono uppercase mb-4 tracking-wider">
                Tohana Core Commercial Lane
              </p>
              <p className="text-gray-400 text-xs leading-relaxed font-light">
                Positioned inside Tohana's historic Naya Bazar zone, adjacent to bookstore lanes for quick access. Full pedestrian-safe path, premium customer parking, and expert showroom staff.
              </p>
            </div>

            {/* Tile 3: Key Features */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:border-[#ff6b00]/30 hover:shadow-[0_10px_30px_rgba(255,107,0,0.1)] ${
              theme === "dark" ? "bg-[#111111] border-white/10" : "bg-white border-slate-200"
            }`}>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-extrabold mb-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Brand Integrity
              </h3>
              <p className="text-xs text-emerald-400 font-bold font-mono uppercase mb-4 tracking-wider">
                100% Genuine Inventory
              </p>
              <p className="text-gray-400 text-xs leading-relaxed font-light">
                All catalog display stocks are direct OEM original items. Includes genuine boxes, tags, tax-receipt support, and robust replacement options for complete peace of mind.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 9. INTUITION ENQUIRY FORM AREA */}
      <section id="contact" ref={enquiryDeskRef} className="py-20 px-4 scroll-mt-24 select-none bg-[#000000]">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-[#ff6b00] font-mono text-xs tracking-widest uppercase block mb-2 font-bold">
              Interactive Digital Desk
            </span>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tight italic uppercase ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Reserve Your Pair Today
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm mt-3 font-light leading-relaxed">
              Fill in your specifications or required sizes. The enquiry will be stored and dispatched immediately to our sales manager's phone for responsive booking.
            </p>
          </div>

          {/* Form Intake Component */}
          <EnquiryForm selectedDefaultType={selectedCategoryName} />

        </div>
      </section>

      {/* 10. STAFF/OWNER LOGS MANAGEMENT AREA WITH PIN */}
      <section className={`py-16 px-4 border-t ${
        theme === "dark" ? "bg-[#050505] border-white/5" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-4xl mx-auto">
          
          {!showAdminPortal ? (
            <div className="text-center">
              <button
                onClick={() => setShowAdminPortal(true)}
                className="text-xs font-mono text-gray-500 hover:text-[#ff6b00] transition-colors uppercase tracking-widest flex items-center gap-1.5 mx-auto py-2 px-4 rounded-sm bg-black border border-white/10 hover:border-[#ff6b00]/30"
              >
                <ShieldCheck className="w-4 h-4" />
                Staff Administration & Office portal Login
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAdminPortal(false)}
                  className="text-xxs font-mono text-gray-500 hover:text-rose-450 uppercase tracking-wider flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Close Manager Portal
                </button>
              </div>
              <AdminPanel />
            </div>
          )}

        </div>
      </section>

      {/* 11. FOOTER SECTION */}
      <footer className={`py-12 px-4 select-none border-t ${
        theme === "dark" ? "bg-[#000000] border-white/5 text-slate-400" : "bg-slate-900 border-slate-850 text-slate-300"
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1: Brand details repeated */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <MehtaLogo size={42} withCircle={false} dark={true} className="shrink-0" />
              <div className="text-left font-sans block">
                <span className="text-sm font-black tracking-widest text-[#ff6b00] block uppercase leading-none">
                  Mehta
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-white leading-none block">
                  BOOT HOUSE
                </span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm">
              Mehta Boot House is Tohana's trusted shop for casual collections, jogging runners, and wedding formal designs. Find us at Naya Bazar bookstore lane.
            </p>

            <p className="text-xxs text-gray-500 leading-relaxed font-mono">
              Designed with offline-first client persistence, full access controls & automated n8n webhook routing channels.
            </p>
          </div>

          {/* Col 2: Useful fast links */}
          <div className="md:col-span-3 space-y-4 font-mono text-xs">
            <h4 className="text-white font-extrabold tracking-wider uppercase">Quick Navigations</h4>
            <div className="flex flex-col gap-2.5 text-gray-400">
              <a href="#" className="hover:text-[#ff6b00]">Back To Top</a>
              <a href="#rotating-showcase" className="hover:text-[#ff6b00]">3D Category Orbit</a>
              <a href="#products" className="hover:text-[#ff6b00]">Products Grid</a>
              <a href="#offers" className="hover:text-[#ff6b00]">Special Package Deals</a>
              <a href="#about" className="hover:text-[#ff6b00]">About Showroom</a>
            </div>
          </div>

          {/* Col 3: Direct repeatable connections */}
          <div className="md:col-span-4 space-y-4 text-xs">
            <h4 className="text-white font-mono font-extrabold tracking-wider uppercase">Contact Channels</h4>
            <p className="text-gray-400">📍 Naya Bazar (Bookstore Lane Road), Tohana - 125120, Haryana, India</p>
            <p>📞 Phone desk: <a href="tel:7876624340" className="text-white hover:text-gold font-mono font-bold">78766 24340</a></p>
            <p>💬 WhatsApp: <a href="https://wa.me/917876624340" className="text-white hover:text-gold font-mono font-bold">78766 24340</a></p>
            
            <div className="flex gap-3 pt-2">
              <a 
                href="https://www.instagram.com/mehta_boot_house_tohana" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-[#111111] border border-white/10 hover:bg-[#ff6b00] hover:border-[#ff6b00] rounded-sm text-white transition-all hover:scale-105 active:scale-95"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/anil.mehta.800725" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-[#111111] border border-white/10 hover:bg-[#ff6b00] hover:border-[#ff6b00] rounded-sm text-white transition-all hover:scale-105 active:scale-95"
                title="Follow on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xxs font-mono text-gray-500">
          <p>© 2026 Mehta Boot House. All rights reserved. Registered Tohana, Haryana, India.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-gold font-bold">n8n Automation Systems</span>
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppLayout />
    </ThemeProvider>
  );
}
