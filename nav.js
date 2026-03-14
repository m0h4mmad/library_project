/* nav.js – builds the correct nav based on logged-in user */

(function buildNav() {
  const user = JSON.parse(localStorage.getItem('library_current_user') || 'null');
  const navEl = document.getElementById('main-nav');
  if (!navEl) return;

  let links = [];

  if (!user) {
    links = [
      { href: 'login.html',  label: 'Login' },
      { href: 'signup.html', label: 'Sign Up' },
    ];
  } else if (user.is_admin) {
    links = [
      { href: 'home_admin.html',                   label: 'Home' },
      { href: 'view_available_books_admin.html',    label: 'All Books' },
      { href: 'add_book.html',                     label: 'Add Book' },
      { href: 'profile.html',                      label: '👤 ' + user.username },
    ];
  } else {
    links = [
      { href: 'home_user.html',   label: 'Home' },
      { href: 'view_available.html', label: 'Browse Books' },
      { href: 'view_borrowed.html',  label: 'My Borrowed' },
      { href: 'profile.html',        label: '👤 ' + user.username },
    ];
  }

  const ul = document.createElement('ul');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(({ href, label }) => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href   = href;
    a.textContent = label;
    // Match active page (ignore query string)
    if (href.split('?')[0] === currentPage.split('?')[0]) a.classList.add('active');
    li.appendChild(a);
    ul.appendChild(li);
  });

  // Add logout button for logged-in users
  if (user) {
    const li  = document.createElement('li');
    const btn = document.createElement('a');
    btn.href  = '#';
    btn.textContent = 'Log Out';
    btn.style.cssText = 'color:#f0a090 !important;';
    btn.addEventListener('click', function(e) { e.preventDefault(); logout(); });
    li.appendChild(btn);
    ul.appendChild(li);
  }

  navEl.appendChild(ul);
})();

function logout() {
  localStorage.removeItem('library_current_user');
  window.location.href = 'login.html';
}

function requireAuth(adminOnly = false) {
  const user = JSON.parse(localStorage.getItem('library_current_user') || 'null');
  if (!user) { window.location.href = 'login.html'; return null; }
  if (adminOnly && !user.is_admin) { window.location.href = 'home_user.html'; return null; }
  return user;
}

function getBooks() {
  return JSON.parse(localStorage.getItem('library_books') || '[]');
}

function saveBooks(books) {
  localStorage.setItem('library_books', JSON.stringify(books));
}

function getBorrowedBooks(userId) {
  const all = JSON.parse(localStorage.getItem('library_borrowed') || '[]');
  return all.filter(b => b.userId === userId);
}

function seedBooksIfEmpty() {
  if (getBooks().length > 0) return;
  const sample = [
    { id: 100278, name: 'Modern C++',           author: 'Dr. Mohammed', category: 'Programming',    description: 'A book that explains modern C++ features in a brief yet comprehensive way.', year: 2020, pages: 480, available: false },
    { id: 100279, name: 'Advanced Network',      author: 'Dr. Ibrahim',  category: 'Engineering',    description: 'Deep dive into advanced network architectures and protocols.', year: 2019, pages: 340, available: false },
    { id: 100280, name: 'Ancient Egypt',         author: 'Dr. Mahmoud',  category: 'History',        description: 'A rich exploration of ancient Egyptian civilization and culture.', year: 2018, pages: 520, available: false },
    { id: 100281, name: 'Software Engineering',  author: 'Dr. Mostafa',  category: 'Computer Science', description: 'Principles and practices of modern software engineering.', year: 2021, pages: 610, available: true  },
    { id: 100282, name: 'Data Structures',       author: 'Dr. Yasser',   category: 'Computer Science', description: 'Fundamental data structures and algorithms explained clearly.', year: 2022, pages: 390, available: true  },
  ];
  saveBooks(sample);
}
