const baseUrl = '/api'

export async function getMatches() : Promise<Match[]> {
  const response = await fetch(`${baseUrl}/matches`)
  return response.json()
}

export async function saveMatch(match : Partial<Match>) {
  try {
    const response = await fetch(`${baseUrl}/match`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(match),
    })

    if(!response.ok)
      throw Error("Match could not be saved.")

    return true
  } catch (e) {
    throw Error("Something went wrong: " + e)
  }
}


export default {
  getMatches,
  saveMatch
}

