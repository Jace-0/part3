import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newPersonObject => {
    return axios.post(baseUrl, newPersonObject)
      .then(response => response.data)
      .catch(error => {
        console.error("Error in create:", error)
        throw error  // Re-throw the error to be caught in the App component
      })
  }

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
    // const request = axios.delete(`${baseUrl}/${id}`)
    // return request.then(reponse => response.data)
}

const update = (id, newPersonObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newPersonObject)
    return request.then(response => response.data)
}

export default{getAll, create, remove, update}