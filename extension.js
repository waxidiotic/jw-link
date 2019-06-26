const vscode = require('vscode');
const jw = require('./service/mapi-service');
const views = require('./views');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const globalState = context.globalState;
    const key = globalState.get('jwApiKey');
    const secret = globalState.get('jwApiSecret');
    let promptForCredentials;

    const configure =  () => {
        promptForCredentials = () => {
            vscode.window.showInputBox({
                prompt: 'Enter the API key for the property you would like to configure',
                placeHolder: 'API key',
                ignoreFocusOut: true,
            }).then((key) => {
                // Prompt for secret and then add both to global state
                vscode.window.showInputBox({
                    prompt: `Enter the API secret for ${key}`,
                    placeholder: 'API secret',
                    ignoreFocusOut: true,
                }).then((secret) => {
                    context.globalState.update('jwApiKey', key);
                    context.globalState.update('jwApiSecret', secret);
                });
            }).catch((err) => {
                vscode.window.showErrorMessage('JW Link: Failed to save credentials', err);
            });
            vscode.commands.executeCommand('jwLink.refresh');
        };

        if (key && secret) {
            vscode.window.showInformationMessage(
                'JW Link: Your API credentials are already saved.', // message
                'Update Credentials' // button
            ).then(option => {
                if (option === 'Update Credentials') {
                    promptForCredentials();
                }
            });
        } else {
            promptForCredentials();
        }
    };

    const refresh = () => {
        if (!key && !secret) {
            promptForCredentials();
        }
        jw.getPlayers(context);
        jw.getContent(context);
    };

    const generateSingleLineEmbed = () => {
        views.displayPlayers(context).then(playerChoice => {
            views.displayContent(context).then(contentChoice => {
                insertText(`https://cdn.jwplayer.com/players/${playerChoice.pid}-${contentChoice.mediaid}.js`);
            });
        });
    };

    const insertText = (text) => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            editor.edit(edit => {
                edit.insert(vscode.window.activeTextEditor.selection.active, text);
            })
        }
    };

    vscode.commands.registerCommand('jwLink.configure', () => configure());
    vscode.commands.registerCommand('jwLink.refresh', () => refresh());
    vscode.commands.registerCommand('jwLink.showPlayers', () => views.displayPlayers(context));
    vscode.commands.registerCommand('jwLink.showContent', () => views.displayContent(context));
    vscode.commands.registerCommand('jwLink.singleLine', () => generateSingleLineEmbed());
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
