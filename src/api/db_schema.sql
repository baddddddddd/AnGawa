
CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255),
    MiddleName VARCHAR(255),
    LastName VARCHAR(255),
    NameExt VARCHAR(255),
    BIRTHDATE DATE,
    GENDER ENUM('Male', 'Female', 'Other')
    Email VARCHAR(255) NOT NULL,
    HashedPw VARCHAR(255) NOT NULL
);

CREATE TABLE Tasks (
    TaskId INT,
    TaskName VARCHAR(255),
    Description TEXT,
    Deadline DATETIME,
    Duration INT,
    Priority INT,
    FatiguingLevel INT,
    UserId INT,
    Status ENUM('Pending','Completed'),
    PRIMARY KEY(TaskId, UserId),
    FOREIGN KEY(UserId) REFERENCES Users(UserId)

);

CREATE TABLE Notes(
    NoteId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    FOREIGN KEY(UserId) REFERENCES Users(UserId),
    NoteTitle VARCHAR(255) NOT NULL,
    NoteContent JSON,
    LastModified DATETIME
);

CREATE TABLE UserSettings (
    UserId INT,
    TotalEnergy INT,
    WorkTime JSON,
    PRIMARY KEY (UserId),
    FOREIGN KEY(UserId) REFERENCES Users(UserId)

);

