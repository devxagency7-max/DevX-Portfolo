import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Project, Category } from '../types/project';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';
import { DEFAULT_CATEGORIES } from '../data/defaultCategories';

const PROJECTS_COLLECTION = 'projects';
const CATEGORIES_COLLECTION = 'categories';

let seedingPromise: Promise<void> | null = null;

/** Seeds Firestore with the sample dataset and ensures default projects are populated. */
const ensureSeeded = async (): Promise<void> => {
  if (!seedingPromise) {
    seedingPromise = (async () => {
      try {
        const [projectsSnap, categoriesSnap] = await Promise.all([
          getDocs(collection(db, PROJECTS_COLLECTION)),
          getDocs(collection(db, CATEGORIES_COLLECTION))
        ]);

        const batch = writeBatch(db);
        let needsCommit = false;

        if (projectsSnap.empty) {
          SAMPLE_PROJECTS.forEach(project => {
            batch.set(doc(db, PROJECTS_COLLECTION, project.id), project);
          });
          needsCommit = true;
        } else {
          // Sync any new sample projects that aren't in Firestore yet
          const existingIds = new Set(projectsSnap.docs.map(d => d.id));
          SAMPLE_PROJECTS.forEach(project => {
            if (!existingIds.has(project.id)) {
              batch.set(doc(db, PROJECTS_COLLECTION, project.id), project);
              needsCommit = true;
            }
          });
        }

        if (categoriesSnap.empty) {
          DEFAULT_CATEGORIES.forEach(category => {
            batch.set(doc(db, CATEGORIES_COLLECTION, category.id), category);
          });
          needsCommit = true;
        } else {
          const existingCatIds = new Set(categoriesSnap.docs.map(d => d.id));
          DEFAULT_CATEGORIES.forEach(cat => {
            if (!existingCatIds.has(cat.id)) {
              batch.set(doc(db, CATEGORIES_COLLECTION, cat.id), cat);
              needsCommit = true;
            }
          });
        }

        if (needsCommit) {
          await batch.commit();
        }
      } catch (err) {
        console.warn('Firestore seeding warning:', err);
      }
    })();
  }
  return seedingPromise;
};

export const getStoredProjects = async (): Promise<Project[]> => {
  await ensureSeeded();
  const snap = await getDocs(collection(db, PROJECTS_COLLECTION));
  return snap.docs.map(d => d.data() as Project);
};

export const saveProject = async (project: Project): Promise<void> => {
  await setDoc(doc(db, PROJECTS_COLLECTION, project.id), project);
};

export const deleteProjectDoc = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
};

export const getStoredCategories = async (): Promise<Category[]> => {
  await ensureSeeded();
  const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return snap.docs.map(d => d.data() as Category);
};

export const saveCategory = async (category: Category): Promise<void> => {
  await setDoc(doc(db, CATEGORIES_COLLECTION, category.id), category);
};

export const deleteCategoryDoc = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
};

export const resetStorageToDefaults = async (): Promise<{ projects: Project[]; categories: Category[] }> => {
  const batch = writeBatch(db);
  SAMPLE_PROJECTS.forEach(project => batch.set(doc(db, PROJECTS_COLLECTION, project.id), project));
  DEFAULT_CATEGORIES.forEach(category => batch.set(doc(db, CATEGORIES_COLLECTION, category.id), category));
  await batch.commit();
  return { projects: SAMPLE_PROJECTS, categories: DEFAULT_CATEGORIES };
};
