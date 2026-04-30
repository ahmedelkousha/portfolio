import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import i18n from "i18next";

const t = (key: string) => i18n.t(key);

// ─── Bilingual field helper ───────────────────────────────────────────────────
// Given a Firestore document and a base field name (e.g. "title"),
// returns the value for the current language ("title_en" or "title_ar"),
// falling back to the other language if not available, then to the bare field.
export const localizeField = (
  doc: Record<string, any>,
  field: string,
  lang: string
): any => {
  const preferred = `${field}_${lang}`;
  const fallback = `${field}_${lang === "en" ? "ar" : "en"}`;
  return doc[preferred] ?? doc[fallback] ?? doc[field] ?? "";
};

// Localizes a full document: returns a new object where each bilingual field
// is resolved to the correct language value.
export const localizeDoc = (
  data: Record<string, any>,
  lang: string,
  bilingualFields: string[]
): Record<string, any> => {
  const result = { ...data };
  for (const field of bilingualFields) {
    result[field] = localizeField(data, field, lang);
  }
  return result;
};

// ─── Service ──────────────────────────────────────────────────────────────────
export const portfolioService = {
  // Generic get all from collection
  getAll: async (collectionName: string) => {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => {
      const data = d.data();
      return { ...data, id: d.id };
    });
  },

  // Generic update/create (merge)
  save: async (collectionName: string, id: any, data: any) => {
    try {
      const stringId = String(id);
      if (!stringId || stringId === "undefined" || stringId === "null") {
        throw new Error(`${t("admin.common.errors.invalidId")}: ${stringId}`);
      }
      const cleanData = JSON.parse(JSON.stringify(data));
      const docRef = doc(db, collectionName, stringId);
      await setDoc(docRef, cleanData, { merge: true });
    } catch (error: any) {
      console.error(`${t("admin.common.errors.firestoreSave")} in ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  // Generic delete
  delete: async (collectionName: string, id: any) => {
    const stringId = String(id);
    const docRef = doc(db, collectionName, stringId);
    await deleteDoc(docRef);
  },

  // Generic get single document
  getDocData: async (collectionName: string, id: any) => {
    const stringId = String(id);
    const docRef = doc(db, collectionName, stringId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  // Personal Info shorthand
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
        read: false,
      };
      return await portfolioService.save("messages", messageId, messageData);
    } catch (error) {
      console.error(t("admin.common.errors.saveMessage"), error);
      throw error;
    }
  },
};
