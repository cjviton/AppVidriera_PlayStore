using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ApiConexSql.Models;

namespace ApiConexSql.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IConfiguration _config;

        public UsuariosController(IConfiguration config)
        {
            _config = config;
        }

        // REGISTRO DE USUARIO
        [HttpPost("register")]
        public IActionResult Register([FromBody] Usuario usuario)
        {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                connection.Open();

                var cmd = new SqlCommand("INSERT INTO Usuarios (Nombre, Email, PasswordHash, FechaRegistro) VALUES (@n, @e, @p, @f)", connection);
                cmd.Parameters.AddWithValue("@n", usuario.Nombre);
                cmd.Parameters.AddWithValue("@e", usuario.Email);
                cmd.Parameters.AddWithValue("@p", usuario.PasswordHash);
                cmd.Parameters.AddWithValue("@f", DateTime.Now);
                cmd.ExecuteNonQuery();

                return Ok(new { success = true, message = "Usuario registrado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario usuario)
        {
            try
            {
                using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                connection.Open();

                var cmd = new SqlCommand("SELECT Nombre FROM Usuarios WHERE Email=@e AND PasswordHash=@p", connection);
                cmd.Parameters.AddWithValue("@e", usuario.Email);
                cmd.Parameters.AddWithValue("@p", usuario.PasswordHash);

                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var nombre = reader.GetString(0);
                    return Ok(new { success = true, nombre });
                }

                return Unauthorized(new { success = false, message = "Credenciales inválidas" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // LISTAR USUARIOS (opcional, para pruebas)
        [HttpGet]
        public IActionResult GetUsuarios()
        {
            var lista = new List<Usuario>();
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();

            var cmd = new SqlCommand("SELECT * FROM Usuarios", connection);
            var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                lista.Add(new Usuario
                {
                    Id = reader.GetInt32(0),
                    Nombre = reader.GetString(1),
                    Email = reader.GetString(2),
                    PasswordHash = reader.GetString(3),
                    FechaRegistro = reader.GetDateTime(4)
                });
            }

            return Ok(lista);
        }
    }
}
