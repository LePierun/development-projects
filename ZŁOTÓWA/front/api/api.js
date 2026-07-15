import { triggerLogout } from "@/api/sessionEvent";
import { trigerOfflineMode, trigerOnlineMode } from "@/api/sessionEvent";
import { getLoged } from "./gathersSetters";

// const API_URL = "http://192.168.1.11:3000";
const API_URL = "tutaj_podać_adress_serwera_z_backendem";

let sessionExpiredHandled = false;

async function request(endpoint, options = {}) {
    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            credentials: "include",
        });
    } catch (err) {
        console.log("FETCH ERROR:", err.message);
        trigerOfflineMode();
        throw new Error("Brak połączenia z serwerem");
    }

    const text = await response.text();

    let data;

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error("Serwer zwrócił nieprawidłową odpowiedź");
    }

    const isLoginRequest = endpoint === "/login";
    const isLogoutRequest = endpoint === "/logout";

    if (response.status === 401) {
        const message = data?.message || "Brak autoryzacji";

        if (isLoginRequest) {
            throw new Error(message || "Błędny email lub hasło");
        }

        if (isLogoutRequest) {
            return {
                success: false,
                sessionExpired: true,
                message: "Sesja była już zakończona.",
            };
        }

        if (getLoged() && !sessionExpiredHandled) {
            sessionExpiredHandled = true;
            triggerLogout();
        }

        return {
            success: false,
            sessionExpired: true,
            message: "Sesja wygasła. Zaloguj się ponownie.",
        };
    }

    if (!response.ok || data.success === false) {
        const message = data?.message || `Błąd serwera: ${response.status}`;
        throw new Error(message);
    }

    trigerOnlineMode();
    sessionExpiredHandled = false;

    return data;
}

export function login(email, password) {
    return request("/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export function logout() {
    return request("/logout", {
        method: "GET",
    });
}

export function register(name, email, password) {
    return request("/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });
}

export function createRoom(name) {
    return request("/new_room", {
        method: "POST",
        body: JSON.stringify({
            name,
        }),
    });
}

export function getRooms() {
    return request("/home", {
        method: "GET",
    });
}

export function getRoom(roomId) {
    return request(`/room/${roomId}`, {
        method: "GET",
    });
}

export function addFriendToRoom(roomId, name) {
    return request(`/new_user_in_room/${roomId}`, {
        method: "POST",
        body: JSON.stringify({
            name,
        }),
    });
}

export function getRoomTransactions(roomId) {
    return request(`/room/${roomId}/transactions`, {
        method: "GET",
    });
}

export function createTransaction(roomId, amount, desc, users) {
    return request(`/new_transaction/${roomId}`, {
        method: "POST",
        body: JSON.stringify({
            amount,
            desc,
            users,
        }),
    });
}

export function createSingleTransaction(roomId, amount, desc, userId) {
    return request(`/new_single_transaction/${roomId}`, {
        method: "POST",
        body: JSON.stringify({
            amount,
            desc,
            user: userId,
        }),
    });
}