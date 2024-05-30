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
				delete tab.title
				delete tab.url
			}
			project.tabs = project.tabs.filter(tab => Object.keys(tab).length)
			if(!project.tabs.length)
				delete project.tabs

			for(let notes of project.notes) {
				console.log("### " + notes.title)
				for(let note of notes.notes) {
					if(!note.title)
						delete note.title
					if(!note.attachments.length)
						delete note.attachments

					console.log("#### " + note.title)
					if(!note.description)
						delete note.description
					else {
						for(let line of note.description.lines) {
							console.log(line)
						}
						delete note.description.lines
					}
					delete note.title
				}
				notes.notes = notes.notes.filter(note => Object.keys(note).length)
				if(!notes.notes.length)
					delete notes.notes
				delete notes.title
			}
			project.notes = project.notes.filter(note => Object.keys(note).length)

			if(!project.notes.length)
				delete project.notes
		}
	}
	const leftovers = JSON.stringify(data, null, "\t");
	fs.writeFileSync('./leftover.json', leftovers);
} catch (err) {
  console.error(err);
}
