const vscode = require('vscode');
const axios = require('axios');
const jwApi = require('jwplayer-api');
const fs = require('fs');
const path = require('path');

const getPlayers = (extensionContext) => {
    const credentials = {
        key: extensionContext.globalState.get('jwApiKey'),
        secret: extensionContext.globalState.get('jwApiSecret')
    };

    const playersPath = path.join(extensionContext.globalStoragePath, 'players.json');

    fs.mkdir(extensionContext.globalStoragePath, err => {
        if (err & err.code !== 'EEXIST') {
            console.error(err); // eslint-disable-line no-console
        }
    });

    if (credentials.key && credentials.secret) {
        const jwApiInstance = new jwApi({
            key: credentials.key,
            secret: credentials.secret
        });

        return axios({
            method: 'get',
            url: jwApiInstance.generateUrl('v1/players/list')
        }).then(res => {
            fs.writeFile(playersPath, JSON.stringify(res.data.players), err => {
                if (err) {
                    console.error(err); // eslint-disable-line no-console
                    return vscode.window.showErrorMessage('Failed to save players');
                }
                vscode.window.showInformationMessage('Saved players');
            })
        });
    } else {
    // error
    }

};

exports.getPlayers = getPlayers;
