import client from './client';

export const transactionApi = {
    getAll: async () => {
        const response = await client.get('/transactions');
        return response.data;
    },
    update: async (txnId, data) => {
        const response = await client.put(`/transactions/${txnId}`, data);
        return response.data;
    },
    uploadCsv: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await client.post('/transactions/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
