import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar } from "../../components/Navbar.js";

const API_BASE = "http://localhost:8080/api";
let currentUsers = [];

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("sidebar-container");
  renderNavbar("navbar-container");
  loadUsers();

  const form = document.getElementById("edit-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = form.id.value;
    const role = form.role.value;
    const isActive = form.active.checked;

    try {
      const res = await fetch(`${API_BASE}/users/update?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: role, is_active: isActive }),
      });

      if (res.ok) {
        window.closeModal();
        loadUsers();
      } else {
        alert("Gagal mengupdate user");
      }
    } catch (err) {
      console.error(err);
      alert("Error koneksi");
    }
  });
});

async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const json = await res.json();

    if (json.data) {
      currentUsers = json.data;
      renderTable(json.data);
    }
  } catch (e) {
    console.error(e);
    document.getElementById(
      "user-table-body"
    ).innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Gagal memuat data</td></tr>`;
  }
}

function renderTable(data) {
  const tbody = document.getElementById("user-table-body");

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-400">Belum ada pengguna</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map((u) => {
      const roleColor =
        u.role === "superadmin"
          ? "bg-purple-50 text-purple-600"
          : u.role === "admin"
          ? "bg-blue-50 text-blue-600"
          : "bg-gray-100 text-gray-600";

      const statusDot = u.is_active ? "bg-green-500" : "bg-red-500";
      const statusText = u.is_active ? "Active" : "Inactive";
      const joinedDate = new Date(u.created_at).toLocaleDateString("id-ID");

      return `
            <tr class="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-wonderful-gold/20 text-wonderful-gold flex items-center justify-center font-bold text-sm">
                            ${
                              u.full_name
                                ? u.full_name.charAt(0).toUpperCase()
                                : "?"
                            }
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">${
                              u.full_name
                            }</div>
                            <div class="text-xs text-gray-500">${u.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded text-xs font-semibold ${roleColor}">${u.role.toUpperCase()}</span>
                </td>
                <td class="px-6 py-4 text-gray-500 text-sm">${
                  u.phone || "-"
                }</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full ${statusDot}"></span>
                        <span class="text-sm text-gray-600">${statusText}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-500 text-sm">${joinedDate}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="window.openEdit(${
                      u.id
                    })" class="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</button>
                    <button onclick="window.deleteUser(${
                      u.id
                    })" class="text-red-500 hover:text-red-700 text-sm font-medium">Hapus</button>
                </td>
            </tr>
        `;
    })
    .join("");
}

window.openEdit = (id) => {
  const user = currentUsers.find((u) => u.id === id);
  if (!user) return;

  const modal = document.getElementById("edit-modal");
  const form = document.getElementById("edit-form");

  form.id.value = user.id;
  form.name.value = user.full_name;
  form.role.value = user.role;
  form.active.checked = user.is_active;

  modal.classList.remove("hidden");
};

window.deleteUser = async (id) => {
  if (
    confirm(
      "Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
    )
  ) {
    try {
      const res = await fetch(`${API_BASE}/users/delete?id=${id}`, {
        method: "POST",
      });
      if (res.ok) {
        loadUsers();
      } else {
        alert("Gagal menghapus user");
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
  }
};
