import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase-config";

export const USER_ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
};

export async function createUserProfile(user, role = USER_ROLES.EMPLOYEE) {
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        role: role,
        createdAt: new Date()
    });
}

export async function getUserRole(userId) {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data().role : null;
}

export async function updateUserRole(targetUserId, newRole) {
    const userRef = doc(firestore, 'users', targetUserId);
    await updateDoc(userRef, { role: newRole });
}

export async function getAllUsers() {
    const usersRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function isAdmin(userId) {
    const role = await getUserRole(userId);
    return role === USER_ROLES.ADMIN;
}