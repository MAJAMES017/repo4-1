import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { firestore } from "../../firebase-config";

export async function createPost(postData, userId) {
    try {
        // Add post to Firestore
        const postsRef = collection(firestore, 'posts');
        const postToSave = {
            title: postData.title,
            text: postData.text,
            authorId: userId,
            createdAt: new Date(),
        };

        const docRef = await addDoc(postsRef, postToSave);
        return { id: docRef.id, ...postToSave };
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

export async function getPosts() {
    try {
        const postsRef = collection(firestore, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function updatePost(postId, updatedData) {
    try {
        const postRef = doc(firestore, 'posts', postId);
        await updateDoc(postRef, updatedData);
        return true;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

export async function deletePost(postId) {
    try {
        const postRef = doc(firestore, 'posts', postId);
        await deleteDoc(postRef);
        return true;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}