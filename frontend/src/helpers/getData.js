export const getData = async (url) => {
  //metodo get
  const response = await fetch(`${url}`)
  const data = await response.json()
  return data
}
