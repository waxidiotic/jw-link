const vscode = require('vscode');
const jw = require('./service/mapi-service');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const globalState = context.globalState;

    const registerConfigureCommand = vscode.commands.registerCommand('jwLink.configure', () => {
        const promptForCredentials = () => {
            vscode.window.showInputBox({
                prompt: 'Enter the API key for the property you would like to configure',
                placeHolder: 'API key',
                ignoreFocusOut: true,
            }).then((key) => {
                // Prompt for secret and then add both to keychain
                vscode.window.showInputBox({
                    prompt: `Enter the API secret for ${key}`,
                    placeholder: 'API secret',
                    ignoreFocusOut: true,
                }).then((secret) => {
                    context.globalState.update('jwApiKey', key);
                    context.globalState.update('jwApiSecret', secret);
                    jw.getPlayers(context);
                });
            }).catch((err) => {
                console.error(err); // eslint-disable-line no-console
            });
        };

        const key = globalState.get('jwApiKey');
        const secret = globalState.get('jwApiSecret');

        if (key && secret) {
            vscode.window.showInformationMessage('Your API credentials are already saved.', 'Update Credentials').then(option => {
                if (option === 'Update Credentials') {
                    promptForCredentials();
                }
            });
        } else {
            promptForCredentials();
        }
    });

    context.subscriptions.push(registerConfigureCommand);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
