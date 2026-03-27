import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb } from 'lucide-react';
import { createIdea } from '../api/ideas.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Card from '../components/Card.jsx';

const questions = [
  { id: 'problem', label: '1. Problem Statement', placeholder: 'Describe the problem your idea addresses...' },
  { id: 'solution', label: '2. Your Solution', placeholder: 'Explain how your idea solves the problem...' },
  { id: 'whyNow', label: '3. Why Now?', placeholder: 'What changed recently that makes this idea important today?' },
  { id: 'targetUsers', label: '4. Target Users', placeholder: 'Who are your users? Describe them clearly.' },
  { id: 'progress', label: '5. Progress So Far', placeholder: 'Idea / Prototype / MVP / Users / Revenue' },
  { id: 'team', label: '6. Co-Founder / Team Requirements', placeholder: 'Do you have a team? If not, what skills are you looking for?' },
  { id: 'competitors', label: '7. Competitors', placeholder: 'Who else is doing this and how are you different?' },
  { id: 'vision', label: '8. Long-Term Vision', placeholder: 'If this succeeds, what will it look like in 5 years?' },
  { id: 'slack', label: '9. Slack Username', placeholder: 'Share your Slack username for collaboration.' },
  { id: 'research', label: '10. Additional Research / Drive Link', placeholder: 'Share your drive link with additional data you want to share' }
];

const CreateIdea = () => {
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Concatenate answers for the single description field in backend
    const combinedDescription = questions
      .map(q => `**${q.label}**\n${answers[q.id]}`)
      .join('\n\n');

    // Extract research link for dedicated field
    const researchLink = answers.research;

    try {
      const response = await createIdea(title, combinedDescription, researchLink);
      if (response.success) {
        setSuccess(true);
        setTitle('');
        setAnswers(questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {}));
        setTimeout(() => {
          navigate('/dashboard');
        }, 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-heading pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-mesh-soft" />
        <div className="bg-dots-soft" />
      </div>
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-h1 font-bold mb-2 sm:mb-4 text-text-heading section-glow flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-purple-neon" />
            Share Your Idea
          </h1>
          <p className="text-body sm:text-body-lg text-text-body">
            What innovation are you building?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card glass hover={false} className="p-6 sm:p-8">
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-neon/10 border border-purple-neon/30 text-purple-neon px-6 py-5 rounded-xl mb-8 text-center shadow-glow-purple/20"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <div className="text-xl font-bold tracking-tight">Idea Submitted Successfully!</div>
                </div>
                <div className="text-base font-medium text-text-body/90">
                  Your idea has been sent to the <span className="text-purple-neon font-bold">E-Cell Team</span>.
                  We will notify you via email once it has been reviewed and approved.
                </div>
                <div className="text-xs mt-4 opacity-50 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-neon rounded-full animate-ping" />
                  Redirecting to your dashboard...
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-lg mb-8"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-neon flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-purple-neon rounded-full" />
                  Idea Title
                </h3>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={5}
                  placeholder="A short, descriptive title for your idea"
                  helperText="Minimum 5 characters"
                />
              </div>

              <div className="space-y-8">
                <div className="border-b border-border/50 pb-6">
                  <h3 className="text-2xl font-bold text-purple-neon flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-purple-neon rounded-full" />
                    Project Details
                  </h3>
                </div>

                {questions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-semibold text-text-body mb-2.5">
                      {q.label}
                    </label>
                    <textarea
                      value={answers[q.id]}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      required
                      minLength={2}
                      rows={4}
                      className="w-full px-4 py-3.5 bg-bg-secondary/50 backdrop-blur-sm border border-border-light rounded-lg text-sm text-text-heading placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-purple-neon focus:border-purple-neon focus:shadow-glow-purple transition-all duration-300 resize-none leading-relaxed hover:border-purple-DEFAULT/50"
                      placeholder={q.placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={success}
                  variant="neon"
                  className="flex-1 w-full sm:w-auto"
                >
                  {success ? 'Created!' : 'Post Idea'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateIdea;
