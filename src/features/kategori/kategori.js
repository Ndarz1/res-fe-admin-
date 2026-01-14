import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar } from "../../components/Navbar.js";

const API_BASE = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("sidebar-container");
  renderNavbar("navbar-container");

  loadCategories();

  const form = document.getElementById("kategori-form");

  form.name.addEventListener("input", (e) => {
    form.slug.value = e.target.value
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = form.id.value;

    const payload = {
      name: form.name.value,
      slug: form.slug.value,
      is_active: form.active.checked,
    };

    try {
      let url = `${API_BASE}/categories/create`;
      let method = "POST";

      if (id) {
        url = `${API_BASE}/categories/update?id=${id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.closeModal();
        loadCategories();
      } else {
        const err = await res.json();
        alert("Gagal: " + (err.message || "Error"));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
    }
  });
});

let currentCategories = [];

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const json = await res.json();

    if (json.data) {
      currentCategories = json.data;
      renderTable(json.data);
    }
  } catch (e) {
    console.error(e);
    document.getElementById(
      "kategori-table-body"
    ).innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Gagal memuat data</td></tr>`;
  }
}

function renderTable(data) {
  const tbody = document.getElementById("kategori-table-body");
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-400">Belum ada kategori</td></tr>`;
    return;
  }

  tbody.innerHTML = data
    .map(
      (c) => `
        <tr class="hover:bg-gray-50 transition border-b border-gray-100 last:border-0 group">
            <td class="px-6 py-4 text-gray-500 font-mono text-xs">#${c.id}</td>
            <td class="px-6 py-4 font-medium text-gray-900">${c.name}</td>
            <td class="px-6 py-4 text-gray-500 italic">${c.slug}</td>
            <td class="px-6 py-4">
                <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">${
                  c.count || 0
                } Destinasi</span>
            </td>
            <td class="px-6 py-4">
                 <span class="w-2 h-2 rounded-full inline-block ${
                   c.is_active ? "bg-green-500" : "bg-red-400"
                 }"></span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="window.editItem(${
                  c.id
                })" class="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</button>
                <button onclick="window.deleteItem(${
                  c.id
                })" class="text-red-500 hover:text-red-700 text-sm font-medium">Hapus</button>
            </td>
        </tr>
    `
    )
    .join("");
}

window.editItem = (id) => {
  const item = currentCategories.find((c) => c.id === id);
  if (!item) return;

  window.openModal();
  const form = document.getElementById("kategori-form");
  document.getElementById("modal-title").innerText = "Edit Kategori";
  form.id.value = item.id;
  form.name.value = item.name;
  form.slug.value = item.slug;
  form.active.checked = item.is_active;
};

window.deleteItem = async (id) => {
  if (confirm("Hapus kategori ini?")) {
    try {
      const res = await fetch(`${API_BASE}/categories/delete?id=${id}`, {
        method: "POST",
      });
      if (res.ok) {
        loadCategories();
      } else {
        const err = await res.json();
        alert("Gagal: " + err.message);
      }
    } catch (e) {
      alert("Gagal menghapus");
    }
  }
};
