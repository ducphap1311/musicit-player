import * as request from '../utils/request'

export const createSourceAudio = async (videoId: string) => {
    try {
        const res = await request.get(`/download?url=https://www.youtube.com/watch?v=${videoId}`, {})
        return res
    } catch (error) {
        console.log(error);
        
    }
}