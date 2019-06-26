const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function displayPlayers(extensionContext) {
    const playersPath = path.join(extensionContext.globalStoragePath, 'players.json');
    const players = require(playersPath);
    const playersArray = [];
    players.forEach(player => {
        playersArray.push({
            label: player.name,
            description: `Version: ${player.version} | ID: ${player.key}`,
            pid: player.key
        })
    });
    return vscode.window.showQuickPick(playersArray);
}

function displayContent(extensionContext) {
    const contentPath = path.join(extensionContext.globalStoragePath, 'content.json');
    const content = require(contentPath);
    const contentArray = [];
    content.forEach(video => {
        contentArray.push({
            label: video.title,
            description: `ID: ${video.key}`,
            mediaid: video.key
        });
    });
    return vscode.window.showQuickPick(contentArray);
}

function moreOptions(extensionContext) {
    vscode.window.showQuickPick(['Remove API Credentials']).then(option => {
        if (option === 'Remove API Credentials') {
            extensionContext.globalState.update('jwApiKey', null);
            extensionContext.globalState.update('jwApiSecret', null);
            const playersPath = path.join(extensionContext.globalStoragePath, 'players.json');
            const contentPath = path.join(extensionContext.globalStoragePath, 'content.json');
            try {
                fs.unlinkSync(playersPath);
                fs.unlinkSync(contentPath);
            } catch (error) {
                vscode.window.showErrorMessage('JW Link: Could not delete saved list of players/content.');
            }

        }
        vscode.window.showInformationMessage(`JW Link: Credentials removed. Run 'Update Credentials' command to add new credentials.`);
    })
}

module.exports = {
    displayPlayers,
    displayContent,
    moreOptions
};
