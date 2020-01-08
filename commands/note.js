import shortid from 'shortid'

const saveNote = ({name, note, store}) => {
  let noteValue
  try {
    noteValue = JSON.parse(note)
  } catch (e) {
    noteValue = note
  }
  store.notes[name] = noteValue
  store.save()
  return {type: 'text', text: `Saved as ${JSON.stringify(name)}!`}
}

export default {
  commands: {
    add: {
      args: ['note'],
      help: 'add a note',
      run({args: {note}, store}) {
        const name = shortid()
        return saveNote({name, note, store})
      }
    },
    ls: {
      args: [],
      help: 'list notes',
      run({store, message}) {
        const notes = store.notes
        return {
          type: 'tree',
          name: 'notes',
          value: notes,
          state: {
            _expanded: true,
          },
          message,
        }
      }
    },
    rm: {
      args: ['id'],
      help: 'delete notes',
      run({args: {id}, store}) {
        delete store.notes[id]
        store.save()
        return {type: 'text', text: 'Deleted!'}
      }
    },
    save: {
      args: ['name', 'note'],
      help: 'save a note',
      run({args: {name, note}, store}) {
        return saveNote({name, note, store})
      }
    },
    show: {
      args: ['name'],
      help: 'show a note',
      run({store, message, args: {name}}) {
        const note = store.notes[name]
        return {
          type: 'tree',
          name,
          value: note,
          state: {
            _expanded: true,
          },
          message,
        }
      }
    },
  },
}
