const fs = require('node:fs');

try {
	const text = fs.readFileSync('./userData.json', 'utf8');
	const data = JSON.parse(text);
	for(let workspace of data.Workspaces) {
		console.log("# " + workspace.title);
		for(let project of workspace.workspaces) {
			console.log("## " + project.title);

			for(let tab of project.tabs) {
				console.log("- [" + tab.title + "](" + tab.url + ")")
			}
		}
	}
} catch (err) {
  console.error(err);
}
