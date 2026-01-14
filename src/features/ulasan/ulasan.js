import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar } from "../../components/Navbar.js";

const API_BASE = "http://localhost:8080/api";
let allReviews = [];
let currentTab = "pending";

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("sidebar-container");
  renderNavbar("navbar-container");
  loadReviews();

  window.switchTab = (tab) => {
    currentTab = tab;
    updateTabsUI(tab);
    renderList();
  };
});

async function loadReviews() {
  try {
    const res = await fetch(`${API_BASE}/admin/reviews`);
    const json = await res.json();
    if (json.data) {
      allReviews = json.data;
      updatePendingCount();
      renderList();
    }
  } catch (e) {
    console.error("Gagal memuat ulasan", e);
  }
}

function updateTabsUI(tab) {
  const activeClass =
    "pb-3 border-b-2 border-wonderful-teal text-wonderful-teal font-medium";
  const inactiveClass =
    "pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition";

  document.getElementById("tab-pending").className =
    tab === "pending" ? activeClass : inactiveClass;
  document.getElementById("tab-approved").className =
    tab === "approved" ? activeClass : inactiveClass;
}

function updatePendingCount() {
  const pendingCount = allReviews.filter((r) => r.status === "pending").length;
  const countBadge = document.querySelector("#tab-pending span");
  if (countBadge) {
    countBadge.textContent = pendingCount;
    if (pendingCount === 0) countBadge.classList.add("hidden");
    else countBadge.classList.remove("hidden");
  }
}

function renderList() {
  const container = document.getElementById("review-container");
  const filtered = allReviews.filter((r) => r.status === currentTab);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">Tidak ada ulasan pada tab ini.</div>`;
    return;
  }

  container.innerHTML = filtered
    .map((item) => {
      const dateStr = new Date(item.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                    <span class="font-bold text-gray-900">${item.user}</span>
                    <span class="text-gray-400 text-sm">•</span>
                    <span class="text-sm text-gray-500">${dateStr}</span>
                </div>
                <div class="flex items-center gap-1 mb-3 text-yellow-400">
                    ${"★".repeat(
                      item.rating
                    )}${"<span class='text-gray-200'>★</span>".repeat(
        5 - item.rating
      )}
                    <span class="text-xs text-gray-400 ml-2 font-medium">untuk <span class="text-wonderful-teal font-bold">${
                      item.wisata
                    }</span></span>
                </div>
                <p class="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"${
                  item.comment
                }"</p>
            </div>
            
            <div class="flex md:flex-col justify-center gap-3 md:border-l border-gray-100 md:pl-6 min-w-[140px]">
                ${
                  currentTab === "pending"
                    ? `
                <button onclick="window.approveReview(${item.id})" class="flex items-center justify-center gap-2 w-full py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Approve
                </button>
                <button onclick="window.deleteReview(${item.id})" class="flex items-center justify-center gap-2 w-full py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Reject
                </button>
                `
                    : `
                <button onclick="window.deleteReview(${item.id})" class="text-red-500 hover:text-red-700 text-sm font-medium">Hapus Permanen</button>
                `
                }
            </div>
        </div>
    `;
    })
    .join("");
}

window.approveReview = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/admin/reviews/approve?id=${id}`, {
      method: "POST",
    });
    if (res.ok) {
      loadReviews();
    } else {
      alert("Gagal menyetujui ulasan");
    }
  } catch (e) {
    alert("Error koneksi");
  }
};

window.deleteReview = async (id) => {
  if (confirm("Hapus ulasan ini?")) {
    try {
      const res = await fetch(`${API_BASE}/admin/reviews/delete?id=${id}`, {
        method: "POST",
      });
      if (res.ok) {
        loadReviews();
      } else {
        alert("Gagal menghapus ulasan");
      }
    } catch (e) {
      alert("Error koneksi");
    }
  }
};
