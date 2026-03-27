import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter,
    MoreHorizontal,
    AlertCircle,
    Eye,
    Mail,
    User,
    FileText,
    Calendar
} from 'lucide-react';
import {
    getPendingIdeas,
    getApprovedIdeas,
    getRejectedIdeas,
    approveIdea,
    rejectIdea,
    updateIdeaStage
} from '../api/admin.js';
import { Edit2, TrendingUp, Cpu, Lightbulb } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import StructuredBrief from '../components/StructuredBrief';
import { stripMarkdown } from '../utils/text.js';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // View Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewIdea, setViewIdea] = useState(null);

    // Stage Modal State
    const [isStageModalOpen, setIsStageModalOpen] = useState(false);
    const [stageAction, setStageAction] = useState('approve'); // 'approve' or 'update'
    const [selectedStage, setSelectedStage] = useState('IDEA');

    const fetchIdeas = async () => {
        setLoading(true);
        try {
            let response;
            if (activeTab === 'pending') response = await getPendingIdeas();
            else if (activeTab === 'approved') response = await getApprovedIdeas();
            else response = await getRejectedIdeas();

            if (response.success) {
                setIdeas(response.ideas);
            }
        } catch (error) {
            console.error('Failed to fetch ideas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, [activeTab]);

    const handleApprove = async () => {
        setActionLoading(selectedIdea.id);
        try {
            const response = await approveIdea(selectedIdea.id, selectedStage);
            if (response.success) {
                setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== selectedIdea.id));
                setIsStageModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to approve idea:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateStage = async () => {
        setActionLoading(selectedIdea.id);
        try {
            const response = await updateIdeaStage(selectedIdea.id, selectedStage);
            if (response.success) {
                setIdeas(prevIdeas => prevIdeas.map(idea =>
                    idea.id === selectedIdea.id ? { ...idea, stage: selectedStage } : idea
                ));
                setIsStageModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to update stage:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const openApproveModal = (idea) => {
        setSelectedIdea(idea);
        setStageAction('approve');
        setSelectedStage('IDEA');
        setIsStageModalOpen(true);
    };

    const openUpdateStageModal = (idea) => {
        setSelectedIdea(idea);
        setStageAction('update');
        setSelectedStage(idea.stage || 'IDEA');
        setIsStageModalOpen(true);
    };

    const openRejectModal = (idea) => {
        setSelectedIdea(idea);
        setIsRejectModalOpen(true);
    };

    const handleReject = async () => {
        if (rejectionReason.length < 10) return;

        setActionLoading(selectedIdea.id);
        try {
            const response = await rejectIdea(selectedIdea.id, rejectionReason);
            if (response.success) {
                setIdeas(ideas.filter(idea => idea.id !== selectedIdea.id));
                setIsRejectModalOpen(false);
                setRejectionReason('');
            }
        } catch (error) {
            console.error('Failed to reject idea:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const openViewModal = (idea) => {
        setViewIdea(idea);
        setIsViewModalOpen(true);
    };

    const tabs = [
        { id: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-400' },
        { id: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-400' },
        { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-400' }
    ];

    return (
        <div className="min-h-screen bg-bg-primary pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-text-heading mb-2">Admin Moderation</h1>
                    <p className="text-text-body">Review and manage startup ideas submitted by the community.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card glass className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-yellow-400/10">
                                <Clock className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-text-muted capitalize">Pending Review</p>
                                <p className="text-2xl font-bold text-text-heading">
                                    {activeTab === 'pending' ? ideas.length : '...'}
                                </p>
                            </div>
                        </div>
                    </Card>
                    {/* Add more stats as needed */}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-border/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${activeTab === tab.id ? 'text-purple-neon' : 'text-text-muted hover:text-text-heading'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="adminActiveTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-neon shadow-[0_0_10px_rgba(123,95,255,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Ideas Grid/List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-purple-neon border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : ideas.length === 0 ? (
                    <div className="text-center py-20">
                        <AlertCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-text-heading">No ideas found</h3>
                        <p className="text-text-body">There are no {activeTab} ideas at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {ideas.map((idea) => (
                                <motion.div
                                    key={idea.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card glass className="p-0 h-full flex flex-col overflow-hidden border-white/5 hover:border-purple-neon/20 transition-all duration-300 group">
                                        {/* Card Header */}
                                        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-bold text-text-heading truncate tracking-tight">{idea.title}</h3>
                                                        {idea.stage && (
                                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_12px_-3px] transition-all duration-300 ${idea.stage === 'REVENUE'
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/20' :
                                                                idea.stage === 'PROTOTYPE'
                                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-blue-500/20' :
                                                                    'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-purple-500/20'
                                                                }`}>
                                                                <span className={`w-1 h-1 rounded-full animate-pulse ${idea.stage === 'REVENUE' ? 'bg-green-400' :
                                                                    idea.stage === 'PROTOTYPE' ? 'bg-blue-400' : 'bg-purple-400'
                                                                    }`} />
                                                                {idea.stage}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="w-5 h-5 rounded-md bg-purple-neon/20 flex items-center justify-center text-[10px] font-bold text-purple-neon">
                                                            {idea.author.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-text-muted">by</span>
                                                        <span className="text-purple-neon/80 font-medium">{idea.author.name}</span>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-mono text-text-muted mt-1 opacity-60">
                                                    {new Date(idea.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 flex-1 relative flex flex-col">
                                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                                <FileText className="w-16 h-16" />
                                            </div>
                                            <p className="text-text-body text-sm leading-relaxed line-clamp-3 mb-6 flex-1 relative z-10 opacity-90">
                                                {stripMarkdown(idea.description)}
                                            </p>

                                            <div className="flex items-center gap-2 pt-2">
                                                <button
                                                    onClick={() => openViewModal(idea)}
                                                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted hover:text-purple-neon transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View More
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Footer Actions */}
                                        <div className="p-4 bg-black/20 border-t border-white/5 mt-auto">
                                            <div className="flex items-center gap-2">
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => openRejectModal(idea)}
                                                            className="flex-1 bg-red-500/5 hover:bg-red-500/10 border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider"
                                                            disabled={actionLoading === idea.id}
                                                        >
                                                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="neon"
                                                            onClick={() => openApproveModal(idea)}
                                                            loading={actionLoading === idea.id}
                                                            className="flex-1 text-xs font-bold uppercase tracking-wider"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                            Approve
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="flex w-full gap-2">
                                                        {activeTab === 'approved' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openUpdateStageModal(idea)}
                                                                className="flex-1 bg-purple-neon/5 hover:bg-purple-neon/10 border-purple-neon/20 text-purple-neon text-xs font-bold uppercase tracking-wider"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                                                                Update Progress
                                                            </Button>
                                                        )}
                                                        {activeTab === 'rejected' && (
                                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest w-full justify-center">
                                                                <AlertCircle className="w-3 h-3" />
                                                                Rejected
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Reject Startup Idea"
            >
                <div className="space-y-6">
                    <p className="text-text-body text-sm">
                        Please provide a detailed reason for the rejection. This feedback will be emailed to the founder.
                    </p>
                    <Input
                        label="Rejection Reason"
                        placeholder="e.g., Problem statement is too broad. Please narrow down the target audience..."
                        textarea
                        rows={5}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        helperText={`${rejectionReason.length}/10 characters minimum`}
                    />
                    <div className="flex justify-end gap-3 mt-8">
                        <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="neon"
                            className="bg-red-500/20 hover:bg-red-500/40 border-red-500/50 text-red-100"
                            disabled={rejectionReason.length < 10}
                            onClick={handleReject}
                            loading={actionLoading === selectedIdea?.id}
                        >
                            Confirm Rejection
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Startup Idea Details"
            >
                {viewIdea && (
                    <div className="space-y-8 py-2">
                        {/* Status Ribbon */}
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-lg ${viewIdea.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/10' :
                                viewIdea.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-red-500/10' :
                                    'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-amber-500/10'
                                }`}>
                                {viewIdea.status}
                            </span>
                            {viewIdea.stage && (
                                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-lg ${viewIdea.stage === 'REVENUE' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/10' :
                                    viewIdea.stage === 'PROTOTYPE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-blue-500/20' :
                                        'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-purple-500/20'
                                    }`}>
                                    {viewIdea.stage}
                                </span>
                            )}
                        </div>

                        {/* Title Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1 h-1 rounded-full bg-purple-neon shadow-[0_0_8px_rgba(123,95,255,1)]" />
                                <Label className="text-[11px]">Primary Objective</Label>
                            </div>
                            <h3 className="text-3xl font-black text-text-heading tracking-tight leading-tight selection:bg-purple-neon/30">
                                {viewIdea.title}
                            </h3>
                        </div>

                        {/* Intelligence Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition-colors group">
                                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <User className="w-3.5 h-3.5 text-purple-neon" />
                                    <Label>Founder Profile</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-neon/20 to-purple-600/20 flex items-center justify-center text-purple-neon text-sm font-black border border-purple-neon/30">
                                        {viewIdea.author.name.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="text-text-heading font-black tracking-tight">{viewIdea.author.name}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition-colors group">
                                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Mail className="w-3.5 h-3.5 text-purple-neon" />
                                    <Label>Communication Channel</Label>
                                </div>
                                <p className="text-text-muted text-sm font-medium tracking-tight h-10 flex items-center">{viewIdea.author.email}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 sm:col-span-2 hover:bg-white/[0.04] transition-colors group">
                                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Calendar className="w-3.5 h-3.5 text-purple-neon" />
                                    <Label>Submission Timestamp</Label>
                                </div>
                                <p className="text-text-muted text-sm font-medium tracking-tight">
                                    {new Date(viewIdea.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="divider-decor opacity-50" />

                        {/* Executive Summary Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-purple-neon shadow-[0_0_8px_rgba(123,95,255,1)]" />
                                <Label className="text-[11px]">Detailed Brief</Label>
                            </div>
                            <div className="glass-strong p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                    <FileText className="w-32 h-32" />
                                </div>
                                <StructuredBrief content={viewIdea.description} />
                            </div>
                        </div>

                        {/* Feedback Loop */}
                        {viewIdea.status === 'REJECTED' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl space-y-4 shadow-xl"
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <Label className="text-red-400 font-black">Official Rejection Feedback</Label>
                                </div>
                                <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 italic text-red-200/80 text-sm leading-relaxed">
                                    "{viewIdea.rejectionReason}"
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Stage Selection/Update Modal */}
            <Modal
                isOpen={isStageModalOpen}
                onClose={() => setIsStageModalOpen(false)}
                title={stageAction === 'approve' ? "Approve & Tag Stage" : "Update Idea Stage"}
            >
                <div className="space-y-6">
                    <p className="text-text-body text-sm">
                        {stageAction === 'approve'
                            ? "Select the current stage of this startup idea before approving it."
                            : "Update the current progress stage of this startup idea."}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { id: 'IDEA', label: 'Idea Phase', desc: 'Conceptual stage, market research.', icon: Lightbulb, color: 'text-purple-400' },
                            { id: 'PROTOTYPE', label: 'Prototype', desc: 'MVP or limited functionality built.', icon: Cpu, color: 'text-blue-400' },
                            { id: 'REVENUE', label: 'Revenue', desc: 'Active users and generating income.', icon: TrendingUp, color: 'text-green-400' }
                        ].map((stage) => (
                            <button
                                key={stage.id}
                                onClick={() => setSelectedStage(stage.id)}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedStage === stage.id
                                    ? 'bg-purple-neon/10 border-purple-neon shadow-[0_0_15px_rgba(123,95,255,0.15)]'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg bg-white/5 ${stage.color}`}>
                                    <stage.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold ${selectedStage === stage.id ? 'text-text-heading' : 'text-text-body'}`}>
                                        {stage.label}
                                    </p>
                                    <p className="text-xs text-text-muted">{stage.desc}</p>
                                </div>
                                {selectedStage === stage.id && (
                                    <CheckCircle className="w-5 h-5 text-purple-neon" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button variant="ghost" onClick={() => setIsStageModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="neon"
                            onClick={stageAction === 'approve' ? handleApprove : handleUpdateStage}
                            loading={actionLoading === selectedIdea?.id}
                        >
                            {stageAction === 'approve' ? 'Approve Idea' : 'Update Stage'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const Label = ({ children, className = "" }) => (
    <span className={`text-[10px] uppercase font-bold tracking-[0.15em] text-purple-neon/80 ${className}`}>
        {children}
    </span>
);

export default AdminDashboard;
