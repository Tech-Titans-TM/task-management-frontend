import api from '../../axiosInstance';

export const createTask = async (userId, task) => {
    const { data } = await api.post(`/tasks/user/${userId}`, task);
    return data;
}

export const getAllTasks = async (userId) => {
    const { data } = await api.get(`/tasks/user/${userId}`);
    return data;
}