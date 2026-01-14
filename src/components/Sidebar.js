const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

export async function renderSidebar(containerId = "sidebar-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  let user = JSON.parse(
    localStorage.getItem("user_data") ||
      '{"full_name":"Memuat...","role":"..."}'
  );

  const path = window.location.pathname;
  const isActive = (key) =>
    path.includes(key)
      ? "bg-white/10 text-white font-bold border-r-4 border-wonderful-gold"
      : "text-teal-100 hover:bg-white/5 hover:text-white";

  const menuItems = [
    {
      name: "Dashboard",
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
      link: "../dashboard/dashboard.html",
    },
    {
      name: "Data Wisata",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      link: "../wisata/wisata.html",
    },
    {
      name: "Kategori",
      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
      link: "../kategori/kategori.html",
    },
    {
      name: "Blog & Artikel",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      link: "../blog/list.html",
    },
    {
      name: "Pemesanan",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      link: "../pemesanan/pemesanan.html",
    },
    {
      name: "Ulasan",
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      link: "../ulasan/ulasan.html",
    },
    {
      name: "Pengguna",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      link: "../pengguna/pengguna.html",
    },
    {
      name: "Laporan",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      link: "../laporan/laporan.html",
    },
  ];

  container.innerHTML = `
    <div class="h-full flex flex-col bg-gradient-to-b from-wonderful-teal to-teal-800 text-white w-64 fixed left-0 top-0 bottom-0 z-30 transition-transform duration-300 transform -translate-x-full md:translate-x-0" id="sidebar">
      <div class="p-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-white p-2 rounded-lg">
            <svg class="w-6 h-6 text-wonderful-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h2 id="sidebar-username" class="font-bold text-lg w-32 overflow-hidden text-ellipsis whitespace-nowrap">${
              user.full_name
            }</h2>
            <p id="sidebar-role" class="text-xs text-teal-200 capitalize font-medium px-2 py-0.5 bg-teal-900/30 rounded inline-block border border-teal-500/30">${
              user.role
            }</p>
          </div>
        </div>
        <button id="close-sidebar" class="md:hidden text-white" onclick="toggleSidebar()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <nav class="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        ${menuItems
          .map(
            (i) => `
          <a href="${
            i.link
          }" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(
              i.link.split("/").pop()
            )}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
              i.icon
            }"></path></svg>
            <span>${i.name}</span>
          </a>
        `
          )
          .join("")}
      </nav>
      <div class="p-4 border-t border-teal-700">
        <button onclick="logout()" class="flex items-center gap-3 px-4 py-2 text-red-200 hover:bg-red-500/10 rounded-lg w-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-20 hidden md:hidden" onclick="toggleSidebar()"></div>
  `;

  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data;
      document.getElementById("sidebar-username").textContent = data.full_name;
      document.getElementById("sidebar-role").textContent = data.role;
      localStorage.setItem("user_data", JSON.stringify(data));
    } else if (res.status === 401) {
      localStorage.removeItem("user_data");
      window.location.href = "../../../index.html";
    }
  } catch (e) {
    console.error("Gagal sinkronisasi profil sidebar:", e);
  }

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  window.toggleSidebar = () => {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
  };

  window.logout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        localStorage.removeItem("user_data");
        window.location.href = "../../../index.html";
      }
    }
  };
}
