import axios from 'axios'
import netlify from 'netlify-auth-providers'

export async function authenticateWithGithub() {
  return new Promise((resolve, reject) => {
    const authenticator = new netlify({
      site_id: 'bb636699-af55-440f-84e8-0076e8f1aab5'
    })
    authenticator.authenticate(
      { provider: 'github', scope: 'public_repo,read:org,read:user' },
      (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      }
    )
  })
}

export async function getUserProfile(username) {
  const baseURL = `https://api.github.com/users/${username}`
  const token = localStorage.getItem('github-token')
  const headers = { Authorization: `bearer ${token}` }

  const basicInfoPromise = axios.get(`${baseURL}`)
  const allReposPromise = axios.get(`${baseURL}/repos`)
  const starredReposPromise = axios.get(`${baseURL}/starred`)

  return new Promise((resolve, reject) => {
    axios
      .all([basicInfoPromise, allReposPromise, starredReposPromise], {
        headers
      })
      .then(
        axios.spread((basicInfo, allRepos, starredRepos) => {
          resolve({
            basicInfo: basicInfo.data,
            allRepos: allRepos.data,
            starredRepos: starredRepos.data
          })
        })
      )
      .catch(err => {
        reject(err)
      })
  })
}
