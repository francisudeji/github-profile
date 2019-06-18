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
  const baseURL = 'https://api.github.com/users'
  const token = localStorage.getItem('github-token')
  const headers = { Authorization: `bearer ${token}` }

  axios
    .get(`${baseURL}/${username}`, { headers })
    .then(res => {
      console.log(res.data)
    })
    .catch(({ response }) => {
      console.log(response)
    })
}
