import React from 'react';
import {
    Target,
    Lightbulb,
    Zap,
    Users,
    Rocket,
    Compass,
    AlertCircle,
    TrendingUp,
    Briefcase,
    ExternalLink,
    Database
} from 'lucide-react';

const sectionIcons = {
    '1': AlertCircle, // Problem Statement
    '2': Lightbulb,   // Solution
    '3': Zap,         // Why Now?
    '4': Users,       // Target Users
    '5': Rocket,      // Progress So Far
    '6': Compass,     // Team Requirements
    '7': TrendingUp,  // Competitors
    '8': Target,      // Long-Term Vision
    '10': Database    // Research Link
};

const StructuredBrief = ({ content }) => {
    if (!content) return null;

    // Pattern to match **Number. Title**
    const sections = content.split(/\*\*(\d+)\.\s+(.*?)\*\*/g);

    // The first element might be empty text before the first section
    const parsedSections = [];
    for (let i = 1; i < sections.length; i += 3) {
        const number = sections[i];
        const title = sections[i + 1];
        const body = sections[i + 2]?.trim();

        if (number && title && body) {
            parsedSections.push({ number, title, body });
        }
    }

    // If parsing fails or yields no sections, fallback to standard rendering
    if (parsedSections.length === 0) {
        return (
            <p className="text-text-body text-base leading-relaxed whitespace-pre-wrap relative z-10 font-medium selection:bg-purple-neon selection:text-white">
                {content}
            </p>
        );
    }

    return (
        <div className="space-y-6 relative z-10">
            {parsedSections.map((section, idx) => {
                const Icon = sectionIcons[section.number] || Briefcase;

                return (
                    <div key={idx} className="group/section">
                        <div className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.02] border border-transparent hover:border-white/5">
                            <div className="mt-1 p-2 rounded-xl bg-purple-neon/10 border border-purple-neon/20 text-purple-neon shrink-0 group-hover/section:scale-110 group-hover/section:shadow-[0_0_15px_rgba(123,95,255,0.3)] transition-all">
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-purple-neon/40 tracking-widest font-mono">
                                        {section.number.padStart(2, '0')}
                                    </span>
                                    <h4 className="text-sm font-black text-text-heading uppercase tracking-wider group-hover/section:text-purple-neon transition-colors">
                                        {section.title}
                                    </h4>
                                </div>
                                {section.number === '10' && (section.body.startsWith('http') || section.body.includes('drive.google.com')) ? (
                                    <div className="pt-2">
                                        <a
                                            href={section.body}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-neon/10 hover:bg-purple-neon/20 border border-purple-neon/30 hover:border-purple-neon/50 rounded-xl text-purple-neon text-xs font-bold uppercase tracking-wider transition-all shadow-glow-purple/10 hover:shadow-glow-purple/20"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Open Research Link
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-text-body text-sm sm:text-base leading-relaxed selection:bg-purple-neon selection:text-white font-medium">
                                        {section.body}
                                    </p>
                                )}
                            </div>
                        </div>
                        {idx < parsedSections.length - 1 && (
                            <div className="ml-14 h-px bg-gradient-to-r from-white/5 to-transparent mt-2" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StructuredBrief;
