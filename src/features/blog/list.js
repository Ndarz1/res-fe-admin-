const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth();
  fetchPosts();
});

async function checkAdminAuth() {
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401) {
      window.location.href = "../../../index.html";
      return;
    }

    const json = await res.json();

    if (
      !json.data ||
      (json.data.role !== "admin" && json.data.role !== "superadmin")
    ) {
      alert("Akses Ditolak: Anda bukan Administrator");
      window.location.href = "../../../index.html";
      return;
    }

    localStorage.setItem("user_data", JSON.stringify(json.data));
  } catch (e) {
    console.error("Auth Error:", e);
  }
}

async function fetchPosts() {
  const tbody = document.getElementById("blog-table-body");
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts`, {
      method: "GET",
      credentials: "include",
    });

    const json = await res.json();

    if (json.data && json.data.length > 0) {
      tbody.innerHTML = json.data
        .map(
          (post) => `
                    <tr class="hover:bg-slate-50 transition">
                        <td class="px-6 py-4 font-medium text-slate-900">${post.title}</td>
                        <td class="px-6 py-4">
                            <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                ${post.category_name}
                            </span>
                        </td>
                        <td class="px-6 py-4">${post.author_name}</td>
                        <td class="px-6 py-4">${post.published_at}</td>
                        <td class="px-6 py-4 text-right flex justify-end gap-2">
                            <a href="form.html?slug=${post.slug}" class="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition">Edit</a>
                            <button onclick="deletePost(${post.id})" class="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">Hapus</button>
                        </td>
                    </tr>
                `
        )
        .join("");
    } else {
      tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">Belum ada artikel.</td></tr>`;
    }
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-red-500">Gagal menghubungkan ke server.</td></tr>`;
  }
}

window.deletePost = async (id) => {
  if (!confirm("Hapus artikel ini?")) return;
  try {
    const res = await fetch(`${API_BASE_URL}/blog/delete?id=${id}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      fetchPosts();
    } else {
      const err = await res.json();
      alert("Gagal menghapus: " + err.message);
    }
  } catch (e) {
    alert("Terjadi kesalahan koneksi saat menghapus");
  }
};
