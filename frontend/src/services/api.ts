import { logIn, getIdToken, refreshIdToken } from './auth'

export const callApi = async (
  path: string,
  method: string,
  dataToSend?: any
): Promise<any> => {
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
      if (authToken) {
        response = await callApiWithAuthToken(
          path,
          method,
          authToken,
          dataToSend
        )
      } else {
        logIn()
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
