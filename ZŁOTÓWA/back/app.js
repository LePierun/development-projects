const express = require("express");
const app = express();
const db = require("./datebase");
const bcrypt = require("bcrypt");
const path = require("path");
const session = require("express-session");
const util = require("util");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "tajny-klucz",
        resave: false,
        saveUninitialized: false,
    })
);

db.getAsync = util.promisify(db.get);
db.allAsync = util.promisify(db.all);

const publicRoutes = ["/login", "/register", "/"];

app.use((req, res, next) => {
    if (!req.session.user && !publicRoutes.includes(req.path)) {
        return res.status(401).json({
            success: false,
            message: "Brak sesji. Zaloguj się ponownie.",
        });
    }
    console.log("PATH:", req.path);
    console.log("COOKIE:", req.headers.cookie);
    console.log("SESSION USER:", req.session.user);
    next();
});

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "API działa",
    });
});

// REJESTRACJA

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const userName = name?.trim();
    const userEmail = email?.trim().toLowerCase();

    if (!userName || !userEmail || !password) {
        return res.status(400).json({
            success: false,
            message: "Uzupełnij wszystkie pola",
        });
    }

    db.get(
        "SELECT U_ID_User FROM Users WHERE U_Name = ?",
        [userName],
        (err, existingName) => {
            if (err) {
                console.log(err.message);

                return res.status(500).json({
                    success: false,
                    message: "Błąd sprawdzania nazwy użytkownika",
                });
            }

            if (existingName) {
                return res.status(400).json({
                    success: false,
                    message: "Taka nazwa użytkownika już istnieje",
                });
            }

            db.get(
                "SELECT U_ID_User FROM Users WHERE U_Email = ?",
                [userEmail],
                (err, existingEmail) => {
                    if (err) {
                        console.log(err.message);

                        return res.status(500).json({
                            success: false,
                            message: "Błąd sprawdzania emaila",
                        });
                    }

                    if (existingEmail) {
                        return res.status(400).json({
                            success: false,
                            message: "Taki email już istnieje",
                        });
                    }

                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Błąd szyfrowania hasła",
                            });
                        }

                        db.run(
                            "INSERT INTO Users (U_Name, U_Password, U_Email) VALUES (?, ?, ?)",
                            [userName, hash, userEmail],
                            (err) => {
                                if (err) {
                                    console.log(err.message);

                                    return res.status(500).json({
                                        success: false,
                                        message: "Błąd tworzenia konta",
                                    });
                                }

                                return res.json({
                                    success: true,
                                    message: "Zarejestrowano",
                                });
                            }
                        );
                    });
                }
            );
        }
    );
});

// LOGOWANIE

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Podaj email i hasło",
        });
    }

    db.get("SELECT * FROM Users WHERE U_Email = ?", [email.trim()], (err, user) => {
        if (err) {
            console.log(err.message);

            return res.status(500).json({
                success: false,
                message: "Błąd bazy danych",
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Błędny email lub hasło",
            });
        }

        bcrypt.compare(password, user.U_Password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Błąd sprawdzania hasła",
                });
            }

            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: "Błędny email lub hasło",
                });
            }

            req.session.user = {
                id: user.U_ID_User,
                name: user.U_Name,
            };

            return res.json({
                success: true,
                message: "Zalogowano",
                user: req.session.user,
            });
        });
    });
});

// POKOJE UŻYTKOWNIKA

app.get("/home", (req, res) => {
    const query = `
    SELECT * FROM Rooms 
    WHERE R_ID_Room IN (
      SELECT R_ID_Room 
      FROM Room_Members 
      WHERE U_ID_User = ?
    )
    ORDER BY R_Date_created DESC
  `;

    db.all(query, [req.session.user.id], (err, rooms) => {
        if (err) {
            console.error(err.message);

            return res.status(500).json({
                success: false,
                message: "Błąd pobierania rachunków",
            });
        }

        return res.json({
            success: true,
            rooms,
            user: req.session.user,
        });
    });
});

// TWORZENIE POKOJU

app.post("/new_room", (req, res) => {
    const name = req.body.name;
    const host = req.session.user.id;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Podaj nazwę rachunku",
        });
    }

    db.run(
        "INSERT INTO Rooms (U_ID_Host, R_Name) VALUES (?, ?)",
        [host, name.trim()],
        function (err) {
            if (err) {
                console.log(err.message);

                return res.status(500).json({
                    success: false,
                    message: "Problem ze stworzeniem rachunku",
                });
            }

            const roomId = this.lastID;

            db.run(
                "INSERT INTO Room_Members (R_ID_Room, U_ID_User) VALUES (?, ?)",
                [roomId, host],
                (err) => {
                    if (err) {
                        console.log(err.message);

                        return res.status(500).json({
                            success: false,
                            message: "Problem z dodaniem hosta do rachunku",
                        });
                    }

                    return res.json({
                        success: true,
                        message: "Rachunek utworzony",
                        room: {
                            id: roomId,
                            name: name.trim(),
                            host,
                        },
                    });
                }
            );
        }
    );
});

// DANE POKOJU

app.get("/room/:id", async (req, res) => {
    const roomId = req.params.id;
    const userID = req.session.user.id;

    try {
        const room = await db.getAsync(
            `
      SELECT * FROM Rooms
      WHERE R_ID_Room = ?
    `,
            [roomId]
        );

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Pokój nie istnieje",
            });
        }

        const membership = await db.getAsync(
            `
      SELECT * FROM Room_Members
      WHERE R_ID_Room = ? AND U_ID_User = ?
    `,
            [roomId, userID]
        );

        if (!membership) {
            return res.status(403).json({
                success: false,
                message: "Nie masz dostępu do tego pokoju",
            });
        }

        const users = await db.allAsync(
            `
      SELECT
        U.U_ID_User,
        U.U_Name,
        COALESCE(
          SUM(
            CASE 
              WHEN T.U_ID_Creditor = ? AND T.U_ID_Borrower = U.U_ID_User THEN T.T_Amount
              WHEN T.U_ID_Borrower = ? AND T.U_ID_Creditor = U.U_ID_User THEN -T.T_Amount
              ELSE 0
            END
          ), 0
        ) AS balance
      FROM Users U
      LEFT JOIN Room_Members RM
        ON U.U_ID_User = RM.U_ID_User
      LEFT JOIN Transactions T
        ON T.R_ID_Room = RM.R_ID_Room
        AND (T.U_ID_Creditor = U.U_ID_User OR T.U_ID_Borrower = U.U_ID_User)
      WHERE RM.R_ID_Room = ?
        AND U.U_ID_User != ?
      GROUP BY U.U_ID_User
    `,
            [userID, userID, roomId, userID]
        );

        return res.json({
            success: true,
            room,
            users,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Błąd pobierania pokoju",
        });
    }
});

//dodawanie uzytkownika do pokoju 
// app.post("/new_user_in_room/:id", (req, res) => {
//     const user_name = req.body.name;
//     const roomId = req.params.id;
//     db.run(
//         `INSERT INTO Room_Members (R_ID_Room, U_ID_User) VALUES (?, (SELECT U_ID_User FROM Users WHERE U_Name = ?));`,
//         [roomId, user_name],
//         function (err) {
//             if (err) {
//                 if (err.message.includes("UNIQUE constraint failed")) {
//                     return res.send("Użytkownik już jest dodany");
//                 }
//                 return res.send("Błąd bazy");
//             }

//             res.redirect("/room/" + roomId);
//         }
//     );

// });
// DODAWANIE UŻYTKOWNIKA DO POKOJU

app.post("/new_user_in_room/:id", (req, res) => {
    const userName = req.body.name?.trim();
    const roomId = req.params.id;

    if (!userName) {
        return res.status(400).json({
            success: false,
            message: "Podaj nazwę użytkownika",
        });
    }

    const query = `
        INSERT INTO Room_Members (R_ID_Room, U_ID_User)
        VALUES (
            ?,
            (SELECT U_ID_User FROM Users WHERE U_Name = ?)
        )
    `;

    db.run(query, [roomId, userName], function (err) {
        if (err) {
            console.error(err.message);

            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({
                    success: false,
                    message: "Użytkownik już jest dodany do tego rachunku",
                });
            }

            if (
                err.message.includes("NOT NULL constraint failed") ||
                err.message.includes("NULL")
            ) {
                return res.status(404).json({
                    success: false,
                    message: "Nie znaleziono użytkownika o takiej nazwie",
                });
            }

            return res.status(500).json({
                success: false,
                message: "Błąd dodawania użytkownika",
            });
        }

        return res.json({
            success: true,
            message: "Użytkownik został dodany",
            addedUser: userName,
        });
    });
});



// DODAWANIE TRANSAKCJI

app.post("/new_transaction/:id", (req, res) => {
    const roomId = req.params.id;
    const creditor = req.session.user.id;
    const desc = req.body.desc || "";
    const amount = Number(req.body.amount);
    let borrowers = req.body.users;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Kwota musi być liczbą większą od zera",
        });
    }

    if (desc.length > 32) {
        return res.status(400).json({
            success: false,
            message: "Opis może mieć maksymalnie 32 znaki",
        });
    }

    if (!borrowers) {
        return res.status(400).json({
            success: false,
            message: "Musisz wybrać przynajmniej jednego użytkownika",
        });
    }

    if (!Array.isArray(borrowers)) {
        borrowers = [borrowers];
    }

    borrowers = borrowers
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id));

    if (borrowers.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Nieprawidłowa lista użytkowników",
        });
    }

    const share = Number((amount / borrowers.length).toFixed(2));

    const insertQuery = `
    INSERT INTO Transactions 
    (R_ID_Room, U_ID_Creditor, U_ID_Borrower, T_Amount, T_Description)
    VALUES (?, ?, ?, ?, ?)
  `;

    let done = 0;
    let failed = false;

    borrowers.forEach((borrower) => {
        db.run(
            insertQuery,
            [roomId, creditor, borrower, share, desc.trim()],
            function (err) {
                if (failed) return;

                if (err) {
                    failed = true;
                    console.log(err.message);

                    return res.status(500).json({
                        success: false,
                        message: "Błąd dodawania transakcji",
                    });
                }

                done++;

                if (done === borrowers.length) {
                    return res.json({
                        success: true,
                        message: "Transakcja dodana",
                    });
                }
            }
        );
    });
});

//DODANEI POJEDYŃCZEJ TRANSAKCJI
app.post("/new_single_transaction/:id", (req, res) => {
    const roomId = req.params.id;
    const creditor = req.session.user.id;
    const borrower = Number(req.body.user);
    const desc = req.body.desc || "";
    const amount = Number(req.body.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Kwota musi być liczbą większą od zera",
        });
    }

    if (desc.length > 32) {
        return res.status(400).json({
            success: false,
            message: "Opis może mieć maksymalnie 32 znaki",
        });
    }

    if (!borrower || !Number.isInteger(borrower)) {
        return res.status(400).json({
            success: false,
            message: "Nieprawidłowy użytkownik",
        });
    }

    const insertQuery = `
        INSERT INTO Transactions 
        (R_ID_Room, U_ID_Creditor, U_ID_Borrower, T_Amount, T_Description)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        insertQuery,
        [roomId, creditor, borrower, amount, desc.trim()],
        function (err) {
            if (err) {
                console.log(err.message);

                return res.status(500).json({
                    success: false,
                    message: "Błąd dodawania transakcji",
                });
            }

            return res.json({
                success: true,
                message: "Transakcja dodana",
                transaction: {
                    id: this.lastID,
                    roomId,
                    creditor,
                    borrower,
                    amount,
                    desc: desc.trim(),
                },
            });
        }
    );
});

// HISTORIA TRANSAKCJI

app.get("/room/:id/transactions", (req, res) => {
    const roomId = req.params.id;

    const query = `
    SELECT 
      T.*, 
      C.U_Name AS CreditorName, 
      B.U_Name AS BorrowerName
    FROM Transactions T
    LEFT JOIN Users C 
      ON T.U_ID_Creditor = C.U_ID_User
    LEFT JOIN Users B 
      ON T.U_ID_Borrower = B.U_ID_User
    WHERE T.R_ID_Room = ?
    ORDER BY T.T_Date_created DESC;
  `;

    db.all(query, [roomId], (err, transactions) => {
        if (err) {
            console.error(err.message);

            return res.status(500).json({
                success: false,
                message: "Błąd pobierania transakcji",
            });
        }

        return res.json({
            success: true,
            transactions,
        });
    });
});

// ZMIANA HASŁA

app.post("/new_password", (req, res) => {
    const { old_password, password } = req.body;
    const userID = req.session.user.id;

    if (!old_password || !password) {
        return res.status(400).json({
            success: false,
            message: "Podaj stare i nowe hasło",
        });
    }

    db.get("SELECT * FROM Users WHERE U_ID_User = ?", [userID], (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Błąd bazy danych",
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Nie znaleziono użytkownika",
            });
        }

        bcrypt.compare(old_password, user.U_Password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Błąd sprawdzania hasła",
                });
            }

            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: "Błędne stare hasło",
                });
            }

            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Błąd szyfrowania hasła",
                    });
                }

                db.run(
                    "UPDATE Users SET U_Password = ? WHERE U_ID_User = ?",
                    [hash, userID],
                    (err) => {
                        if (err) {
                            console.log(err.message);

                            return res.status(500).json({
                                success: false,
                                message: "Błąd zapisania nowego hasła",
                            });
                        }

                        return res.json({
                            success: true,
                            message: "Hasło zostało zmienione",
                        });
                    }
                );
            });
        });
    });
});

// WYLOGOWANIE

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Nie udało się wylogować",
            });
        }

        res.clearCookie("connect.sid");

        return res.json({
            success: true,
            message: "Wylogowano pomyślnie",
        });
    });
});

// 404 JSON

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Nie znaleziono endpointu",
    });
});

// START SERWERA

app.listen(3000, "0.0.0.0", () => {
    console.log("Serwer działa na http://localhost:3000");
});