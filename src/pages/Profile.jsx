import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Eye, User, Mail, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllIdeas, deleteIdea } from '../api/ideas.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import IdeaModal from '../components/IdeaModal.jsx';
import { stripMarkdown } from '../utils/text.js';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userIdeas, setUserIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserIdeas();
    }
  }, [user]);

  const fetchUserIdeas = async () => {
    try {
      setIdeasLoading(true);
      const response = await getAllIdeas();
      if (response.success) {
        const filtered = response.ideas.filter((idea) => idea.author.id === user.id);
        setUserIdeas(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch user ideas:', err);
    } finally {
      setIdeasLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    logout();
    navigate('/');
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
        setUserIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-heading pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-h1 font-bold mb-2 sm:mb-4 text-text-heading section-glow flex items-center gap-2">
            <User className="w-6 h-6 text-purple-neon" />
            Profile
          </h1>
          <p className="text-body sm:text-body-lg text-text-body">Your account information</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card glass className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border-light">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <div className="absolute -inset-2 rounded-[2rem] bg-purple-neon/10 blur-2xl" />
                <div className="relative w-full h-full rounded-card bg-gradient-to-br from-purple-DEFAULT to-purple-neon flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-glow-neon flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                <h2 className="text-h2 font-bold mb-2 text-text-heading">{user.name}</h2>
                <p className="text-body text-text-body flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{user.email}</span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="text-body-lg font-medium text-text-heading bg-bg-tertiary border border-border-light rounded-lg px-4 py-3">
                  {user.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="text-body-lg font-medium text-text-heading bg-bg-tertiary border border-border-light rounded-lg px-4 py-3">
                  {user.email}
                </div>
              </div>

              {user.emailVerified !== undefined && (
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                    Verification Status
                  </label>
                  <div className="flex items-center gap-2">
                    {user.emailVerified ? (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg">
                        <XCircle className="w-5 h-5" />
                        <span className="font-semibold">Not Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-border-light">
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  loading={loading}
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="divider-decor mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card glass hover={false} className="text-center">
              <div className="text-xs text-text-muted mb-1">Ideas Posted</div>
              <div className="text-h3 font-bold text-text-heading">{userIdeas.length}</div>
            </Card>
            <Card glass hover={false} className="text-center">
              <div className="text-xs text-text-muted mb-1">Total Votes</div>
              <div className="text-h3 font-bold text-text-heading">{userIdeas.reduce((sum, i) => sum + (i.votes?.total || 0), 0)}</div>
            </Card>
            <Card glass hover={false} className="text-center hidden md:block">
              <div className="text-xs text-text-muted mb-1">Latest Idea</div>
              <div className="text-h4 font-semibold text-text-heading">
                {userIdeas.length ? new Date(userIdeas[0].createdAt).toLocaleDateString() : '—'}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* User's Ideas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-h2 font-bold mb-4 sm:mb-6 text-text-heading">Your Ideas</h2>
          {ideasLoading ? (
            <div className="text-center py-8 sm:py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-4 border-purple-DEFAULT border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-text-body">Loading your ideas...</p>
            </div>
          ) : userIdeas.length === 0 ? (
            <Card glass className="text-center py-8 sm:py-12 px-4">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-neon mx-auto mb-4" />
              <p className="text-text-body mb-4">You haven't shared any ideas yet</p>
              <Button onClick={() => navigate('/create-idea')} variant="neon" className="w-full sm:w-auto">Create Your First Idea</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {userIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="h-full"
                >
                  <Card hover glass className="h-full flex flex-col min-h-[260px] sm:min-h-[280px]">
                    <div className="flex-1 mb-4 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-h4 font-semibold text-text-heading line-clamp-2 flex-1">
                          {idea.title}
                        </h3>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(idea.id);
                          }}
                          disabled={deletingIds.has(idea.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete idea"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                        </motion.button>
                      </div>
                      <p
                        className="text-body text-text-body line-clamp-3 flex-1 mb-4"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {stripMarkdown(idea.description)}
                      </p>
                      <motion.button
                        onClick={() => handleViewDetails(idea)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 text-sm font-medium text-purple-neon hover:text-purple-accent transition-colors mb-4 group"
                      >
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        View More
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border-light mt-auto">
                      <div className="text-sm text-text-muted">
                        {idea.votes?.total || 0} votes
                      </div>
                      <div className="text-xs text-text-muted">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
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

export default Profile;
