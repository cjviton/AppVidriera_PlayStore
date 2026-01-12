CREATE DATABASE AppVidrieraDB;
GO

USE AppVidrieraDB;
GO


CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(200) NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE()[dbo].[Usuarios]
);


INSERT INTO Usuarios (Nombre, Email, PasswordHash)
VALUES ('Carlos Jiménez', 'carlos@email.com', '123456');

SELECT * FROM Usuarios;
