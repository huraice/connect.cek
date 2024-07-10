// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6IXHqc7dK7qXLc8Hg7AMctcC5u2r0T-o",
    authDomain: "alumini-app-4c93b.firebaseapp.com",
    projectId: "alumini-app-4c93b",
    storageBucket: "alumini-app-4c93b.appspot.com",
    messagingSenderId: "546053548821",
     appId: "1:546053548821:web:12af4e4c33dbed7163d71c",
     measurementId: "G-D292WKX6BS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sign Up
// Initialize Firebase


// Render Menu Bar
const renderMenuBar = (user) => {
    const menuBar = document.getElementById('menu-bar');
    if (!menuBar) return;

    let menuHTML;
    if (user) {
        menuHTML = `
            <nav>
                <a href="index.html">Home</a>
                <a href="profile.html">Profile</a>
                <a href="settings.html">Settings</a>
                <a href="messages.html">Messages</a>
                <a href="#" id="logout">Logout</a>
            </nav>
        `;
    } else {
        menuHTML = `
            <nav>
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="contact.html">Contact Us</a>
            </nav>
        `;
    }
    menuBar.innerHTML = menuHTML;

    // Attach logout event if user is logged in
    if (user) {
        document.getElementById('logout').addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                window.location = 'index.html';
            });
        });
    }
};

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    renderMenuBar(user);
    if (user) {
        loadProfile(user.uid);
    }
});

// Sign Up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                window.location = 'profile.html';
            })
            .catch(error => {
                console.error(error.message);
            });
    });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                window.location = 'home.html';
            })
            .catch(error => {
                console.error(error.message);
            });
    });
}

// Profile
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const role = document.getElementById('profile-role').value;
        const user = auth.currentUser;
        
        let profileData = { name, role, verified: false };
        
        if (role === 'alumni') {
            profileData.branch = document.getElementById('alumni-branch').value;
            profileData.organization = document.getElementById('alumni-org').value;
            profileData.jobRole = document.getElementById('alumni-role').value;
            profileData.passoutYear = document.getElementById('alumni-year').value;
        } else if (role === 'student') {
            profileData.branch = document.getElementById('student-branch').value;
            profileData.admissionId = document.getElementById('student-id').value;
        }
        
        db.collection('profiles').doc(user.uid).set(profileData)
            .then(() => {
                window.location = 'home.html';
            })
            .catch(error => {
                console.error(error.message);
            });
    });

    document.getElementById('profile-role').addEventListener('change', (e) => {
        if (e.target.value === 'alumni') {
            document.getElementById('alumni-fields').style.display = 'block';
            document.getElementById('student-fields').style.display = 'none';
        } else if (e.target.value === 'student') {
            document.getElementById('alumni-fields').style.display = 'none';
            document.getElementById('student-fields').style.display = 'block';
        } else {
            document.getElementById('alumni-fields').style.display = 'none';
            document.getElementById('student-fields').style.display = 'none';
        }
    });
}

// Forgot Password
const forgotPasswordForm = document.getElementById('forgot-password-form');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-password-email').value;
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert('Password reset email sent.');
                window.location = 'login.html';
            })
            .catch(error => {
                console.error(error.message);
                alert('Error: ' + error.message);
            });
    });
}
const loadProfile = (userId) => {
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const alumniInfo = document.getElementById('alumni-info');
    const studentInfo = document.getElementById('student-info');

    db.collection('profiles').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                profileName.textContent = data.name;
                profileRole.textContent = data.role;

                if (data.role === 'alumni') {
                    alumniInfo.style.display = 'block';
                    studentInfo.style.display = 'none';
                    document.getElementById('alumni-branch').textContent = data.branch || '';
                    document.getElementById('alumni-org').textContent = data.organization || '';
                    document.getElementById('alumni-role').textContent = data.jobRole || '';
                    document.getElementById('alumni-year').textContent = data.passoutYear || '';
                } else if (data.role === 'student') {
                    studentInfo.style.display = 'block';
                    alumniInfo.style.display = 'none';
                    document.getElementById('student-branch').textContent = data.branch || '';
                    document.getElementById('student-id').textContent = data.admissionId || '';
                }
            }
        })
        .catch(error => console.error("Error getting profile: ", error));
};

// Edit Profile
const editBtn = document.getElementById('edit-btn');
const editProfileForm = document.getElementById('edit-profile-form');
const editAlumniInfo = document.getElementById('edit-alumni-info');
const editStudentInfo = document.getElementById('edit-student-info');

if (editBtn) {
    editBtn.addEventListener('click', () => {
        document.getElementById('profile-info').style.display = 'none';
        document.getElementById('edit-profile').style.display = 'block';
    });
}

if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('edit-name').value;
        const role = document.getElementById('edit-role').value;
        const user = auth.currentUser;

        let updatedProfileData = { name, role };
        
        if (role === 'alumni') {
            updatedProfileData.branch = document.getElementById('edit-alumni-branch').value;
            updatedProfileData.organization = document.getElementById('edit-alumni-org').value;
            updatedProfileData.jobRole = document.getElementById('edit-alumni-role').value;
            updatedProfileData.passoutYear = document.getElementById('edit-alumni-year').value;
        } else if (role === 'student') {
            updatedProfileData.branch = document.getElementById('edit-student-branch').value;
            updatedProfileData.admissionId = document.getElementById('edit-student-id').value;
        }
        
        db.collection('profiles').doc(user.uid).update(updatedProfileData)
            .then(() => {
                alert('Profile updated successfully.');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating profile: ', error);
                alert('Error updating profile.');
            });
    });

    document.getElementById('edit-role').addEventListener('change', (e) => {
        if (e.target.value === 'alumni') {
            editAlumniInfo.style.display = 'block';
            editStudentInfo.style.display = 'none';
        } else if (e.target.value === 'student') {
            editAlumniInfo.style.display = 'none';
            editStudentInfo.style.display = 'block';
        } else {
            editAlumniInfo.style.display = 'none';
            editStudentInfo.style.display = 'none';
        }
    });
}
const loadHomePage = (user) => {
    const userName = document.getElementById('user-name');
    const verificationStatus = document.getElementById('verification-status');
    const recentPosts = document.getElementById('recent-posts');
    const postsList = document.getElementById('posts-list');
    const connectPanel = document.getElementById('connect-panel');

    // Display user's name and verification status
    db.collection('profiles').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                userName.textContent = data.name;
                verificationStatus.textContent = data.verified ? 'Verified' : 'Not Verified';

                // Show recent posts if verified
                if (data.verified) {
                    recentPosts.style.display = 'block';
                    displayRecentPosts();
                } else {
                    recentPosts.style.display = 'none';
                }
                
                // Display connect panel
                connectPanel.style.display = 'block';
            }
        })
        .catch(error => console.error("Error getting profile: ", error));
};

// Display Recent Posts
const displayRecentPosts = () => {
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = ''; // Clear previous posts

    db.collection('posts').orderBy('timestamp', 'desc').limit(5).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const post = doc.data();
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <p><small>Posted on ${new Date(post.timestamp.seconds * 1000).toLocaleDateString()}</small></p>
                `;
                postsList.appendChild(postElement);
            });
        })
        .catch(error => console.error("Error getting posts: ", error));
};

// Search Users
const searchUsers = () => {
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const recommendedUsers = document.getElementById('recommended-users');

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchBar.value.toLowerCase();
        recommendedUsers.innerHTML = ''; // Clear previous recommendations

        db.collection('profiles').where('name', '>=', searchTerm).where('name', '<=', searchTerm + '\uf8ff').get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const user = doc.data();
                    const userElement = document.createElement('div');
                    userElement.innerHTML = `
                        <p>${user.name}</p>
                    `;
                    recommendedUsers.appendChild(userElement);
                });
            })
            .catch(error => console.error("Error searching users: ", error));
    });
};

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    renderMenuBar(user);
    if (user) {
        loadHomePage(user);
        searchUsers();
    }
});