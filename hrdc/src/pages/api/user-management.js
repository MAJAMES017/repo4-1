import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase-config";

export const USER_ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
};

export async function createUserProfile(user, role = USER_ROLES.EMPLOYEE) {
    try {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                role: role,
                createdAt: new Date(),
                isVerified: false
            });
        }
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
}

export async function getUserRole(userId) {
    try {
        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data().role : null;
    } catch (error) {
        console.error("Error getting user role:", error);
        return null;
    }
}

export async function updateUserRole(targetUserId, newRole) {
    try {
        const userRef = doc(firestore, 'users', targetUserId);
        await updateDoc(userRef, { role: newRole });
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
}

export async function getAllUsers() {
    try {
        const usersRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
}

export async function isAdmin(userId) {
    const role = await getUserRole(userId);
    return role === USER_ROLES.ADMIN;
}

export async function addAdminByEmail(adminEmail) {
    try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', adminEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            await updateDoc(doc(firestore, 'users', userDoc.id), {
                role: USER_ROLES.ADMIN
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error adding admin by email:", error);
        throw error;
    }
}