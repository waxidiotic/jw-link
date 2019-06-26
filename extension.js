const vscode = require('vscode');
const jw = require('./service/mapi-service');
const views = require('./views');

// Constants
const JW_ROOT = `https://cdn.jwplayer.com`;
const JW_SINGLELINE_URI = `players`;
const JW_CLOUDHOSTED_URI = `libraries`;
const JW_MANIFEST_URI = `manifests`;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let savedKey;
    let savedSecret;
    let promptForCredentials;

    const configure =  () => {
        savedKey = context.globalState.get('jwApiKey');
        savedSecret = context.globalState.get('jwApiSecret');
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
                    if (!key || !secret) {
                        return vscode.window.showErrorMessage('JW Link: Failed to save credentials');
                    }
                    if (validateCredentialsLength(key, secret)) {
                        context.globalState.update('jwApiKey', key);
                        context.globalState.update('jwApiSecret', secret);
                        savedKey = key;
                        savedSecret = secret;
                        vscode.commands.executeCommand('jwLink.refresh');
                    } else {
                        vscode.window.showErrorMessage('JW Link: Credentials are invalid', 'Try Again').then(option => {
                            if (option === 'Try Again') {
                                vscode.commands.executeCommand('jwLink.configure');
                            }
                        });
                    }
                });
            }).catch((err) => {
                vscode.window.showErrorMessage('JW Link: Failed to save credentials', err);
            });
        };

        if (savedKey && savedSecret) {
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
        if (!savedKey && !savedSecret) {
            promptForCredentials();
        }
        jw.getPlayers(context);
        jw.getContent(context);
    };

    const generateSingleLineEmbed = () => {
        views.displayPlayers(context).then(playerChoice => {
            views.displayContent(context).then(contentChoice => {
                insertText(`${JW_ROOT}/${JW_SINGLELINE_URI}/${contentChoice.mediaid}-${playerChoice.pid}.js`);
            });
        });
    };

    const generateCloudHostedPlayerURI = () => {
        views.displayPlayers(context).then(playerChoice => {
            insertText(`${JW_ROOT}/${JW_CLOUDHOSTED_URI}/${playerChoice.pid}.js`);
        })
    };

    const generateHlsManifestURI = () => {
        views.displayContent(context).then(contentChoice => {
            insertText(`${JW_ROOT}/${JW_MANIFEST_URI}/${contentChoice.mediaid}.m3u8`);
        });
    };

    const insertText = (text) => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            editor.edit(edit => {
                edit.insert(editor.selection.active, text);
            })
        }
    };

    const validateCredentialsLength = (key, secret) => {
        return key.length === 8 && secret.length === 24;
    };

    vscode.commands.registerCommand('jwLink.configure', configure);
    vscode.commands.registerCommand('jwLink.refresh', refresh);
    vscode.commands.registerCommand('jwLink.singleLine', generateSingleLineEmbed);
    vscode.commands.registerCommand('jwLink.player', generateCloudHostedPlayerURI);
    vscode.commands.registerCommand('jwLink.content', generateHlsManifestURI);
    vscode.commands.registerCommand('jwLink.moreOptions', () => { views.moreOptions(context) });
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
