const axios = require('axios');
const jwApi = require('jwplayer-api');

// const jwApiInstance = new jwApi({
//   key: '',
//   secret: ''
// });

const getPlayers = (key, secret) => {
  const jwApiInstance = new jwApi({key, secret});

  return axios({
    method: 'get',
    url: jwApiInstance.generateUrl('v1/players/list')
  }).then(res => {
    console.log(res.data.players); // eslint-disable-line no-console
  });
};

exports.getPlayers = getPlayers;
