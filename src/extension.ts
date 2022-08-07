/**
 * Add prefix to commit message based on pattern matching on branch name
 * The special case with multiple git repositories in a workspace is not handled - will use first repository found
 */

import * as vscode from "vscode";
import { API } from "./api/git";
import { getGitExtension, getCommitMsg, setCommitMsg } from "./gitExtension";

function _validateFoundRepos(git: API) {
	let msg = "";
	if (!git) {
		msg = "Unable to load Git Extension.";
	} else if (git.repositories.length === 0) {
		msg = "No git repository found. Please open a repository or run `git init` and try again.";
	}
	if (msg) {
		vscode.window.showErrorMessage(msg);
		throw new Error(msg);
	}
}

/**
 * Run auto prefix logic for the first repository in the workspace.
 */
function _handlePrefix(git: API) {
	let pattern = '^[^\\/]*\\/([a-zA-Z]+\\-\\d+).*';
	let pre = '';
	let post = '';
	let ensureSpace = true;
	const config = vscode.workspace.getConfiguration('autocommitmessageprefix');
	if (config.has('pattern')) {
		console.log('pattern', `'${config.get('pattern')}'`);
		const p = config.get('pattern')!;
		pattern = p && p.length > 0 ? p : pattern;
	}
	if (config.has('prefix')) {
		console.log('prefix', `'${config.get('prefix')}'`);
		const p = config.get('prefix')!;
		pre = p && p.length > 0 ? p : pre;
	}
	if (config.has('postfix')) {
		console.log('postfix', `'${config.get('postfix')}'`);
		const p = config.get('postfix')!;
		post = p && p.length > 0 ? p : post;
	}
	if (config.has('spaceafter')) {
		console.log('spaceafter', `'${config.get('spaceafter')}'`);
		ensureSpace = config.get('spaceafter')!;
	}

	const regex = new RegExp(pattern);
	const repository = git.repositories[0];
	const currentCommitMessage = getCommitMsg(repository);
	const branch = repository.state.HEAD?.name;
	console.log('branch...', branch);
	if (branch) {
		const found = branch.match(regex);
		if (found && found.length > 1) {
			const jira = found[1];
			console.log(jira);
			const msgPrefix = `${pre}${jira}${post}`;
			if (currentCommitMessage.startsWith(msgPrefix)) {
				console.log('prefix', `${msgPrefix} is aready prefix in commit message`);
			} else {
				const separator = ensureSpace && (msgPrefix.match(/\s+$/) === null) && (currentCommitMessage === currentCommitMessage.trimStart()) ? ' ' : '';
				console.log('separator', `'${separator}'`);
				setCommitMsg(repository, `${msgPrefix}${separator}${currentCommitMessage}`);
			}
		} else {
			console.log(`pattern '${regex}' not found or match group not defined`);
		}
	} else{
		console.log('no branch found');
	}
}

/**
 * Choose the git repository and apply auto prefix from branch.
 */
async function _chooseRepoForAutoPrefix() {
	const git = getGitExtension()!;  // ! return value is not undefined
	_validateFoundRepos(git);
	vscode.commands.executeCommand("workbench.view.scm");
	_handlePrefix(git);
}

export function activate(context: vscode.ExtensionContext) {
	console.log('extension "auto-commit-message-prefix" is now active!');

	const disposable = vscode.commands.registerCommand(
		"auto-commit-message-prefix.autoPrefix",
		_chooseRepoForAutoPrefix
	);

	context.subscriptions.push(disposable);
}

// extension has no deactivate code/logic
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }