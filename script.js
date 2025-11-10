// Elements
const themeToggleBtn = document.getElementById("theme-toggle");
const copyBtn = document.getElementById("copy-link-btn");
const shareLink = document.getElementById("share-link");
const qrContainer = document.getElementById("qr-code");

const editProfileBtn = document.getElementById("edit-profile-btn");
const editProfileForm = document.getElementById("edit-profile-form");
const profileSlugInput = document.getElementById("profile-slug-input");
const saveProfileBtn = document.getElementById("save-profile-btn");
const cancelProfileBtn = document.getElementById("cancel-profile-btn");

// Utilities
function setThemeButtonText() {
    if (!themeToggleBtn) return;
    themeToggleBtn.textContent = document.body.classList.contains("dark-mode")
        ? "Light Mode"
        : "Dark Mode";
}

function generateQRCode(text) {
    if (!qrContainer) return;
    // clear previous QR (if any)
    qrContainer.innerHTML = "";

    // Prefer the qrcodejs library (included via CDN in index.html)
    if (window.QRCode) {
        try {
            new QRCode(qrContainer, {
                text: text,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            return;
        } catch (e) {
            console.error("QRCode generation failed:", e);
            qrContainer.textContent = "QR unavailable";
            return;
        }
    }

    // Fallback: draw a simple deterministic placeholder on a canvas
    const canvasSize = 150;
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    qrContainer.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#000";
    let seed = 0;
    for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i);
    function rand() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }
    for (let x = 0; x < canvasSize; x += 10) {
        for (let y = 0; y < canvasSize; y += 10) {
            if (rand() > 0.7) ctx.fillRect(x, y, 8, 8);
        }
    }
}

// Handlers
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        setThemeButtonText();
    });
    setThemeButtonText();
}

if (copyBtn && shareLink) {
    copyBtn.addEventListener("click", () => {
        try {
            shareLink.select();
            navigator.clipboard.writeText(shareLink.value);
            alert("Profile link copied!");
        } catch (e) {
            alert("Copy failed. Please copy manually.");
        }
    });
}

if (shareLink) {
    generateQRCode(shareLink.value);
}

if (editProfileBtn && editProfileForm && profileSlugInput && saveProfileBtn && cancelProfileBtn && shareLink) {
    editProfileBtn.addEventListener("click", () => {
        try {
            const parts = shareLink.value.split("/");
            profileSlugInput.value = parts[parts.length - 1] || "";
        } catch {
            profileSlugInput.value = "";
        }
        editProfileForm.hidden = false;
    });

    saveProfileBtn.addEventListener("click", () => {
        const newSlug = profileSlugInput.value.trim().toLowerCase();
        if (!newSlug) {
            alert("Please enter a valid username/slug.");
            return;
        }
        try {
            const url = new URL(shareLink.value);
            const pathParts = url.pathname.split("/").filter(Boolean);
            if (pathParts.length > 0) {
                pathParts[pathParts.length - 1] = newSlug;
            } else {
                pathParts.push(newSlug);
            }
            url.pathname = "/" + pathParts.join("/");
            shareLink.value = url.toString();
        } catch {
            const parts = shareLink.value.split("/");
            parts[parts.length - 1] = newSlug;
            shareLink.value = parts.join("/");
        }
        generateQRCode(shareLink.value);
        editProfileForm.hidden = true;
    });

    cancelProfileBtn.addEventListener("click", () => {
        editProfileForm.hidden = true;
    });

    // profile vla part 
    // DOM elements
const uploadBtn = document.getElementById('uploadBtn');
const uploadInput = document.getElementById('uploadInput');
const profilePic = document.getElementById('profilePic');
const form = document.getElementById('profileForm');

// Load saved data from localStorage
window.onload = () => {
  const savedData = JSON.parse(localStorage.getItem('studentProfile'));
  if (savedData) {
    document.getElementById('name').value = savedData.name || '';
    document.getElementById('email').value = savedData.email || '';
    document.getElementById('bio').value = savedData.bio || '';
    document.getElementById('skills').value = savedData.skills || '';
    profilePic.src = savedData.pfp || 'https://via.placeholder.com/120';
  }
};

// Upload button triggers file input
uploadBtn.addEventListener('click', () => uploadInput.click());

// Preview uploaded image
uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Save profile data locally
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    bio: document.getElementById('bio').value,
    skills: document.getElementById('skills').value,
    pfp: profilePic.src
  };
  localStorage.setItem('studentProfile', JSON.stringify(data));
  alert('✅ Profile saved successfully!');
});

}


// separate pages vla part 
// Generic add, edit, delete, and optional image upload system
function initList(sectionId, withImage = false) {
  const input = document.getElementById('itemInput');
  const fileInput = document.getElementById('imageInput');
  const addBtn = document.getElementById('addBtn');
  const list = document.getElementById('list');

  let editIndex = null;

  addBtn.addEventListener('click', () => {
    const value = input.value.trim();
    if (!value) return alert('Please enter something!');

    let imageSrc = '';
    if (withImage && fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imageSrc = e.target.result;
        addOrUpdateItem(value, imageSrc);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      addOrUpdateItem(value, imageSrc);
    }
  });

  function addOrUpdateItem(value, imageSrc) {
    if (editIndex === null) {
      const li = createListItem(value, imageSrc);
      list.appendChild(li);
    } else {
      const li = list.children[editIndex];
      li.querySelector('span').textContent = value;
      if (imageSrc) {
        const img = li.querySelector('img');
        if (img) img.src = imageSrc;
      }
      editIndex = null;
      addBtn.textContent = "Add";
    }

    input.value = '';
    if (fileInput) fileInput.value = '';
    saveList(sectionId);
  }

  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (e.target.classList.contains('delete')) {
      li.remove();
      saveList(sectionId);
    } else if (e.target.classList.contains('edit')) {
      input.value = li.querySelector('span').textContent;
      editIndex = Array.from(list.children).indexOf(li);
      addBtn.textContent = "Update";
    }
  });

  function createListItem(value, imageSrc) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      ${withImage && imageSrc ? `<img src="${imageSrc}" class="image-preview" alt="upload">` : ''}
      <span>${value}</span>
      <div class="action-buttons">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;
    return li;
  }

  function saveList(sectionId) {
    const listItems = Array.from(list.children).map(li => ({
      text: li.querySelector('span').textContent,
      image: withImage ? (li.querySelector('img')?.src || '') : ''
    }));
    localStorage.setItem(sectionId, JSON.stringify(listItems));
  }

  function loadList(sectionId) {
    const saved = JSON.parse(localStorage.getItem(sectionId) || '[]');
    list.innerHTML = '';
    saved.forEach(item => {
      const li = createListItem(item.text, item.image);
      list.appendChild(li);
    });
  }

  loadList(sectionId);
}

/* === SIGN IN LOGIC === */

// Fake Google login
function fakeGoogleLogin() {
  const dummyUser = {
    name: "Google User",
    email: "user@gmail.com",
    loginType: "Google"
  };
  localStorage.setItem("user", JSON.stringify(dummyUser));
  window.location.href = "profile.html";
}

// Fake GitHub login
function fakeGitHubLogin() {
  const dummyUser = {
    name: "GitHub User",
    email: "user@github.com",
    loginType: "GitHub"
  };
  localStorage.setItem("user", JSON.stringify(dummyUser));
  window.location.href = "profile.html";
}

/* === PROFILE LOGIC === */

// Preview uploaded photo
function previewPhoto(event) {
  const img = document.getElementById("profilePicPreview");
  img.src = URL.createObjectURL(event.target.files[0]);
}

// Save profile info
function saveProfile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const linkedin = document.getElementById("linkedin").value.trim();
  const github = document.getElementById("github").value.trim();
  const photo = document.getElementById("profilePicPreview").src;

  if (!name) {
    alert("Please enter your name");
    return;
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const link = `https://studentportfolio.local/profile/${slug}`;

  const updatedProfile = {
    ...user,
    name,
    bio,
    linkedin,
    github,
    photo,
    link
  };

  localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  alert("Profile saved successfully!");
  loadUserProfile();
}

// Load profile info
function loadUserProfile() {
  const profile = JSON.parse(localStorage.getItem("userProfile"));
  if (!profile) return;

  document.getElementById("name").value = profile.name || "";
  document.getElementById("bio").value = profile.bio || "";
  document.getElementById("linkedin").value = profile.linkedin || "";
  document.getElementById("github").value = profile.github || "";
  document.getElementById("profilePicPreview").src = profile.photo || "default-avatar.png";

  const linkBox = document.getElementById("profileLink");
  linkBox.innerText = profile.link || "";
  linkBox.href = profile.link || "#";

  generateQR(profile.link);
}

// Generate QR for profile link
function generateQR(text) {
  const qrContainer = document.getElementById("qrCode");
  qrContainer.innerHTML = "";
  if (text)
    new QRCode(qrContainer, { text, width: 100, height: 100 });
}

// Logout
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("userProfile");
  window.location.href = "index.html";
}
