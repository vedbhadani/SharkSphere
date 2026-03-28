import prisma from "../config/db.js";

export const createIdea = async (req, res) => {
  try {
    const { title, description, researchLink } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    if (title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 5 characters long"
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters long"
      });
    }

    // Create idea in database
    const idea = await prisma.idea.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        researchLink: researchLink ? researchLink.trim() : null,
        authorId: userId
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Return response
    return res.status(201).json({
      success: true,
      message: "Idea posted successfully",
      idea
    });
  } catch (error) {
    console.error("Creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during idea posting"
    });
  }
};

export const getAllIdeas = async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { status: 'APPROVED' },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        votes: true
      },
      orderBy: { createdAt: "desc" }
    });

    // Calculate vote counts for each idea
    const ideasWithVotes = ideas.map(idea => {
      const upvotes = idea.votes.filter(vote => vote.voteType === 'UPVOTE').length;
      const downvotes = idea.votes.filter(vote => vote.voteType === 'DOWNVOTE').length;
      const totalVotes = upvotes - downvotes;

      return {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        researchLink: idea.researchLink,
        author: idea.author,
        stage: idea.stage,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
        votes: {
          upvotes,
          downvotes,
          total: totalVotes
        }
      };
    });

    return res.status(200).json({
      success: true,
      count: ideasWithVotes.length,
      ideas: ideasWithVotes
    });
  } catch (error) {
    console.error("Get ideas error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while fetching ideas"
    });
  }
};

export const getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find idea by ID with author and votes
    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        votes: true
      }
    });

    // If not found, return 404
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }

    // Calculate vote counts
    const upvotes = idea.votes.filter(vote => vote.voteType === 'UPVOTE').length;
    const downvotes = idea.votes.filter(vote => vote.voteType === 'DOWNVOTE').length;
    const totalVotes = upvotes - downvotes;

    // Return idea
    return res.status(200).json({
      success: true,
      idea: {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        researchLink: idea.researchLink,
        author: idea.author,
        stage: idea.stage,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
        votes: {
          upvotes,
          downvotes,
          total: totalVotes
        }
      }
    });
  } catch (error) {
    console.error("Get idea error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching idea"
    });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, researchLink } = req.body;
    const userId = req.user.id;

    // Find idea
    const idea = await prisma.idea.findUnique({
      where: { id }
    });

    // Check if exists
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }

    // Check if user is the author
    if (idea.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this idea"
      });
    }

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    if (title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 5 characters long"
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters long"
      });
    }

    // Update idea
    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        researchLink: researchLink ? researchLink.trim() : null
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Return updated idea
    return res.status(200).json({
      success: true,
      message: "Idea updated successfully",
      idea: updatedIdea
    });
  } catch (error) {
    console.error("Update idea error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating idea"
    });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find idea
    const idea = await prisma.idea.findUnique({
      where: { id }
    });

    // Check if exists
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }
    // Check if user is the author
    if (idea.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this idea"
      });
    }
    // Delete idea (votes will cascade delete automatically)
    await prisma.idea.delete({
      where: { id }
    });
    // Return success message
    return res.status(200).json({
      success: true,
      message: "Idea deleted successfully"
    });
  } catch (error) {
    console.error("Delete idea error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting idea"
    });
  }
};