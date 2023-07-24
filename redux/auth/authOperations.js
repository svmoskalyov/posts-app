import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import app from "../../firebase/config";
import {
  updateUserProfile,
  authStateChange,
  authSingOut,
} from "../../redux/auth/authSlice";

export const authSingUpUser =
  ({ name, email, password, photo }) =>
  async (dispatch) => {
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      const { uid, displayName, photoURL } = await getAuth(app).currentUser;
      dispatch(
        updateUserProfile({
          userId: uid,
          name: displayName,
          photo: photoURL,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const authSingInUser =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      const { uid, displayName, photoURL } = await getAuth(app).currentUser;
      dispatch(
        updateUserProfile({
          userId: uid,
          name: displayName,
          photo: photoURL,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const authSingOutUser = () => async (dispatch) => {
  const auth = getAuth();
  await signOut(auth);
  dispatch(authSingOut());
};

export const authStateChangeUser = () => async (dispatch) => {
  const auth = getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        authStateChange({
          stateChange: true,
        })
      );
      dispatch(
        updateUserProfile({
          userId: user.uid,
          name: user.displayName,
          photo: user.photoURL,
        })
      );
    }
    // else {
    // User is signed out
    // ...
    // }
  });
};

export const authUpdatePhotoUser =
  ({ photo }) =>
  async (dispatch) => {
    const auth = getAuth();
    await updateProfile(auth.currentUser, {
      photoURL: photo,
    });
    dispatch(updateUserProfile({ photo }));
  };
