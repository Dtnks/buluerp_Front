import axios from 'axios'

const httpInstance = axios.create({
  baseURL: 'http://154.201.77.135:8080/',
  timeout: 5000,
})

export default httpInstance
