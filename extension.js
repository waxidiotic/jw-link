// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const kt = require('./service/kt-service');
const jw = require('./service/mapi-service');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	context.subscriptions.push(vscode.commands.registerCommand('jwLink.configure', () => {
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
        kt.addCredentials(key, secret);
        jw.getPlayers(key, secret);
      });
    }).catch((err) => {
      console.error(err); // eslint-disable-line no-console
    });
	}));
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
