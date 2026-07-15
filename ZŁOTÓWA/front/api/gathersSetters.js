import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "@/api/api";

const ROOM_PREFIX = "room:";
const TRANSACTIONS_PREFIX = "transactions:";

const TRANSACTIONS_KEY = "transaction"
const LOGGED_KEY = "logged";
const ACTIVE_ROOM_KEY = "activeRoom";
const ROOMS_KEY = "rooms";
const USER_KEY = "currentUser";

let currentUser = null;
let logged = false;
let activeRoom = null;
let cachedRooms = [];
let cachedRoomsById = {};
let cachedTransactionsByRoom = {};


export async function startupLoad(onCached, onFresh) {
    await initialize();
    console.log("init activeRoom: ", activeRoom);
    // console.log(cachedTransactionsByRoom);

    const cachedState = {
        logged,
        currentUser,
        activeRoom,
        rooms: cachedRooms,
        activeRoomData: null,
        transactions: [],
    };

    if (activeRoom) {
        cachedState.activeRoomData =
            cachedRoomsById[activeRoom] ||
            await getData(`${ROOM_PREFIX}${activeRoom}`, null);

        cachedState.transactions =
            cachedTransactionsByRoom[activeRoom] ||
            await getData(`${TRANSACTIONS_PREFIX}${activeRoom}`, []);
    }

    onCached?.(cachedState);

    try {
        const roomsData = await api.getRooms();
        const freshRooms = roomsData.rooms || [];

        cachedRooms = freshRooms;
        await saveData(ROOMS_KEY, freshRooms);

        let freshRoomData = null;
        let freshTransactions = [];

        if (activeRoom) {
            const roomData = await api.getRoom(activeRoom);
            freshRoomData = roomData;

            cachedRoomsById[activeRoom] = roomData;
            await saveData(`${ROOM_PREFIX}${activeRoom}`, roomData);

            const transactionsData =
                await api.getRoomTransactions(activeRoom);
            console.log(transactionsData);

            freshTransactions =
                transactionsData.transactions || [];

            cachedTransactionsByRoom[activeRoom] = freshTransactions;
            await saveData(
                `${TRANSACTIONS_PREFIX}${activeRoom}`,
                freshTransactions
            );
        }

        const freshState = {
            logged,
            currentUser,
            activeRoom,
            rooms: freshRooms,
            activeRoomData: freshRoomData,
            transactions: freshTransactions,
        };

        onFresh?.(freshState);

        return freshState;
    } catch (err) {
        console.log("Błąd startupLoad:", err.message);
        return cachedState;
    }
}


async function saveData(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getData(key, fallback = null) {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
}

export async function initialize() {
    logged = await getData(LOGGED_KEY, false);
    activeRoom = await getData(ACTIVE_ROOM_KEY, null);
    cachedRooms = await getData(ROOMS_KEY, []);
    currentUser = await getData(USER_KEY, null);
    cachedTransactionsByRoom = await getData(TRANSACTIONS_KEY, [])

}

export async function uninitialize() {
    await saveData(LOGGED_KEY, logged);
    await saveData(ACTIVE_ROOM_KEY, activeRoom);
    await saveData(ROOMS_KEY, cachedRooms);
    await saveData(USER_KEY, currentUser);
    await saveData(TRANSACTIONS_KEY, cachedTransactionsByRoom)
}


export async function setActiveRoom(roomId) {
    activeRoom = roomId;
    await saveData(ACTIVE_ROOM_KEY, roomId);
}

export function getActiveRoom() {
    return activeRoom;
}

export function getLoged() {
    return logged;
}

export async function setLoged(value) {
    logged = value;
    await saveData(LOGGED_KEY, value);
}

export async function login(email, password) {
    const data = await api.login(email, password);

    if (data.success && data.user) {
        currentUser = data.user;

        await setLoged(true);
        await saveData(USER_KEY, currentUser)
        // .then(() => console.log(currentUser));
    }

    return data;
}
export async function logout() {
    try {
        await api.logout();
        // console.log("to ja");

    } finally {
        logged = false;
        activeRoom = null;
        cachedRooms = [];
        cachedRoomsById = {};
        cachedTransactionsByRoom = {};
        currentUser = null;

        await AsyncStorage.multiRemove([
            LOGGED_KEY,
            ACTIVE_ROOM_KEY,
            ROOMS_KEY,
            USER_KEY,
            TRANSACTIONS_PREFIX,
        ]);
    }
}

export async function gatherRooms(onCached, onFresh) {
    const cached = cachedRooms;

    onCached?.(cached);

    try {
        const data = await api.getRooms();
        const freshRooms = data.rooms || [];

        cachedRooms = freshRooms;
        await saveData(ROOMS_KEY, freshRooms);

        onFresh?.(freshRooms);

        return freshRooms;
    } catch (err) {
        console.log("Błąd pobierania pokoi:", err.message);
        return cached;
    }
}

export async function gatherRoom(roomId = activeRoom, onCached, onFresh) {
    const key = `${ROOM_PREFIX}${roomId}`;
    const cached = cachedRoomsById[roomId] || await getData(key, null);

    onCached?.(cached);

    try {
        const data = await api.getRoom(roomId);

        cachedRoomsById[roomId] = data;

        onFresh?.(data);
        await saveData(key, data);

        return data;
    } catch (err) {
        console.log("Błąd pobierania pokoju:", err.message);
        return cached;
    }
}

export function getChashedTransactions(roomId = activeRoom, howMuch = 25) {
    const transactions = cachedTransactionsByRoom[roomId] || [];

    return transactions.slice(0, howMuch);
}

export async function gatherTransactions(roomId = activeRoom, onCached, onFresh) {
    const key = `${TRANSACTIONS_PREFIX}${roomId}`;

    let cached = [];

    if (onCached) {
        cached = cachedTransactionsByRoom[roomId] || await getData(key, []);
        onCached(cached);
    }

    if (onFresh) try {
        const data = await api.getRoomTransactions(roomId);
        const freshTransactions = data.transactions || [];

        cachedTransactionsByRoom[roomId] = freshTransactions;
        await saveData(key, freshTransactions);

        onFresh?.(freshTransactions);

        return freshTransactions;
    } catch (err) {
        console.log("Błąd pobierania transakcji:", err.message);
        return cached;
    }
}

export async function createRoom(name) {
    const data = await api.createRoom(name);

    await gatherRooms();

    return data;
}

export async function addFriendToRoom(roomId, name) {
    const data = await api.addFriendToRoom(roomId, name);

    await gatherRoom(roomId);

    return data;
}

export async function createTransaction(roomId, amount, desc, users) {
    const data = await api.createTransaction(roomId, amount, desc, users);

    await gatherTransactions(roomId);
    await gatherRoom(roomId);

    return data;
}

export async function createSingleTransaction(roomId, amount, desc, userId
) {
    const data = await api.createSingleTransaction(
        roomId,
        amount,
        desc,
        userId
    );

    await gatherTransactions(roomId);
    await gatherRoom(roomId);

    return data;
}

export function getCurrentUser() {
    return currentUser;
}

export function getCurrentUserId() {
    return currentUser?.id ?? null;
}

export async function register(name, email, password) {
    return await api.register(
        name,
        email,
        password
    );
}

