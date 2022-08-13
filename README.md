# Auto Commit Message Prefix
A VS Code extension to extract substring from git branch name (e.g., Jira issue) and insert it as prefix to commit message.

## Features

Click the extension's **button** in the Git pane will add a substring from the branch name as prefix in the commit message input field. The default regular expression used to find the substring uses the pattern in Bitbucket/Jira branch names to extract the Jira issue identifier.
* Commit message for branch "feature/JIRA-42-abc" will get "JIRA-42 " as prefix when the extensions Git pane button is clicked and the default configuration is used.

## Extension Settings

This extension contributes the following settings:

* `autocommitmessageprefix.pattern`: Used to override the default regular expression used for matching substring in branch name.
* `autocommitmessageprefix.prefix`: Fixed prefix text (default '') added in front of the matched text from the branch name.
* `autocommitmessageprefix.postfix`: Fixed postfix text (default '') added after the matched text from the branch name.
* `autocommitmessageprefix.spaceafter`: If true (default) the extension will insert a space if there is no whitespace between prefix and commit message.

## Installation

Go to the Marketplace link below and click the _Install_ button.

<div align="center">
[VS Code Marketplace - Auto Commit Message Prefix](https://marketplace.visualstudio.com/items?itemName=prandsen.auto-commit-message-prefix)
</div>

## Usage

1. Open a VS Code project which is a Git repository.
1. Edit one or more files and stage them.
1. In VS Code's Git pane, click the Auto Commit Message Prefix icon.
1. The extension will create a prefix for the commit message for you in the commit message box.
1. Add your commit message (the message can also be edited before you click the Auto Commit Message Prefix icon).
1. Commit - click the tick symbol button, or use the keyboard shortcut <kbd>Control</kbd>+<kbd>Enter</kbd> / <kbd>CMD</kbd>+<kbd>Enter</kbd>.

## License

Released under [MIT](/LICENSE) by [@Peter Frandsen](https://github.com/pfrandsen).

See [Credit](/docs/credit.md) for information about projects that was use as inspiration for this extension.