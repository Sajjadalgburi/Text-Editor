import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

export const putDb = async (content) => {
  try {
    // Open the database
    const database = await openDB("jate", 1);

    // Start a transaction
    const tx = database.transaction("JATE-vault", "readwrite");

    // Access the object store
    const store = tx.objectStore("JATE-vault");

    // Add content to the object store
    const request = store.put({ content: content });

    // Wait for the operation to complete
    const results = await request;

    return results;
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error("Error adding content to database:", error);
    throw error;
  }
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => console.error("getDb not implemented");

initdb();
