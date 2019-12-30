import shortid from 'shortid'

export default {
  commands: {
    add: {
      args: ['note'],
      help: 'add a note',
      run({args: {note}, store}) {
        const id = shortid()
        store.notes[id] = note
        store.save()
        return {type: 'text', text: `Saved as "${id}"!`}
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
    }
  },
}
