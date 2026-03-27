import prisma from '../config/db.js';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/email.js';
import { sendGlobalNewIdeaEmail } from '../services/emailService.js';

// Get pending ideas
export const getPendingIdeas = async (req, res) => {
    try {
        const ideas = await prisma.idea.findMany({
            where: { status: 'PENDING' },
            include: {
                author: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, ideas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching pending ideas' });
    }
};

export const getApprovedIdeas = async (req, res) => {
    try {
        const ideas = await prisma.idea.findMany({
            where: { status: 'APPROVED' },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                stage: true,
                createdAt: true,
                reviewedAt: true,
                author: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { reviewedAt: 'desc' }
        });
        res.json({ success: true, ideas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching approved ideas' });
    }
};

export const getRejectedIdeas = async (req, res) => {
    try {
        const ideas = await prisma.idea.findMany({
            where: { status: 'REJECTED' },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                stage: true,
                createdAt: true,
                reviewedAt: true,
                rejectionReason: true,
                author: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { reviewedAt: 'desc' }
        });
        res.json({ success: true, ideas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching rejected ideas' });
    }
};

// Approve idea
export const approveIdea = async (req, res) => {
    try {
        const { id } = req.params;
        const { stage } = req.body;
        const adminId = req.user.id;
        console.log("Approving idea with id:", id, "and stage:", stage);

        const idea = await prisma.idea.update({
            where: { id },
            data: {
                status: 'APPROVED',
                stage: stage || 'IDEA', // Default to IDEA if not provided
                reviewedBy: adminId,
                reviewedAt: new Date(),
            },
            include: {
                author: { select: { id: true, name: true, email: true } }
            }
        });

        // 1. Send immediate response to Admin
        res.json({
            success: true,
            message: 'Idea approved successfully. Global notifications are being dispatched.',
            ideaId: idea.id
        });

        // 2. Trigger asynchronous notifications (Don't await the whole process for the response)
        // We do not await this block so it runs in background
        (async () => {
            try {
                // Send primary approval mail to founder
                await sendApprovalEmail(idea.author.email, idea.title);

                // Fetch all eligible users
                const recipients = await prisma.user.findMany({
                    where: {
                        id: { not: idea.author.id },
                        emailNotifications: true,
                    },
                    select: { email: true }
                });

                if (recipients.length === 0) return;

                console.log(`📡 Dispatching global announcement for "${idea.title}" to ${recipients.length} users...`);

                const ideaLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`;

                // Use Promise.allSettled for high reliability and logging
                const results = await Promise.allSettled(
                    recipients.map(user =>
                        sendGlobalNewIdeaEmail({
                            to: user.email,
                            ideaTitle: idea.title,
                            founderName: idea.author.name,
                            ideaLink
                        })
                    )
                );

                // Log stats
                const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
                const failed = results.length - successful;

                console.log(`✅ Global notification complete. Sent: ${successful}, Failed: ${failed}`);

                if (failed > 0) {
                    const failures = results
                        .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
                        .map(r => r.status === 'fulfilled' ? r.value.email : 'Unknown');
                    console.log(`❌ Failed recipients:`, failures.slice(0, 10), failures.length > 10 ? '...' : '');
                }

            } catch (notifyError) {
                console.error('❌ Critical error in global notification background task:', notifyError);
            }
        })();

    } catch (error) {
        console.error('Error in approveIdea:', error);
        res.status(500).json({ success: false, message: 'Error approving idea' });
    }
};

// Reject idea
export const rejectIdea = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        const adminId = req.user.id;

        if (!rejectionReason || rejectionReason.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason must be at least 10 characters long'
            });
        }

        const idea = await prisma.idea.update({
            where: { id },
            data: {
                status: 'REJECTED',
                rejectionReason,
                reviewedBy: adminId,
                reviewedAt: new Date(),
            },
            include: {
                author: { select: { email: true } }
            }
        });

        // Send email notification
        await sendRejectionEmail(idea.author.email, idea.title, rejectionReason);

        res.json({ success: true, message: 'Idea rejected successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error rejecting idea' });
    }
};

// Update idea stage
export const updateIdeaStage = async (req, res) => {
    try {
        const { id } = req.params;
        const { stage } = req.body;

        if (!['IDEA', 'PROTOTYPE', 'REVENUE'].includes(stage)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stage. Must be IDEA, PROTOTYPE, or REVENUE.'
            });
        }

        const idea = await prisma.idea.update({
            where: { id },
            data: { stage },
            include: {
                author: { select: { name: true, email: true } }
            }
        });

        res.json({
            success: true,
            message: `Idea stage updated to ${stage}`,
            idea
        });
    } catch (error) {
        console.error('Error in updateIdeaStage:', error);
        res.status(500).json({ success: false, message: 'Error updating idea stage' });
    }
};
