/**
 * This is pretty much a copy of Michael Currin's gitExtension.ts file (MIT licensed)
 * from his auto-commit-message VS Code extension
 * See https://github.com/MichaelCurrin/auto-commit-msg
 */

import * as vscode from "vscode";
import { GitExtension, Repository } from "./api/git";

/**
 * Get the current commit message
 * 
 * @param repository the git repository to get message from
 * @returns the curent commit message (if null blank string is returned)
 */
export function getCommitMsg(repository: Repository): string {
    const currentMessage = repository.inputBox.value;
    return currentMessage ? currentMessage : '';
}

/**
 * Replace current commit message with new value
 * 
 * @param repository the git repository to set message in
 * @param msg new commit message
 */
export function setCommitMsg(repository: Repository, msg: string) {
    repository.inputBox.value = msg;
}

/**
 * 
 * @returns VS Code's built in Git extension
 */
export function getGitExtension() {
    const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
    const gitExtension = vscodeGit && vscodeGit.exports;
    return gitExtension && gitExtension.getAPI(1);
}