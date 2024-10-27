import axios from "axios";

const SERVER_BASE_URL = "http://localhost:8000/api"

const api = axios.create({
    headers: {
        "Content-Type": "application/json"
    },
    baseURL: SERVER_BASE_URL,
    withCredentials: true
})

export { api }