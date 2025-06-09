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
function getDetails()
{
  document.getElementById("userEmail").value = sessionStorage.getItem("userEmail");
  document.getElementById("grade").value = sessionStorage.getItem("grade");
  document.getElementById("phoneNumber").value = sessionStorage.getItem("phoneNumber");
}

// ✅ Check Role and Redirect
async function checkUserRoleAndRedirect(userEmail) {
  try {
  const docRef = db.collection('users').doc(userEmail);
  const doc = await docRef.get();
      sessionStorage.setItem("userEmail", userEmail);

    if (doc.exists) {     
      const role = doc.data().role;
      
      sessionStorage.setItem("userEmail", userEmail);
    
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

function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.querySelector('input[name="role"]:checked')?.value;
  const grade = document.getElementById("gradeField")?.value || null;
  const phoneNumber = document.getElementById("phoneNumber")?.value;

  if (!role) {
    document.getElementById("message").innerText = "Please select a role (student or teacher)";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return db.collection("users").doc(user.email).set({
        email: user.email,
        role: role,
        grade: role === 'student' ? grade : null,
        phoneNumber : phoneNumber,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      checkUserRoleAndRedirect(email);
    })
    .catch((err) => {
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
