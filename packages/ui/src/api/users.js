import client from './client'

const getAllUsers = () => client.get('/users')

const createUser = (body) => client.post(`/users`, body)

const updateUser = (id, body) => client.put(`/users/${id}`, body)

const deleteUser = (id) => client.delete(`/users/${id}`)

export default {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}
