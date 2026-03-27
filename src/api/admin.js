import api from './api.js';

export const getPendingIdeas = async () => {
    const response = await api.get('/admin/ideas/pending');
    return response.data;
};

export const getApprovedIdeas = async () => {
    const response = await api.get('/admin/ideas/approved');
    return response.data;
};

export const getRejectedIdeas = async () => {
    const response = await api.get('/admin/ideas/rejected');
    return response.data;
};

export const approveIdea = async (id, stage) => {
    const response = await api.patch(`/admin/ideas/${id}/approve`, { stage });
    return response.data;
};

export const rejectIdea = async (id, rejectionReason) => {
    const response = await api.patch(`/admin/ideas/${id}/reject`, { rejectionReason });
    return response.data;
};

export const updateIdeaStage = async (id, stage) => {
    const response = await api.patch(`/admin/ideas/${id}/stage`, { stage });
    return response.data;
};
