const BACKEND_BASEURL = process.env.REACT_APP_BACKEND_BASEURL

export const fetchJobs = async () => {
  const response = await fetch(`${BACKEND_BASEURL}/jobs`)

  return response.json()
}

export const fetchLocations = async () => {
  const response = await fetch(`${BACKEND_BASEURL}/locations`)
  
  return response.json()
}

export const fetchHeardFroms = async () => {
  const response = await fetch(`${BACKEND_BASEURL}/heardFroms`)
  
  return response.json()
}

export const submitJobApplication = async (payload: any) => {
  const {
    file,
    ...data
  } = payload

  const formData = new FormData();

  formData.append("file", file);

  try {
    const fileResponse = await fetch(`${BACKEND_BASEURL}/resume`, {
      method: 'POST',
      body: formData,
    })

    if (fileResponse.status === 200) {
      const response = await fetch(`${BACKEND_BASEURL}/submitJobApplication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(data)
      })
  
      return response.status
    } else {
      return 'error'
    }
  } catch (error) {
    return error
  }
}