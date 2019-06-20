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
    `${baseURL}/repos?direction=dsc&sort=created&per_page=100`
  )
  const starredReposPromise = axios.get(
    `${baseURL}/starred?direction=dsc&sort=created&per_page=100`
  )
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
            const promises1 = []
            const promises2 = []

            followers.data.forEach(f =>
              promises1.push(
                axios.get(`https://api.github.com/users/${f.login}`, {
                  headers
                })
              )
            )

            following.data.forEach(f =>
              promises2.push(
                axios.get(`https://api.github.com/users/${f.login}`, {
                  headers
                })
              )
            )

            axios.all(promises1).then(
              axios.spread((...responses) => {
                axios.all(promises2).then(
                  axios.spread((...responses2) => {
                    const followersArray = []
                    const followingArray = []

                    responses.map(res => followersArray.push(res.data))
                    responses2.map(res => followingArray.push(res.data))

                    resolve({
                      basicInfo: basicInfo.data,
                      allRepos: allRepos.data,
                      starredRepos: starredRepos.data,
                      followers: followersArray,
                      following: followingArray
                    })
                  })
                )
              })
            )
          }
        )
      )
      .catch(err => {
        reject(err)
      })
  })
}
