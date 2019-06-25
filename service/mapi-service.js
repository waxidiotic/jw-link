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

    // Create folder for extension data
    fs.mkdir(extensionContext.globalStoragePath, err => {
        // Only throw errors other than if folder already exists
        if (err & err.code !== 'EEXIST') {
            vscode.window.showErrorMessage('JW Link: Failed to create extension folder');
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
                    return vscode.window.showErrorMessage('JW Link: Failed to save players');
                }
                vscode.window.showInformationMessage('JW Link: Saved players');
            })
        });
    } else {
    // error
    }

};

exports.getPlayers = getPlayers;
