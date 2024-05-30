const fs = require('node:fs');

try {
	const text = fs.readFileSync('./userData.json', 'utf8');
	const data = JSON.parse(text);
	for(let workspace of [...data.Workspaces, {workspaces: data["Archived Workspaces"], title: "Archived Workspaces"}]) {
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

					if(!note.description)
						delete note.description
					else {
						if(!note.description.isNoteContent)
							continue

						console.log("#### " + note.title)
						delete note.description.isNoteContent
						for(let line of note.description.lines) {
							console.log(line)
						}
						delete note.description.lines

						if(!Object.keys(note.description).length)
							delete note.description
						delete note.title
					}
				}
				removeEmptyList(notes, "notes")
				delete notes.title
			}
			removeEmptyList(project, "notes")
			for(let tasks of project.tasks) {
				removeEmptyList(tasks, "tasks")
				delete tasks.title
			}
			removeEmptyList(project, "tasks")
			for(let resources of project.resources) {
				removeEmptyList(resources, "resources")
				delete resources.title
			}
			removeEmptyList(project, "resources")
		}
	}
	const leftovers = JSON.stringify(data, null, "\t");
	fs.writeFileSync('./leftover.json', leftovers);
} catch (err) {
  console.error(err);
}

function removeEmptyList(obj, prop) {
	obj[prop] = obj[prop].filter(inner => Object.keys(inner).length)
	if(!obj[prop].length)
		delete obj[prop]

}
