const axios = require('axios');
const qs = require('qs');

module.exports.import = (req, res) => {

  const REDCAP_DATA_CONTENT = 'record'
  const REDCAP_DATA_FORMAT = 'json'
  const REDCAP_DATA_TYPE = 'flat'
  const REDCAP_DATA_FORCE_AUTO_NUMBER = 'true'

  // TODO decouple server from com.vue.pubmed.program_pmi
  // TODO create Dockerfile command to invoke node independent of npm package.json

  // TODO create forks of zotero server, citeproc
  // TODO create dockers for all service
  // TODO create docker-compose.yml
  // TODO use environment variables in docker-compose for necessary containers
  // TODO push all repos to github
  // TODO write documentation
  // TODO deploy

  const REDCAP_REQUEST = qs.stringify({
    token: process.env.REDCAP_API_TOKEN,
    content: REDCAP_DATA_CONTENT,
    format: REDCAP_DATA_FORMAT,
    type: REDCAP_DATA_TYPE,
    forceAutoNumber: REDCAP_DATA_FORCE_AUTO_NUMBER,
    data: JSON.stringify(req.body)
  })

  console.log('REDCAP_REQUEST', REDCAP_REQUEST)
  axios.post(process.env.REDCAP_API_URL, REDCAP_REQUEST)
    .then(() => {
      return res.status(201).json({ err: false, message: 'Record successfully imported to RedCap' })
    })
    .catch(err => {
      return res.status(500).json({ err: true, message: 'ERROR: Record cannot be imported to RedCap' })
    })
};