const axios = require('axios');
const jwApi = require('jwplayer-api');

const getPlayers = (extensionContext) => {
  const credentials = {
    key: extensionContext.globalState.get('jwApiKey'),
    secret: extensionContext.globalState.get('jwApiSecret')
  };

  if (credentials.key && credentials.secret) {
    const jwApiInstance = new jwApi({
      key: credentials.key,
      secret: credentials.secret
    });

    return axios({
      method: 'get',
      url: jwApiInstance.generateUrl('v1/players/list')
    }).then(res => {
      console.log(res.data.players); // eslint-disable-line no-console
    });
  } else {
    // error
  }

};

exports.getPlayers = getPlayers;
