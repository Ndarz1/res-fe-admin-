const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

let editId = null;

document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  await loadWisataList();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (slug) {
    document.getElementById("page-title").textContent = "Edit Artikel";
    loadPostData(slug);
  }

  setupForm();
  setupImagePreview();
  setupSearchWisata();
});

async function loadCategories() {
  const select = document.getElementById("input-category");
  try {
    const res = await fetch(`${API_BASE_URL}/blog/categories`);
    const json = await res.json();
    json.data.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
  }
}

async function loadWisataList() {
  const container = document.getElementById("wisata-checklist-container");
  try {
    const res = await fetch(`${API_BASE_URL}/wisata`);
    const json = await res.json();

    container.innerHTML = json.data
      .map(
        (w) => `
            <label class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer border-b border-slate-50 last:border-0">
                <input type="checkbox" name="related_wisata" value="${w.id}" class="w-4 h-4 text-blue-600 rounded">
                <div>
                    <p class="text-xs font-bold text-slate-700">${w.nama_tempat}</p>
                </div>
            </label>
        `
      )
      .join("");
  } catch (e) {
    console.error(e);
  }
}

async function loadPostData(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/detail?slug=${slug}`);
    const json = await res.json();
    const post = json.data;
    editId = post.id;

    document.getElementById("input-title").value = post.title;
    document.getElementById("input-content").value = post.content;
    document.getElementById("input-excerpt").value = post.excerpt || "";
    document.getElementById("input-category").value = post.category_id || "";

    if (post.thumbnail) {
      const img = document.getElementById("preview-thumb");
      img.src = post.thumbnail;
      img.classList.remove("hidden");
    }

    if (post.related_wisata) {
      const relatedIds = post.related_wisata.map((w) => w.id);
      document
        .querySelectorAll('input[name="related_wisata"]')
        .forEach((cb) => {
          if (relatedIds.includes(parseInt(cb.value))) cb.checked = true;
        });
    }
  } catch (e) {
    alert("Gagal memuat data edit");
  }
}

function setupForm() {
  document.getElementById("blog-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.submitter;
    const originalText = btn.textContent;
    btn.textContent = "Menyimpan...";
    btn.disabled = true;

    const formData = new FormData(e.target);

    const title = formData.get("title");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    formData.append("slug", slug);

    const selectedWisata = Array.from(
      document.querySelectorAll('input[name="related_wisata"]:checked')
    )
      .map((el) => el.value)
      .join(",");
    formData.append("related_wisata_ids", selectedWisata);

    try {
      let url = `${API_BASE_URL}/blog/create`;
      if (editId) url = `${API_BASE_URL}/blog/update?id=${editId}`;

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        alert("Artikel berhasil disimpan!");
        window.location.href = "list.html";
      } else {
        const err = await res.json();
        alert("Gagal: " + (err.message || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Error koneksi");
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

function setupImagePreview() {
  document.getElementById("input-thumb").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.getElementById("preview-thumb");
        img.src = e.target.result;
        img.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });
}

function setupSearchWisata() {
  document.getElementById("search-wisata").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const labels = document.querySelectorAll(
      "#wisata-checklist-container label"
    );
    labels.forEach((label) => {
      const text = label.textContent.toLowerCase();
      label.style.display = text.includes(term) ? "flex" : "none";
    });
  });
}
