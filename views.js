const vscode = require('vscode');
const path = require('path');

function displayPlayers(extensionContext) {
    const playersPath = path.join(extensionContext.globalStoragePath, 'players.json');
    const players = require(playersPath);
    const playersArray = [];
    players.forEach(player => {
        playersArray.push({
            label: player.name,
            description: `Version: ${player.version} | ID: ${player.key}`
        })
    });
    vscode.window.showQuickPick(playersArray);
}

function displayContent(extensionContext) {
    const contentPath = path.join(extensionContext.globalStoragePath, 'content.json');
    const content = require(contentPath);
    const contentArray = [];
    content.forEach(video => {
        contentArray.push({
            label: video.title,
            description: `ID: ${video.key}`
        });
    });
    vscode.window.showQuickPick(contentArray);
}

module.exports = {
    displayPlayers,
    displayContent
};
