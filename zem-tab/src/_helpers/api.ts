import axios from "axios";

// const api = 'https://0473-2a01-4f8-172-40a6-00-2.ngrok.io/coke-cny/us-central1'
// const api = 'https://0473-2a01-4f8-172-40a6-00-2.ngrok.io/coke-cny/us-central1'
// const api = 'http://localhost:5001/macallan-ecf92/us-central1'
const api = "http://localhost:8081";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // console.log(error.response)
    if (error.response?.status === 401) {
      localStorage.removeItem("_user");
      window.location.reload();
    }
    if (error?.request && !error?.response) {
      // connection failure
      // alert("Connection Error");
    }
    return Promise.reject(error);
  }
);

export const getAllTasks = () => {
  return axios.get(`${api}/tasks`);
};

export const deleteTask = (taskId: string) => {
  return axios.delete(`${api}/tasks/${taskId}`);
};

export const uploadTask = (files: any[]) => {
  // for now we are only handling one file
  if (files.length !== 0) {
    const file = files[0];
    console.log(file[0].originFileObj);
    const formData = new FormData();
    formData.append("taskSheet", file[0].originFileObj);

    return axios.post(`${api}/uploadTasks/`, formData);
  }
  return;
};

export const editTask = (task: any) => {
  return axios.put(`${api}/updateTask`, task);
};
