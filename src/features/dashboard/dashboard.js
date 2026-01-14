import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar } from "../../components/Navbar.js";

const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("sidebar-container");
  renderNavbar("navbar-container");

  loadStats();
  loadRecentBookings();
  loadPopularWisata();
});

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "../../../index.html";
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`Gagal memuat data dari ${endpoint}:`, error);
    return null;
  }
}

async function loadStats() {
  const data = await fetchData("/dashboard/stats");

  if (data) {
    const destinasiEl = document.getElementById("stat-destinasi");
    const pengunjungEl = document.getElementById("stat-pengunjung");
    const bookingEl = document.getElementById("stat-booking");
    const pendapatanEl = document.getElementById("stat-pendapatan");

    if (destinasiEl) destinasiEl.innerText = data.total_wisata || 0;
    if (pengunjungEl)
      pengunjungEl.innerText = (data.total_visitors || 0).toLocaleString();
    if (bookingEl) bookingEl.innerText = data.total_bookings || 0;

    if (pendapatanEl) {
      const revenue = data.total_revenue || 0;
      pendapatanEl.innerText = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(revenue);
    }
  }
}

async function loadRecentBookings() {
  const data = await fetchData("/dashboard/recent-bookings");
  const tbody = document.getElementById("recent-bookings-body");

  if (!tbody) return;

  if (data && data.length > 0) {
    tbody.innerHTML = data
      .map((b) => {
        let statusColor = "bg-gray-100 text-gray-600";
        const s = (b.status || "").toLowerCase();

        if (s === "confirmed") statusColor = "bg-blue-50 text-blue-600";
        else if (s === "paid" || s === "completed")
          statusColor = "bg-green-50 text-green-600";
        else if (s === "pending") statusColor = "bg-yellow-50 text-yellow-600";
        else if (s === "cancelled") statusColor = "bg-red-50 text-red-600";

        return `
          <tr class="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
              <td class="py-3 px-2 font-mono text-xs text-gray-500">
                  ${b.booking_code || "-"}
              </td>
              <td class="py-3 px-2 font-medium text-gray-800">
                  ${b.wisata_nama || b.wisata_id}
              </td>
              <td class="py-3 px-2 text-gray-500 text-sm">
                  ${b.visit_date}
              </td>
              <td class="py-3 px-2">
                  <span class="px-2 py-1 rounded text-xs font-semibold ${statusColor}">
                      ${(b.status || "UNKNOWN").toUpperCase()}
                  </span>
              </td>
          </tr>
        `;
      })
      .join("");
  } else {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-400">Belum ada booking terbaru</td></tr>`;
  }
}

async function loadPopularWisata() {
  const data = await fetchData("/dashboard/popular-wisata");
  const container = document.getElementById("popular-wisata-list");

  if (!container) return;

  if (data && data.length > 0) {
    container.innerHTML = data
      .map(
        (w) => `
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-teal-50">${w.nama_tempat}</span>
              <span class="text-wonderful-gold font-bold">${Math.round(
                w.percentage
              )}%</span>
            </div>
            <div class="w-full bg-black/20 rounded-full h-2">
              <div
                class="bg-wonderful-gold h-2 rounded-full transition-all duration-500"
                style="width: ${Math.round(w.percentage)}%"
              ></div>
            </div>
          </div>
        `
      )
      .join("");
  } else {
    container.innerHTML = `<p class="text-white/60 text-sm text-center">Belum ada data populer</p>`;
  }
}
