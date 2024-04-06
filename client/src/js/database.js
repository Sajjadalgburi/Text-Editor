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

// function to update the text editor and store the val in dbs when user clicks out of it
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

// function to get all the notes form the database and serve them onto user
export const getDb = async () => {
  try {
    // Open the database
    const database = await openDB("jate", 1);

    // Start a transaction
    const tx = database.transaction("JATE-vault", "readonly");

    // Access the object store
    const store = tx.objectStore("JATE-vault");

    // Add content to the object store
    const request = store.getAll();

    // Wait for the operation to complete
    const results = await request;

    return results;
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error("Error adding content to database:", error);
    throw error;
  }
};

initdb();
