// generate contributors.json for tidb-planet pages
const Octokit = require('@octokit/rest')
const octokit = Octokit()
const octokit2 = Octokit()
// const octokit = require('@octokit/rest')()
// https://github.com/octokit/rest.js


octokit.authenticate({
  type: 'token',
  token: '4e7ff6b3340782cabce2f2e87b2b970843bab063'
})

// use new token
octokit2.authenticate({
  type: 'token',
  token: '37abbd44c6a17a5c04111b599e616b76a2f7be58',
})






const fs = require('fs')
const _ = require('lodash')

const repos = ['docs', 'docs-cn', 'tidb', 'tikv', 'pd', 'tispark', 'tidb-operator']
// const repos = ['docs', 'docs-cn', 'tispark', 'tidb-operator']

const owner = 'pingcap'
const per_page = 100

// FIXME: GitHub REST API Issue: empty commit list
const omittedContributorsCommits = {
  liubin: { first_commit: { date: "2016-04-26", repo: 'tidb' } },
  buggithubs: { first_commit: {date: "2017-11-20", repo: 'tidb'}}
}

// fetch TiDB repository contributors
async function getRepoContributors(repo) {
  let all = []
  const result = await octokit.repos.getContributors({
    owner,
    repo,
    per_page})
  await delay(1000)
  await inner(result)
  return all

  async function inner(result) {
    all = all.concat(result.data)

    if(octokit.hasNextPage(result)) {
      let _r = await octokit.getNextPage(result)
      await inner(_r)
    } else {
      console.log(all.length)
    }
  }
}


// generate each contributor's first commit
async function genContributorFirstCommit(repo, author) {
  let first_commit = {}
  // use another octokit
  await delay(2000)
  const result = await octokit2.repos.getCommits({owner, repo, author, per_page})
  await innerCallback(result)
  return first_commit

  async function innerCallback(result) {
    let _res = result
    if(octokit.hasLastPage(result))
      _res = await octokit.getLastPage(result)

    if(_res.data.length) {
      const commit = _res.data[_res.data.length - 1].commit
      if(commit)
        first_commit = { date: commit.author.date, repo }
    }
  }
}


// get first commit date for each contributor
// https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795
async function processContributorsCommits (repo, list) {
  // map array to promises
  const promises = list.map(asyncGenCommit)
  // wait until all promises are resolved
  let commits = {}
  await Promise.all(promises)
  return commits

  async function asyncGenCommit(c) {
    const { login } = c
    const first_commit = await genContributorFirstCommit(repo, login) || ''
    if(!commits[login]) {
      commits[login] = first_commit
    }
  }
}

const delay = (interval) => {
  return new Promise((resolve) => {
      setTimeout(resolve, interval);
  });
};

async function main() {
  const result = await octokit.misc.getRateLimit({})
  const result2 = await octokit2.misc.getRateLimit({})
  console.log('rate limit', result)
  console.log('rate limit 2', result2)

  let contributors = {}

  for(let r of repos) {
    let commits= {}
    // contributorList = _.concat(contributorList, await getRepoContributors(i))
    const specRepoContributors = await getRepoContributors(r)
    console.log(`repo ${r} contributors: ${specRepoContributors.length}`)
    commits = await processContributorsCommits(r, specRepoContributors)
    // FIXME: add omitted contributors in tidb repo
    if(r === 'tidb')
      commits = Object.assign({}, commits, omittedContributorsCommits)
    console.log(`repo ${r} commits: ${commits}`)
    await genJSON(specRepoContributors, commits)
    await delay(5000)
  }

  console.log('all contributors', contributors)
  // write to file
  fs.writeFileSync('data/contributors.json', JSON.stringify(contributors), 'utf8')

  // generate contributors.json file
  async function genJSON(specRepoContributors, commits) {
    specRepoContributors.forEach(c => {
      const { login, avatar_url, contributions } = c

      if(!contributors[login]) {
        contributors[login] = {
          login,
          avatar_url,
          contributions,
          first_commit: commits[login]
        }
      } else {
        const { date } = commits[login]
        if(date < contributors[login].first_commit.date)
          contributors[login].first_commit = commits[login]
      }
    })
  }
}

main()
