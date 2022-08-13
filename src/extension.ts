/**
 * Add prefix to commit message based on pattern matching on branch name
 * The special case with multiple git repositories in a workspace is not handled - will use first repository found
 */

import * as vscode from "vscode";
import { API } from "./api/git";
import { getGitExtension, getCommitMsg, setCommitMsg } from "./gitExtension";

/**
 * Run auto prefix logic for the first repository in the workspace.
 */
function _setCommitPrefix(git: API) {
	// helper to get default value or configuration overrides
	const config = vscode.workspace.getConfiguration('autocommitmessageprefix');
	function getValue(param:string, deflt:any): any {
		return config.has(param) && config.get(param) !== null ? config.get(param) : deflt;
	}
	const pattern:any = getValue('pattern', '^[^\\/]*\\/([a-zA-Z]+\\-\\d+).*');
	const pre:any = getValue('prefix', '');
	const post:any = getValue('postfix', '');
	const ensureSpace:any = getValue('spaceafter', true);
	
	// find pattern in branch name
	const regex = new RegExp(pattern);
	const repository = git.repositories[0];
	const currentCommitMessage = getCommitMsg(repository);
	const branch = repository.state.HEAD?.name;
	if (!branch) {
		console.log('no branch found');
		return;
	}
	const found = branch.match(regex);
	if (!found || found.length <  2) {
		console.log(`pattern '${pattern}' not found or match group not defined`);
		return;
	}
	const jira = found[1];
	const msgPrefix = `${pre}${jira}${post}`;
	if (currentCommitMessage.startsWith(msgPrefix)) {
		console.log('prefix', `${msgPrefix} is aready prefix in commit message`);
	} else {
		const separator = ensureSpace && (msgPrefix.match(/\s+$/) === null) && (currentCommitMessage === currentCommitMessage.trimStart()) ? ' ' : '';
		setCommitMsg(repository, `${msgPrefix}${separator}${currentCommitMessage}`);
	}
}

/**
 * Get the git repository and apply auto prefix from branch name.
 */
async function _getRepoAndSetCommitPrefix() {
	const git = getGitExtension()!;  // ! tell compiler return value is not undefined
	if (!(git?.repositories?.length > 0)) {
		const msg = "No git repository found. Please open a repository or run `git init` and try again.";
		vscode.window.showErrorMessage(msg);
		throw new Error(msg);
	}
	vscode.commands.executeCommand("workbench.view.scm");
	_setCommitPrefix(git);
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		"auto-commit-message-prefix.autoPrefix",
		_getRepoAndSetCommitPrefix
	);
	context.subscriptions.push(disposable);
}

// extension has no deactivate code/logic
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }