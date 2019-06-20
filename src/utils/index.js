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
        scope: 'repo,read:org,user,user:follow'
      },
      (err, data) => {
        if (err) {
          reject(err)
        }
        console.log(data)
        resolve(data)
      }
    )
  })
}

export async function getUserProfile(username) {
  const baseURL = `https://api.github.com/users/${username}`
  const token = localStorage.getItem('github-token')
  const headers = { Authorization: `Bearer ${token}` }

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
            const promise1 = []
            const promise2 = []

            followers.data.forEach(f =>
              promise1.push(
                axios.get(`https://api.github.com/users/${f.login}`, {
                  headers
                })
              )
            )

            following.data.forEach(f =>
              promise2.push(
                axios.get(`https://api.github.com/users/${f.login}`, {
                  headers
                })
              )
            )

            axios.all(promise1).then(
              axios.spread((...responses) => {
                axios.all(promise2).then(
                  axios.spread((...response2) => {
                    const followersArray = []
                    const followingArray = []

                    responses.map(res => followersArray.push(res.data))
                    response2.map(res => followingArray.push(res.data))

                    // console.log(languagesArray)

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
