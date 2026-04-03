'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { submitFeedback } from '@/app/actions/feedback';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Loader2, Zap, Layout, Monitor, Smartphone, MessageSquare } from 'lucide-react';

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
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon size={18} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRatings(prev => ({ ...prev, [category]: star }))}
                        className={`p-1.5 rounded-md transition-all ${ratings[category] >= star ? 'text-yellow-400 scale-110' : 'text-gray-200 dark:text-gray-800 hover:text-yellow-200'} active:scale-95`}
                    >
                        <Star size={24} fill={ratings[category] >= star ? 'currentColor' : 'none'} strokeWidth={ratings[category] >= star ? 2 : 1.5} />
                    </button>
                ))}
            </div>
        </div>
    );

    if (submitted) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <Card className="max-w-md w-full border-none shadow-2xl dark:bg-slate-900 overflow-hidden">
                        <div className="h-2 bg-green-500 w-full" />
                        <CardContent className="py-12 px-8 space-y-6">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <Zap size={32} fill="currentColor" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Success!</h2>
                            <p className="text-gray-500 dark:text-gray-400">Thank you for helping us optimize B(logN). Your technical feedback will be analyzed immediately by our team.</p>
                            <p className="text-sm text-blue-600 font-bold animate-pulse">Redirecting to feed...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 transition-colors flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto py-16 px-4 sm:px-6 w-full">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-4">How are we performing?</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        We're obsessive about speed and reliability. Share your performance reports to help us build a better academic hub.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:bg-slate-900 overflow-hidden">
                        <div className="h-1.5 bg-blue-600 w-full" />
                        <CardHeader className="pt-8 px-8 flex-row items-center justify-between border-b border-gray-50 dark:border-white/5 pb-6">
                            <CardTitle className="text-xl font-black text-gray-900 dark:text-white">Technical Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 transition-colors">
                            <RatingStars category="speed" label="Loading Speed" icon={Zap} />
                            <RatingStars category="editor" label="Editor Responsiveness" icon={Monitor} />
                            <RatingStars category="upload" label="Media Upload Experience" icon={Layout} />
                            <RatingStars category="mobile" label="Mobile Optimization" icon={Smartphone} />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:bg-slate-900">
                        <CardContent className="p-8 space-y-4 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors">
                                    <MessageSquare size={18} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">Technical Comments & Suggestions</span>
                            </div>
                            <textarea
                                className="w-full min-h-[160px] p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 outline-none resize-none transition-all text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-700"
                                placeholder="Any specific performance bottlenecks or bugs you noticed?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-full h-14 px-10 text-lg hover:scale-[1.02] shadow-xl transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Performance Report'}
                        </Button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default FeedbackPage;
