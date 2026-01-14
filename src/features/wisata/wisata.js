import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar } from "../../components/Navbar.js";

const API_BASE = "http://localhost:8080/api";

// Gambar placeholder offline (kotak abu-abu simple)
const NO_IMAGE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("sidebar-container");
  renderNavbar("navbar-container");

  const path = window.location.pathname;
  if (path.includes("wisata.html")) {
    initListPage();
  } else if (path.includes("form.html")) {
    initFormPage();
  }
});

async function initListPage() {
  const tableBody = document.getElementById("wisata-table-body");
  const searchInput = document.getElementById("search-input");

  async function loadData(query = "") {
    try {
      const url = query
        ? `${API_BASE}/wisata?q=${query}`
        : `${API_BASE}/wisata`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.data && json.data.length > 0) {
        renderTable(json.data);
        updatePagination(json.data.length);
      } else {
        tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Data tidak ditemukan</td></tr>`;
        updatePagination(0);
      }
    } catch (error) {
      console.error(error);
      tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-red-500">Gagal memuat data (Pastikan Backend Running)</td></tr>`;
    }
  }

  function renderTable(data) {
    tableBody.innerHTML = data
      .map(
        (item) => `
            <tr class="hover:bg-gray-50 group transition">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                         <img src="${item.image_url || NO_IMAGE_BASE64}" 
                              onerror="this.onerror=null;this.src='${NO_IMAGE_BASE64}';"
                              class="w-12 h-12 rounded object-cover border border-gray-200 bg-gray-100" 
                              alt="${item.nama_tempat}">
                        <div class="font-medium text-gray-900">${
                          item.nama_tempat
                        }</div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">${
                      item.category_name
                    }</span>
                </td>
                <td class="px-6 py-4 text-gray-500">${item.lokasi}</td>
                <td class="px-6 py-4 text-gray-900 font-mono">
                    ${new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(item.harga_tiket)}
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center text-yellow-400 gap-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span class="text-gray-600 font-medium text-sm ml-1">${
                          item.rating_total || 0
                        }</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                        <a href="./form.html?id=${
                          item.id
                        }" class="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </a>
                        <button onclick="window.deleteItem(${
                          item.id
                        })" class="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");
  }

  function updatePagination(count) {
    document
      .getElementById("pagination-info")
      .querySelector("span").innerText = `Menampilkan ${count} data`;
  }

  window.deleteItem = async (id) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await fetch(`${API_BASE}/wisata/delete?id=${id}`, { method: "POST" });
        loadData();
      } catch (e) {
        alert("Gagal menghapus");
      }
    }
  };

  let timeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => loadData(e.target.value), 300);
  });

  loadData();
}

async function initFormPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const form = document.getElementById("wisata-form");
  const title = document.getElementById("form-title");
  const saveBtn = document.getElementById("save-btn");

  if (id) {
    title.innerText = "Edit Wisata";
    saveBtn.innerText = "Update Changes";
    try {
      const res = await fetch(`${API_BASE}/wisata/detail?id=${id}`);
      const json = await res.json();
      if (json.data) {
        const d = json.data;
        form.nama_tempat.value = d.nama_tempat;
        form.harga_tiket.value = d.harga_tiket;
        form.lokasi.value = d.lokasi;
        form.deskripsi.value = d.deskripsi || "";
        form.fasilitas.value = d.fasilitas || "";
        form.category_id.value = d.category_id || "";

        if (d.image_url) {
          const preview = document.getElementById("image-preview");
          const placeholder = document.getElementById("upload-placeholder");
          // Gunakan fallback jika gambar detail gagal load juga
          preview.style.backgroundImage = `url('${d.image_url}'), url('${NO_IMAGE_BASE64}')`;
          preview.classList.remove("hidden");
          placeholder.classList.add("hidden");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";

    const formData = new FormData(form);

    const slug = formData
      .get("nama_tempat")
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    formData.append("slug", slug);

    try {
      let url = `${API_BASE}/wisata/create`;
      let method = "POST";

      if (id) {
        url = `${API_BASE}/wisata/update?id=${id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      if (res.ok) {
        window.location.href = "./wisata.html";
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
        saveBtn.disabled = false;
        saveBtn.innerText = "Simpan Data";
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan data");
      saveBtn.disabled = false;
    }
  });
}
