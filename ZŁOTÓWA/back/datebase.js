const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("zlotowa.db");

db.run(`
CREATE TABLE IF NOT EXISTS Users (
    U_ID_User INTEGER PRIMARY KEY AUTOINCREMENT,
    U_Name TEXT NOT NULL,
    U_Password TEXT NOT NULL,
    U_Date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    U_Email TEXT UNIQUE NOT NULL
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS Rooms (
    R_ID_Room INTEGER PRIMARY KEY AUTOINCREMENT,
    U_ID_Host INTEGER,
    R_Name TEXT NOT NULL,
    R_Date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    R_Date_closed DATETIME,
    FOREIGN KEY(U_ID_Host) REFERENCES Users(U_ID_User)
);
`);

db.run(`
    CREATE TABLE IF NOT EXISTS Room_Members (
    R_ID_Room INTEGER,
    U_ID_User INTEGER,
    RM_Date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(R_ID_Room) REFERENCES Rooms(R_ID_Room),
    FOREIGN KEY(U_ID_User) REFERENCES Users(U_ID_User)
);
`);

db.run(`
CREATE UNIQUE INDEX IF NOT EXISTS idx_room_user
ON Room_Members(R_ID_Room, U_ID_User);
`);

db.run(`
CREATE TABLE IF NOT EXISTS Transactions (
    T_ID_Transaction INTEGER PRIMARY KEY AUTOINCREMENT,
    R_ID_Room INTEGER,
    U_ID_Creditor INTEGER,
    U_ID_Borrower INTEGER,
    T_Amount DECIMAL(8,2),
    T_Description TEXT,
    T_Date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    T_File TEXT,
    FOREIGN KEY(R_ID_Room) REFERENCES Rooms(R_ID_Room),
    FOREIGN KEY(U_ID_Creditor) REFERENCES Users(U_ID_User),
    FOREIGN KEY(U_ID_Borrower) REFERENCES Users(U_ID_User)
);
`);

module.exports = db;
