import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newPersonObject => {
    return axios.post(baseUrl, newPersonObject)
      .then(response => response.data)
      
  }

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
    // const request = axios.delete(`${baseUrl}/${id}`)
    // return request.then(reponse => response.data)
}

const update = (id, newPersonObject) => {
    return axios.put(`${baseUrl}/${id}`, newPersonObject)
      .then(response => response.data)
}

export default{getAll, create, remove, update}