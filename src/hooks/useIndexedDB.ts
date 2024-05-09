function useIndexedDB() {
  function initDB(
    name: string,
    version: number,
    saveDB: (db: IDBDatabase) => void
  ) {
    const openRequest = indexedDB.open(name, version);
    openRequest.onsuccess = () => {
      saveDB(openRequest.result);
    };
  }

  return { initDB };
}

export default useIndexedDB;
