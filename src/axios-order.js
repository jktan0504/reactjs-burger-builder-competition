import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://udemy-react-burger-65205.firebaseio.com'
});

export default instance;