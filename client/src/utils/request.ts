import axios from 'axios'

const request = axios.create({
    baseURL: 'https://api-music-player.vercel.app'
})

export const get = async (path: string, option = {}) => {
    const response = await request.get(path, option)
    return response.data
}
