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
	let pattern:any = '^[^\\/]*\\/([a-zA-Z]+\\-\\d+).*';
	let pre:any = '';
	let post:any = '';
	let ensureSpace:any = true;
	const config = vscode.workspace.getConfiguration('autocommitmessageprefix');
	if (config.has('pattern')) {
		pattern = config.get('pattern') !== null ? config.get('pattern') : pattern;
	}
	if (config.has('prefix')) {
		pre = config.get('prefix') !== null ? config.get('prefix') : pre;
	}
	if (config.has('postfix')) {
		post = config.get('postfix') !== null ? config.get('postfix') : post;
	}
	if (config.has('spaceafter')) {
		ensureSpace = config.get('spaceafter') !== null ? config.get('spaceafter') : true;
	}

	const regex = new RegExp(pattern);
	const repository = git.repositories[0];
	const currentCommitMessage = getCommitMsg(repository);
	const branch = repository.state.HEAD?.name;
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
 * Choose the git repository and apply auto prefix from branch name.
 */
async function _chooseRepoForAutoPrefix() {
	const git = getGitExtension()!;  // ! tell compiler return value is not undefined
	_validateFoundRepos(git);
	vscode.commands.executeCommand("workbench.view.scm");
	_handlePrefix(git);
}

export function activate(context: vscode.ExtensionContext) {
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