import client from './client';

export const resultsApi = {
    getLatestResult: async () => {
        const response = await client.get('/results/latest');
        return response.data;
    }
};
