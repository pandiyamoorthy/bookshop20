import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

class ProfileService {
  constructor(userId) {
    this.userId = userId;
    this.profileRef = doc(db, 'userProfiles', userId);
  }

  async getProfile() {
    try {
      const profileDoc = await getDoc(this.profileRef);
      if (profileDoc.exists()) {
        return profileDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(profileData) {
    try {
      await setDoc(this.profileRef, profileData, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  async createProfile(profileData) {
    try {
      const profile = {
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(this.profileRef, profile);
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  }
}

export default ProfileService;