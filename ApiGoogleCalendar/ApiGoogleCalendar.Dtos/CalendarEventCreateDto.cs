
//Aqui definimos que datos entran o salen de la API
//Qué necesita la API para crear un evento
//Qué espera recibir desde Swagger o desde React Native

namespace ApiGoogleCalendar.Dtos;

public class CalendarEventCreateDto
{
    public string Summary { get; set; } = "";
    public string? Description { get; set; }

    public DateTime Start { get; set; }
    public DateTime End { get; set; }

    public string TimeZone { get; set; } = "Europe/Madrid";

    public string ColorId { get; set; } = "9"; // azul por defecto

}
