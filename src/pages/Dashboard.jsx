import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Eye, Search, ArrowUp, Plus, Filter, Lightbulb, FileText, TrendingUp, Clock } from 'lucide-react';
import { getAllIdeas, deleteIdea } from '../api/ideas.js';
import { toggleVote } from '../api/votes.js';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import IdeaModal from '../components/IdeaModal.jsx';
import { stripMarkdown } from '../utils/text.js';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingIds, setVotingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await getAllIdeas();
      if (response.success) {
        setIdeas(response.ideas);
      }
    } catch (err) {
      setError('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId, voteType) => {
    if (votingIds.has(ideaId)) return;

    setVotingIds((prev) => new Set(prev).add(ideaId));

    try {
      const response = await toggleVote(ideaId, voteType);
      if (response.success) {
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea.id === ideaId
              ? { ...idea, votes: response.votes }
              : idea
          )
        );
      }
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVotingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
    }
  };

  const handleDelete = async (ideaId) => {
    if (!window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }

    if (deletingIds.has(ideaId)) return;

    setDeletingIds((prev) => new Set(prev).add(ideaId));

    try {
      const response = await deleteIdea(ideaId);
      if (response.success) {
        setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
        if (selectedIdea?.id === ideaId) {
          setIsModalOpen(false);
          setSelectedIdea(null);
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete idea. Please try again.');
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
    }
  };

  const handleViewDetails = (idea) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideas;

    if (searchQuery) {
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'votes') {
      filtered = [...filtered].sort((a, b) => (b.votes?.total || 0) - (a.votes?.total || 0));
    }

    return filtered;
  }, [ideas, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-heading flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-purple-DEFAULT border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-text-body">Loading ideas...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-heading flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <Button onClick={fetchIdeas}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-heading pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-mesh-soft" />
        <div className="bg-circuits" />
      </div>
      <div className="max-w-content mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6"
        >
          <div className="flex-1">
            <h1 className="text-h1 font-bold mb-2 sm:mb-3 text-text-heading section-glow flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-purple-neon" />
              Ideas
            </h1>
            <p className="text-body text-text-body sm:text-body-lg">
              Explore and vote on innovative ideas from the community
            </p>
          </div>
          <Link to="/create-idea" className="w-full sm:w-auto">
            <Button size="lg" variant="neon" className="group w-full sm:w-auto">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Share Idea</span>
              <span className="sm:hidden">Share</span>
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none z-10">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted" />
            </div>
            <Input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-0 pl-10 sm:pl-12"
            />
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[180px]">
            <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none z-10">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 pl-10 sm:pl-12 bg-bg-secondary border border-border-light rounded-lg text-sm sm:text-base text-text-heading focus:outline-none focus:ring-2 focus:ring-purple-neon focus:border-purple-neon transition-all duration-200 appearance-none cursor-pointer hover:border-purple-DEFAULT/50"
            >
              <option value="newest">Newest First</option>
              <option value="votes">Most Voted</option>
            </select>
          </div>
        </motion.div>

        {/* Ideas Grid */}
        {filteredAndSortedIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 sm:py-32 px-4"
          >
            <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">💡</div>
            <h2 className="text-h2 font-bold mb-3 sm:mb-4 text-text-heading">
              {searchQuery ? 'No ideas found' : 'No ideas yet'}
            </h2>
            <p className="text-body text-text-body sm:text-body-lg mb-6 sm:mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Be the first to share an innovative idea with the community'}
            </p>
            {!searchQuery && (
              <Link to="/create-idea" className="inline-block w-full sm:w-auto">
                <Button size="lg" variant="neon" className="w-full sm:w-auto">Create First Idea</Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="relative rounded-card p-3 sm:p-4 bg-bg-secondary/30 border border-border/30">
            <div className="bg-dots-soft" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
              <AnimatePresence>
                {filteredAndSortedIdeas.map((idea, index) => {
                  const isPositive = idea.votes?.total > 0;
                  const voteCount = idea.votes?.total || 0;

                  return (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      layout
                      className="h-full"
                    >
                      <Card hover glass className="p-0 h-full flex flex-col min-h-[300px] overflow-hidden border-white/5 hover:border-purple-neon/20 transition-all duration-300 group shadow-lg cursor-pointer" onClick={() => handleViewDetails(idea)}>
                        {/* Card Header */}
                        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-lg font-bold text-text-heading truncate tracking-tight group-hover:text-purple-neon transition-colors">
                                  {idea.title}
                                </h3>
                                {idea.stage && (
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_-3px] transition-all duration-300 ${idea.stage === 'REVENUE'
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
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const created = new Date(idea.createdAt);
                                  const days = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
                                  const voteTotal = idea.votes?.total || 0;
                                  return (
                                    <>
                                      {days < 7 && (
                                        <span className="flex items-center gap-1 text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/5 px-2 py-0.5 rounded-md border border-cyan-500/10">
                                          <Clock className="w-2.5 h-2.5" />
                                          New
                                        </span>
                                      )}
                                      {voteTotal >= 5 && (
                                        <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                                          <TrendingUp className="w-2.5 h-2.5" />
                                          Trending
                                        </span>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                            {user && idea.author.id === user.id && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(idea.id);
                                }}
                                disabled={deletingIds.has(idea.id)}
                                whileHover={{ scale: 1.1, color: '#ef4444' }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-md text-text-muted hover:bg-red-500/10 transition-all opacity-40 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 relative flex flex-col">
                          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
                            <Lightbulb className="w-16 h-16" />
                          </div>
                          <p className="text-text-body text-sm leading-relaxed line-clamp-4 flex-1 mb-4 relative z-10 opacity-90">
                            {stripMarkdown(idea.description)}
                          </p>

                          <button
                            onClick={() => handleViewDetails(idea)}
                            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-purple-neon transition-all mb-2 group/btn"
                          >
                            <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                            View More
                          </button>
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 bg-white/[0.02] border-t border-white/5 mt-auto">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                                {idea.author.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-text-heading/90 leading-none mb-0.5">
                                  {idea.author.name}
                                </span>
                                <span className="text-[9px] uppercase tracking-tighter text-text-muted/60 font-mono">
                                  Contributor
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(idea.id, 'UPVOTE');
                                }}
                                disabled={votingIds.has(idea.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isPositive
                                  ? 'bg-purple-neon text-white shadow-[0_0_15px_rgba(123,95,255,0.4)] border border-purple-neon/20'
                                  : 'bg-white/5 text-text-muted hover:bg-white/10 border border-white/5'
                                  }`}
                              >
                                <ArrowUp className="w-3.5 h-3.5" strokeWidth={3} />
                                <span>{idea.votes?.upvotes || 0}</span>
                              </motion.button>
                              <div className={`text-sm font-black min-w-[1.5rem] text-center ${isPositive ? 'text-purple-neon' : 'text-text-muted/40'}`}>
                                {voteCount > 0 ? '+' : ''}{voteCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      <IdeaModal
        idea={selectedIdea}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIdea(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
