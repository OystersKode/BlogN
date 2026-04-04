'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { submitFeedback } from '@/app/actions/feedback';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Star, Loader2, Zap, Layout, Monitor, Smartphone, MessageSquare, CheckCircle2 } from 'lucide-react';

const FeedbackPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [ratings, setRatings] = useState({
        speed: 0,
        editor: 0,
        upload: 0,
        mobile: 0,
    });
    const [comment, setComment] = useState("");

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (Object.values(ratings).some(v => v === 0)) {
            alert("Please provide ratings for all performance categories.");
            return;
        }

        setLoading(true);
        try {
            await submitFeedback({ ratings, comment });
            setSubmitted(true);
            setTimeout(() => router.push("/"), 3000);
        } catch (error) {
            console.error(error);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const RatingStars = ({ category, label, icon: Icon }: { category: keyof typeof ratings; label: string, icon: any }) => (
        <div className="bg-white dark:bg-zinc-800 p-6 border-[3px] border-black dark:border-white shadow-neo group hover:-rotate-1 transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-[2px] border-black/10 dark:border-white/10">
                <div className="w-10 h-10 bg-primary border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black">
                    <Icon size={20} strokeWidth={3} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">{label}</span>
            </div>
            <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRatings(prev => ({ ...prev, [category]: star }))}
                        className={`flex-1 aspect-square flex items-center justify-center border-2 border-black transition-all ${ratings[category] >= star ? 'bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5' : 'bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                    >
                        <Star size={18} fill={ratings[category] >= star ? 'black' : 'none'} color={ratings[category] >= star ? 'black' : 'currentColor'} strokeWidth={3} />
                    </button>
                ))}
            </div>
        </div>
    );

    if (submitted) {
        return (
            <div className="min-h-screen bg-primary transition-colors flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div className="max-w-xl w-full bg-white dark:bg-zinc-900 border-[5px] border-black dark:border-white shadow-neo-xl p-12 sm:p-20 relative overflow-hidden">
                        <div className="w-24 h-24 bg-secondary border-[4px] border-black shadow-neo flex items-center justify-center mx-auto mb-10 rotate-12">
                            <CheckCircle2 size={48} strokeWidth={3} className="text-black" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-black dark:text-white uppercase leading-[0.9] tracking-tighter mb-8 italic">THANK YOU.</h2>
                        <p className="text-lg font-bold text-black dark:text-zinc-300 uppercase leading-snug tracking-tight mb-10 max-w-sm mx-auto">
                            Technical report archived. Your performance metrics will be analyzed immediately.
                        </p>
                        <div className="inline-block py-2 px-6 bg-black text-white text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                           REDIRECTING TO CENTRAL FEED...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-5xl mx-auto py-16 px-4 sm:px-6 w-full space-y-12">
                <div className="text-start relative mb-20">
                    <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4 w-20 h-20 bg-accent -z-10 border-[3px] border-black"></div>
                    <h1 className="text-5xl sm:text-7xl font-black text-black dark:text-white tracking-tighter uppercase leading-[0.85] mb-6">PERFORMANCE REPORT.</h1>
                    <p className="text-xl font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight max-w-2xl">
                        Documenting bottlenecks. Optimizing the academic grid. Share your metrics.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12 pb-24">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 bg-black text-white p-4 w-fit border-[3px] border-black shadow-neo-sm -rotate-1">
                            <Zap size={24} fill="white" className="text-white" />
                            <h2 className="text-sm font-black uppercase tracking-widest">Core Technical Metrics</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <RatingStars category="speed" label="Loading Latency" icon={Zap} />
                            <RatingStars category="editor" label="Input Response" icon={Monitor} />
                            <RatingStars category="upload" label="Data Throughput" icon={Layout} />
                            <RatingStars category="mobile" label="Mobile Runtime" icon={Smartphone} />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 bg-secondary text-black p-4 w-fit border-[3px] border-black shadow-neo-sm rotate-1">
                            <MessageSquare size={24} className="text-black" strokeWidth={3} />
                            <h2 className="text-sm font-black uppercase tracking-widest text-black">Analytical Comments</h2>
                        </div>
                        
                        <div className="bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white shadow-neo p-8 group">
                            <textarea
                                className="w-full min-h-[160px] bg-transparent outline-none resize-none transition-all text-xl font-bold text-black dark:text-white placeholder:text-zinc-200 dark:placeholder:text-zinc-700 uppercase tracking-tight leading-tight"
                                placeholder="IDENTIFY SPECIFIC BOTTLENECKS OR ANOMALIES..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-black border-[4px] border-black shadow-neo-lg px-12 h-20 text-xl font-black uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-neo transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-4"
                        >
                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                <>
                                  <Zap size={24} fill="black" />
                                  SUBMIT ANALYTICS
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default FeedbackPage;
