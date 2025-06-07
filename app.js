// ✅ Initialize Firebase BEFORE using `auth` or `db`
const firebaseConfig = {
  apiKey: "AIzaSyBWSF-TDsIoZHlMLJjJXYPQ5pEcYed_F1I",
  authDomain: "homeworkhelp-a354d.firebaseapp.com",
  projectId: "homeworkhelp-a354d",
  appId: "1:276571213270:web:c24f7d39343cd7e366a877"
};

// ✅ Initialize App
firebase.initializeApp(firebaseConfig);

// ✅ Initialize Auth and Firestore (make sure this comes after initializeApp)
const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Check Role and Redirect
async function checkUserRoleAndRedirect(userEmail) {


  try {
    const docRef = firebase.firestore().collection('teachers').doc(userEmail);
    const doc = await docRef.get();

    if (doc.exists) {
     
      const role = doc.data().role;
      document.getElementById("userEmail").value = userEmail;
      if (role === 'teacher') {
        window.location.href = "teacher-dashboard.html";
      } else {
        window.location.href = "student-dashboard.html";
      }
    } else {
   
      window.location.href = "student-dashboard.html";
    }
  } catch (error) {
    alert("Error checking role: " + error.message);
  }
}

// ✅ Signup
function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      checkUserRoleAndRedirect(userCredential.user.email);
    })
    .catch(err => {
      document.getElementById("message").innerText = err.message;
    });
}

// ✅ Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      checkUserRoleAndRedirect(userCredential.user.email);
    })
    .catch(err => {
      document.getElementById("message").innerText = err.message;
    });
}

// ✅ Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
