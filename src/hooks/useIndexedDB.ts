function useIndexedDB() {
  function initIndexedDB(
    name: string,
    version: number,
    objectStoreName: string,
    saveDB: (db: IDBDatabase) => void
  ) {
    const openRequest = indexedDB.open(name, version);
    openRequest.onsuccess = () => {
      saveDB(openRequest.result);
    };
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      // note: createObjectStore can only be used inside onupgradeneeded event.
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      saveDB(db);
    };
  }

  function transactReadOnly(
    db: IDBDatabase,
    storeName: string,
    index: string | null | undefined,
    successCallback: (result: any) => void,
    errorCallback: (error: any) => void
  ) {
    let request = null;
    const transaction = db.transaction(storeName, "readonly");
    const objectStore = transaction.objectStore(storeName);
    if (index != null) {
      const rowsIndex = objectStore.index(index);
      request = rowsIndex.getAll(); // todo: use cursor
    } else {
      request = objectStore.getAll(); // todo: use cursor
    }
    request.onsuccess = () => {
      successCallback(request.result);
    };
    request.onerror = () => {
      errorCallback(request.error);
    };
  }

  function transactAdd(
    db: IDBDatabase,
    storeName: string,
    data: object,
    successCallback: (result: any) => void,
    errorCallback: (error: any) => void
  ) {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const objectStoreRequest = objectStore.put(data);
    objectStoreRequest.onsuccess = () => {
      successCallback(objectStoreRequest.result);
    };
    objectStoreRequest.onerror = () => {
      errorCallback(objectStoreRequest.error);
    };
  }

  function transactDelete(
    db: IDBDatabase,
    storeName: string,
    key: number | string
  ) {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(key);
  }

  return {
    initIndexedDB,
    transactReadOnly,
    transactAdd,
    transactDelete,
  };
}

export default useIndexedDB;
