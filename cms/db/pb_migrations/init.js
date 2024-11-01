migrate(
  db => {
    const snapshot = []

    const collections = snapshot.map(item => new Collection(item))

    return Dao(db).importCollections(collections, true, null)
  },
  db => {
    return null
  }
)
