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
