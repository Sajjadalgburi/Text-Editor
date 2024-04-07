import { openDB } from "idb";

const initdb = async () => {
  try {
    const database = await openDB("jate", 1, {
      upgrade(db) {
        if (db.objectStoreNames.contains("jate")) {
          console.log("jate database already exists");
          return;
        }
        db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
        console.log("jate database created");
      },
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const putDb = async (content) => {
  try {
    const database = await openDB("jate", 1);
    const store = database.transaction("jate", "readwrite").objectStore("jate");
    await store.put({ content: content });
  } catch (error) {
    console.error("Error adding content to database:", error);
    throw error;
  }
};

export const getDb = async () => {
  try {
    const database = await openDB("jate", 1);
    const store = database.transaction("jate", "readonly").objectStore("jate");
    const results = await store.getAll();
    return results;
  } catch (error) {
    console.error("Error retrieving content from database:", error);
    throw error;
  }
};

initdb();
