// generate contributors.json for tidb-planet pages
const octokit = require('@octokit/rest')()
// https://github.com/octokit/rest.js

const key = process.env.GITHUB_OAUTH_CLIENT_ID
const secret = process.env.GITHUB_OAUTH_CLIENT_SECRET

console.log(key)
console.log(secret)

if(key && secret)
  octokit.authenticate({
    type: 'oauth',
    key,
    secret,
  })

const fs = require('fs')
const _ = require('lodash')

const repos = [
  'docs-cn',
  'docs',
  'grpc-rs',
  'jepsen',
  'parser',
  'pd',
  'tidb-ansible',
  'tidb-bench',
  'tidb-docker-compose',
  'tidb-operator',
  'tidb',
  'tidb-tools',
  'tikv',
  'tipb',
  'tispark'
]

const owner = 'pingcap'
const per_page = 100

const delay = (interval) => {
  return new Promise((resolve) => {
      setTimeout(resolve, interval);
  });
}

// fetch TiDB repository contributors
async function getRepoContributors(repo) {
  let all = []
  const result = await octokit.repos.getContributors({
    owner,
    repo,
    per_page
  })

  // await delay(2000)
  await inner(result)
  return all

  async function inner(result) {
    all = all.concat(result.data)

    if(octokit.hasNextPage(result)) {
      let _r = await octokit.getNextPage(result)
      await inner(_r)
    } else {
      console.log(`repo ${repo} contributors: ${all.length}`)
    }
  }
}

// generate each repository's created date
async function genRepoCreatedTime(repo) {
  // await delay(2000)
  const result = await octokit.repos.get({owner, repo})
  const { created_at } = result.data
  return created_at
}

async function main() {
  // const result = await octokit.misc.getRateLimit({})
  // console.log(result)
  let contributors = {}

  for(let r of repos) {
    const specRepoContributors = await getRepoContributors(r)
    const created_at = await genRepoCreatedTime(r)
    await genJSON(specRepoContributors, created_at)
  }

  const sortedList = _.sortBy(_.toArray(contributors), c => c.contributions)
  console.log('number of all contributors', sortedList.length)

  // write to file
  fs.writeFileSync('data/contributors.json', JSON.stringify(_.reverse(sortedList)), 'utf8')

  // generate contributors.json file
  async function genJSON(specRepoContributors, date) {
    specRepoContributors.forEach(c => {
      const { login, avatar_url, contributions } = c

      if(!contributors[login]) {
        contributors[login] = {
          login,
          avatar_url,
          contributions,
          date
        }
      } else {
        contributors[login].contributions += contributions
      }
    })
  }
}

main()
