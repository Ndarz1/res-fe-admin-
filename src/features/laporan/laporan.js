import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar } from "../../components/Navbar.js";

const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("sidebar-container");
  renderNavbar("navbar-container");
  loadLaporanData();
});

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "../../../index.html";
      return null;
    }

    if (!response.ok) throw new Error("API Error");

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function loadLaporanData() {
  const data = await fetchData("/dashboard/stats");
  const tbody = document.getElementById("laporan-body");

  if (!tbody) return;

  if (data) {
    const totalRev = data.total_revenue || 0;
    const netRev = totalRev * 0.9;
    const bookings = data.total_bookings || 0;
    const visitors = data.total_visitors || 0;

    document.getElementById("card-total-revenue").textContent =
      formatIDR(totalRev);
    document.getElementById("card-net-revenue").textContent = formatIDR(netRev);
    document.getElementById(
      "card-visitors"
    ).textContent = `${visitors.toLocaleString()} Orang`;

    tbody.innerHTML = `
      <tr class="hover:bg-slate-50/50 transition-colors group">
        <td class="px-8 py-5 font-semibold text-slate-700">Minggu 1 - 2 (Januari 2026)</td>
        <td class="px-8 py-5 text-center font-medium text-slate-500">${Math.floor(
          bookings * 0.6
        )}</td>
        <td class="px-8 py-5 text-center font-medium text-slate-500">${Math.floor(
          visitors * 0.6
        )}</td>
        <td class="px-8 py-5 text-right font-medium text-slate-600">${formatIDR(
          totalRev * 0.6
        )}</td>
        <td class="px-8 py-5 text-right font-bold text-wonderful-teal">${formatIDR(
          netRev * 0.6
        )}</td>
      </tr>
      <tr class="hover:bg-slate-50/50 transition-colors group">
        <td class="px-8 py-5 font-semibold text-slate-700">Minggu 3 - 4 (Januari 2026)</td>
        <td class="px-8 py-5 text-center font-medium text-slate-500">${Math.ceil(
          bookings * 0.4
        )}</td>
        <td class="px-8 py-5 text-center font-medium text-slate-500">${Math.ceil(
          visitors * 0.4
        )}</td>
        <td class="px-8 py-5 text-right font-medium text-slate-600">${formatIDR(
          totalRev * 0.4
        )}</td>
        <td class="px-8 py-5 text-right font-bold text-wonderful-teal">${formatIDR(
          netRev * 0.4
        )}</td>
      </tr>
      <tr class="bg-wonderful-teal/5 border-t-2 border-wonderful-teal/10">
        <td class="px-8 py-6 font-extrabold text-wonderful-dark uppercase tracking-tight text-sm">Akumulasi Bulanan</td>
        <td class="px-8 py-6 font-extrabold text-center text-slate-800">${bookings}</td>
        <td class="px-8 py-6 font-extrabold text-center text-slate-800">${visitors}</td>
        <td class="px-8 py-6 text-right font-extrabold text-slate-800">${formatIDR(
          totalRev
        )}</td>
        <td class="px-8 py-6 text-right font-black text-wonderful-teal text-xl">${formatIDR(
          netRev
        )}</td>
      </tr>
    `;
  } else {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-20 text-red-400 font-bold underline">Sinkronisasi Server Terputus</td></tr>`;
  }
}

function formatIDR(val) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}
