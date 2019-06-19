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
  const allReposPromise = axios.get(
    `${baseURL}/repos?direction=desc&sort=created&limit=50`
  )
  const starredReposPromise = axios.get(`${baseURL}/starred`)

  // new requests
  //const languagesPromise = axios.get(`https://api.github.com/repos/${username}/${reponame}/languages`)
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
            // const obj = {}
            // const promises1 = []
            // const promises2 = []

            // followers.data.map(follower =>
            //   promises1.push(
            //     axios.get(`https://api.github.com/users/${follower.login}`)
            //   )
            // )

            // following.data.map(_following =>
            //   promises2.push(
            //     axios.get(`https://api.github.com/users/${_following.login}`)
            //   )
            // )

            const f1 = []
            const f2 = []

            followers.data.forEach(follower => {
              axios
                .get(`https://api.github.com/users/${follower.login}`)
                .then(res => {
                  f1.push(res.data)
                  return f1
                })
                .then(res2 => {
                  following.data.forEach(_following => {
                    axios
                      .get(`https://api.github.com/users/${_following.login}`)
                      .then(res3 => {
                        f2.push(res3.data)
                        resolve({
                          basicInfo: basicInfo.data,
                          allRepos: allRepos.data,
                          starredRepos: starredRepos.data,
                          followers: f1,
                          following: f2
                        })
                      })
                      .catch(err => {
                        console.log(err)
                      })
                  })
                })
            })

            // axios
            //   .all([followersPromise, followingPromise], {
            //     headers
            //   })
            //   .then(
            //     axios.spread((f1, f2) => {
            //       console.log(f1.data)
            //       resolve({
            //         basicInfo: basicInfo.data,
            //         allRepos: allRepos.data,
            //         starredRepos: starredRepos.data,
            //         followers: followers.data,
            //         following: following.data
            //       })
            //     })
            //   )
            //   .catch(err => {
            //     return reject(err)
            //   })
          }
        )
      )
      .catch(err => {
        reject(err)
      })
  })
}

async function getFollowInfo(follower) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.github.com/users/${follower.login}`)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
