import shortid from 'shortid'

const saveNote = ({ name, note, store }) => {
  let noteValue
  try {
    noteValue = JSON.parse(note)
  } catch (e) {
    noteValue = note
  }
  store.notes[name] = noteValue
  store.save()
  return { type: 'tree', name, value: noteValue }
}

export default {
  actions: {
    add: {
      params: ['note'],
      help: 'add a note',
      run({ params: { note }, store }) {
        const name = shortid()
        return saveNote({ name, note, store })
      },
    },
    ls: {
      params: [],
      help: 'list notes',
      run({ store, message }) {
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
      },
    },
    rm: {
      params: ['id'],
      help: 'delete notes',
      run({ params: { id }, store }) {
        delete store.notes[id]
        store.save()
        return { type: 'text', text: 'Deleted!' }
      },
    },
    set: {
      params: ['name', 'note'],
      help: 'save a note',
      run({ params: { name, note }, store }) {
        return saveNote({ name, note, store })
      },
    },
    get: {
      params: ['name'],
      help: 'show a note',
      run({ store, message, params: { name } }) {
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
      },
    },
  },
}
