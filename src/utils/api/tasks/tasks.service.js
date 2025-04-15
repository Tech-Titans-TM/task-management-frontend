import api from '../../axiosInstance';

export const createTask = async (userId, task) => {
    const { data } = await api.post(`/tasks/user/${userId}`, task);
    return data;
}

export const getAllTasks = async (userId) => {
    const { data } = await api.get(`/tasks/user/${userId}`);
    return data;
}

export const updateTask = async (task) => {
    const { data } = await api.put(`/tasks/${task._id}`, task);
    console.log(data);
    return data;
}

export const deleteTask = async (taskId) => {
    const { data } = await api.delete(`/tasks/${taskId}`);
    return data;
}