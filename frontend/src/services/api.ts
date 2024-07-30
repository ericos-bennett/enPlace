import { logIn, getIdToken, refreshIdToken } from './auth'

const apiEndpoint = import.meta.env.VITE_API_URL

export const callApi = async (
  resource: string,
  method: string,
  dataToSend?: any
): Promise<any> => {
  const path = `${apiEndpoint}/${resource}`
  let authToken = getIdToken()
  if (!authToken) {
    logIn()
  } else {
    let response = await callApiWithAuthToken(
      path,
      method,
      authToken,
      dataToSend
    )
    if (response.status == 401) {
      authToken = await refreshIdToken()
      if (!authToken) {
        logIn()
      } else {
        response = await callApiWithAuthToken(
          path,
          method,
          authToken,
          dataToSend
        )
        return response.json()
      }
    } else if (!response.ok) {
      const { errorMessage } = await response.json()
      throw new Error(errorMessage)
    } else {
      return response.json()
    }
  }
}

const callApiWithAuthToken = async (
  path: string,
  method: string,
  authToken: string,
  dataToSend?: any
) => {
  return await fetch(path, {
    method,
    body: dataToSend,
    headers: {
      Authorization: authToken,
    },
  })
}
