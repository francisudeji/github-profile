import axios from 'axios'
import netlify from 'netlify-auth-providers'

export async function authenticateWithGithub() {
  return new Promise((resolve, reject) => {
    const authenticator = new netlify({
      site_id: 'bb636699-af55-440f-84e8-0076e8f1aab5'
    })
    authenticator.authenticate(
      {
        provider: 'github',
        scope: 'public_repo,read:org,read:user,user:follow'
      },
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
  const allReposPromise = axios.get(
    `${baseURL}/repos?direction=desc&sort=created&limit=50`
  )
  const starredReposPromise = axios.get(`${baseURL}/starred`)
  const followersPromise = axios.get(`${baseURL}/followers`)
  const followingPromise = axios.get(`${baseURL}/following`)

  return new Promise((resolve, reject) => {
    axios
      .all(
        [
          basicInfoPromise,
          allReposPromise,
          starredReposPromise,
          followersPromise,
          followingPromise
        ],
        {
          headers
        }
      )
      .then(
        axios.spread(
          (basicInfo, allRepos, starredRepos, followers, following) => {
            const _followers = []
            const _following = []

            followers.data.forEach(follower => {
              axios
                .get(`https://api.github.com/users/${follower.login}`)
                .then(res => {
                  _followers.push(res.data)
                  return _followers
                })
                .then(res2 => {
                  following.data.forEach(__following => {
                    axios
                      .get(`https://api.github.com/users/${__following.login}`)
                      .then(res3 => {
                        _following.push(res3.data)
                        resolve({
                          basicInfo: basicInfo.data,
                          allRepos: allRepos.data,
                          starredRepos: starredRepos.data,
                          followers: _followers,
                          following: _following
                        })
                      })
                      .catch(err => {
                        reject(err)
                      })
                  })
                })
            })
          }
        )
      )
      .catch(err => {
        reject(err)
      })
  })
}
