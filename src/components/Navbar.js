/**
 * Navbar Component
 */
export function renderNavbar(containerId = "navbar-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const username = localStorage.getItem("user_name") || "Admin";

  const html = `
        <header class="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button onclick="toggleSidebar()" class="md:hidden text-gray-600 hover:text-wonderful-teal transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <div class="hidden md:block">
                    <h1 class="text-xl font-bold text-gray-800" id="page-title">Dashboard</h1>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <!-- Notifications (Static) -->
                <button class="relative p-2 text-gray-400 hover:text-wonderful-teal transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <!-- Profile Dropdown (Simplified) -->
                <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-semibold text-gray-700">${username}</p>
                        <p class="text-xs text-gray-500">Super Admin</p>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-wonderful-teal text-white flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-teal-100">
                        ${username.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    `;

  container.innerHTML = html;
}
