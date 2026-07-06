import client from './client';

export const engineApi = {
    runEngine: async () => {
        const response = await client.post('/engine/run');
        return response.data;
    }
};
