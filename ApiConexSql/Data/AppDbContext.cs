using Microsoft.EntityFrameworkCore;
//Importa el espacio de nombres de EF Core, que es el ORM (Object Relational Mapper) que permite trabajar con bases de datos usando clases y objetos en lugar de SQL “a mano”.
using ApiConexSql.Models;
//Importa el espacio donde tienes definidos tus modelos (en tu caso la clase Usuario que representa la tabla de usuarios en la BD).


namespace ApiConexSql.Data  //en la carpeta Data para separar la lógica de acceso a datos.
{
    public class AppDbContext : DbContext  //Crea la clase AppDbContext, que hereda de DbContext. 
    // DbContext es la clase base de EF Core que sabe cómo conectarse a la base de datos y mapear las tablas a objetos.
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        //Este es el constructor de la clase.
        //DbContextOptions le pasa las opciones de configuración (cadena de conexión, proveedor de BD, etc.).
        //Llama al constructor base de DbContext (: base(options)), para que quede configurado correctamente.

        public DbSet<Usuario> Usuarios { get; set; }  //Un DbSet<Usuario> representa la tabla Usuarios en la base de datos.
                                                      //Permite hacer consultas y operaciones CRUD (Create, Read, Update, Delete) sobre esa tabla, usando LINQ
    }
}


/* la clase son comentarios para verlo mas claro

using Microsoft.EntityFrameworkCore;
using ApiConexSql.Models;

namespace ApiConexSql.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Usuario> Usuarios { get; set; }
    }
}

*/