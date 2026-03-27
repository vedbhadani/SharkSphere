import api from './api.js';

export const getAllIdeas = async () => {
  const response = await api.get('/ideas');
  return response.data;
};

export const getIdeaById = async (id) => {
  const response = await api.get(`/ideas/${id}`);
  return response.data;
};

export const createIdea = async (title, description, researchLink) => {
  const response = await api.post('/ideas', { title, description, researchLink });
  return response.data;
};

export const updateIdea = async (id, title, description, researchLink) => {
  const response = await api.put(`/ideas/${id}`, { title, description, researchLink });
  return response.data;
};

export const deleteIdea = async (id) => {
  const response = await api.delete(`/ideas/${id}`);
  return response.data;
};

