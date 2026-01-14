import { renderSidebar } from "../../components/Sidebar.js";
import { renderNavbar } from "../../components/Navbar.js";

const API_BASE = "http://localhost:8080/api";
let currentBookings = [];

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar("sidebar-container");
  renderNavbar("navbar-container");

  loadBookings();

  document
    .getElementById("search-input")
    .addEventListener("input", (e) => filterData(e.target.value));
  document
    .getElementById("status-filter")
    .addEventListener("change", (e) =>
      filterData(document.getElementById("search-input").value)
    );
});

async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    const json = await res.json();

    if (json.data) {
      currentBookings = json.data;
      renderTable(json.data);
    } else {
      renderTable([]);
    }
  } catch (e) {
    console.error(e);
    document.getElementById(
      "booking-table-body"
    ).innerHTML = `<tr><td colspan="7" class="text-center py-8 text-red-500">Gagal memuat data</td></tr>`;
  }
}

function filterData(query) {
  const status = document.getElementById("status-filter").value;
  const lowerQuery = query.toLowerCase();

  const filtered = currentBookings.filter((item) => {
    const matchesSearch =
      (item.booking_code &&
        item.booking_code.toLowerCase().includes(lowerQuery)) ||
      (item.user_name && item.user_name.toLowerCase().includes(lowerQuery));

    const matchesStatus = status ? item.status === status : true;
    return matchesSearch && matchesStatus;
  });

  renderTable(filtered);
}

function renderTable(data) {
  const tbody = document.getElementById("booking-table-body");

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">Tidak ada data pemesanan.</td></tr>`;
    document
      .getElementById("pagination-info")
      .querySelector("span").innerText = `Menampilkan 0 data`;
    return;
  }

  tbody.innerHTML = data
    .map((item) => {
      let statusBadge = "";
      switch (item.status) {
        case "confirmed":
          statusBadge =
            '<span class="px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-600">CONFIRMED</span>';
          break;
        case "paid":
          statusBadge =
            '<span class="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-600">PAID</span>';
          break;
        case "pending":
          statusBadge =
            '<span class="px-2 py-1 rounded text-xs font-semibold bg-yellow-50 text-yellow-600">PENDING</span>';
          break;
        case "cancelled":
          statusBadge =
            '<span class="px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-600">CANCELLED</span>';
          break;
        default:
          statusBadge = `<span class="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">${item.status}</span>`;
      }

      const totalFormatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(item.total_price);

      return `
            <tr class="hover:bg-gray-50 transition border-b border-gray-100 last:border-0 group">
                <td class="px-6 py-4 font-mono text-xs text-gray-500">${item.booking_code}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${item.user_name}</td>
                <td class="px-6 py-4 text-gray-600">${item.wisata_nama}</td>
                <td class="px-6 py-4 text-gray-500 text-sm border-l-2 border-transparent">${item.visit_date}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${totalFormatted}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="window.viewDetail('${item.booking_code}')" class="text-wonderful-teal hover:underline text-sm font-medium">Detail</button>
                </td>
            </tr>
        `;
    })
    .join("");

  document
    .getElementById("pagination-info")
    .querySelector("span").innerText = `Menampilkan ${data.length} data`;
}

window.viewDetail = (code) => {
  const item = currentBookings.find((b) => b.booking_code === code);
  if (!item) return;

  const modal = document.getElementById("detail-modal");
  const content = document.getElementById("modal-content");

  const totalFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(item.total_price);

  content.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="text-gray-500 text-xs uppercase mb-1">Kode Booking</p>
                <p class="font-mono font-bold text-lg">${item.booking_code}</p>
            </div>
            <div class="text-right">
                <p class="text-gray-500 text-xs uppercase mb-1">Status</p>
                <p class="font-bold text-gray-800 uppercase">${item.status}</p>
            </div>
        </div>
        <hr class="border-gray-100 my-2">
        <div class="space-y-2">
            <div class="flex justify-between">
                <span class="text-gray-500">Pemesan</span>
                <span class="font-medium">${item.user_name}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Destinasi</span>
                <span class="font-medium text-wonderful-teal">${item.wisata_nama}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Tanggal Kunjungan</span>
                <span class="font-medium">${item.visit_date}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Jumlah Tiket</span>
                <span class="font-medium">${item.quantity} Orang</span>
            </div>
             <div class="flex justify-between">
                <span class="text-gray-500">Metode Bayar</span>
                <span class="font-medium capitalize">${item.payment_method}</span>
            </div>
        </div>
        <hr class="border-gray-100 my-2">
        <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span class="text-gray-600 font-medium">Total Bayar</span>
            <span class="text-xl font-bold text-wonderful-teal">${totalFormatted}</span>
        </div>
    `;

  modal.classList.remove("hidden");
};
