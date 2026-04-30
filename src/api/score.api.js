import api from './axiosConfig';

export const scoreApi = {
    
    // লাইভ স্কোর ফেচ করার নতুন ফাংশনগুলো
    getFootballScores: () => api.get('/scores/football'),
    getCricketScores: () => api.get('/scores/cricket')
};