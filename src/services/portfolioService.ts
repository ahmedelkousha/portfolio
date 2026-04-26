import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const portfolioService = {
  // Generic get all from collection
  getAll: async (collectionName: string) => {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure the ID is a string and prioritize the Firestore document ID
      return { ...data, id: doc.id };
    });
  },

  // Generic update/create
  save: async (collectionName: string, id: any, data: any) => {
    try {
      const stringId = String(id);
      if (!stringId || stringId === "undefined" || stringId === "null") {
        throw new Error(`Invalid document ID: ${stringId}`);
      }
      
      // Clean data: Remove undefined values and ensure plain object
      const cleanData = JSON.parse(JSON.stringify(data));
      
      const docRef = doc(db, collectionName, stringId);
      await setDoc(docRef, cleanData, { merge: true });
    } catch (error: any) {
      console.error(`Firestore save error in ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  // Generic delete
  delete: async (collectionName: string, id: any) => {
    const stringId = String(id);
    const docRef = doc(db, collectionName, stringId);
    await deleteDoc(docRef);
  },

  // Generic get document data
  getDocData: async (collectionName: string, id: any) => {
    const stringId = String(id);
    const docRef = doc(db, collectionName, stringId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  // Specific for Personal Info (Single document)
  getPersonalInfo: async () => {
    return portfolioService.getDocData("metadata", "personalInfo");
  },

  // Save Contact Message
  saveMessage: async (data: any) => {
    try {
      const messageId = Date.now().toString();
      const messageData = {
        ...data,
        id: messageId,
        createdAt: new Date().toISOString(),
        read: false
      };
      return await portfolioService.save("messages", messageId, messageData);
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  }
};
