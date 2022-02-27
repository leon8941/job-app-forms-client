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

export const submitJobApplication = async (payload: unknown) => {
  const response = await fetch(`${BACKEND_BASEURL}/submitJobApplication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(payload)
  })

  return response.status
}