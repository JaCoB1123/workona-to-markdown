const fs = require('node:fs');

try {
	const text = fs.readFileSync('./userData.json', 'utf8');
	const data = JSON.parse(text);
	let markdown = "";
	for(let workspace of [...data.Workspaces, {workspaces: data["Archived Workspaces"], title: "Archived Workspaces"}]) {
		markdown += "# " + workspace.title + "\n";
		delete workspace.title

		for(let project of workspace.workspaces) {
			markdown += "## " + project.title + "\n";
			delete project.color
			delete project.title

			for(let tab of project.tabs) {
				markdown += "- [" + tab.title + "](" + tab.url + ")\n"
				delete tab.title
				delete tab.url
			}
			project.tabs = project.tabs.filter(tab => Object.keys(tab).length)
			if(!project.tabs.length)
				delete project.tabs

			for(let notes of project.notes) {
				let notesText = "";
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

						notesText += "#### " + note.title + "\n"
						delete note.description.isNoteContent
						for(let line of note.description.lines) {
							notesText += line + "\n"
						}
						delete note.description.lines

						if(!Object.keys(note.description).length)
							delete note.description
						delete note.title
					}
				}

				if(notesText) {
					markdown += "### " + notes.title + "\n" + notesText;
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
		removeEmptyList(workspace, "workspaces")
	}
	removeEmptyList(data, "Workspaces")
	removeEmptyList(data, "Archived Workspaces")

	fs.writeFileSync('./result.md', markdown);

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
