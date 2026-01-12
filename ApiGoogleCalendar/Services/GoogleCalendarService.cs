using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using ApiGoogleCalendar.Dtos;

namespace ApiGoogleCalendar.Services;

public class GoogleCalendarService
{
    private readonly CalendarService _calendarService;
    private readonly string _calendarId;

    public GoogleCalendarService(IConfiguration config)
    {
        _calendarId = config["GoogleCalendar:CalendarId"]
                      ?? throw new Exception("Falta GoogleCalendar:CalendarId en appsettings.json");

        var jsonPath = config["GoogleCalendar:ServiceAccountJsonPath"]
                       ?? throw new Exception("Falta GoogleCalendar:ServiceAccountJsonPath en appsettings.json");

        var credential = GoogleCredential
            .FromFile(jsonPath)
            .CreateScoped(CalendarService.Scope.Calendar);

        _calendarService = new CalendarService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "ApiGoogleCalendar"
        });
    }

    public async Task<IList<Event>> GetEventsAsync(DateTime from, DateTime to)
    {
        var request = _calendarService.Events.List(_calendarId);
        request.TimeMinDateTimeOffset = new DateTimeOffset(from);
        request.TimeMaxDateTimeOffset = new DateTimeOffset(to);
        request.SingleEvents = true;
        request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

        var events = await request.ExecuteAsync();
        return events.Items ?? new List<Event>();
    }

    public async Task<Event> CreateEventAsync(CalendarEventCreateDto dto)
    {
        var newEvent = new Event
        {
            Summary = dto.Summary,
            Description = dto.Description,

            Start = new EventDateTime
            {
                DateTimeDateTimeOffset = new DateTimeOffset(dto.Start),
                TimeZone = dto.TimeZone
            },
            End = new EventDateTime
            {
                DateTimeDateTimeOffset = new DateTimeOffset(dto.End),
                TimeZone = dto.TimeZone
            },

            
            ColorId = dto.ColorId,

        };

        var insertRequest = _calendarService.Events.Insert(newEvent, _calendarId);
        return await insertRequest.ExecuteAsync();
    }

    public async Task DeleteEventAsync(string eventId)
    {
        var deleteRequest = _calendarService.Events.Delete(_calendarId, eventId);
        await deleteRequest.ExecuteAsync();
    }

    public async Task<Event> UpdateEventAsync(string eventId, CalendarEventCreateDto dto)
    {
        var ev = await _calendarService.Events.Get(_calendarId, eventId).ExecuteAsync();

        ev.Summary = dto.Summary;
        ev.Description = dto.Description;
        ev.ColorId = dto.ColorId;

        ev.Start = new EventDateTime
        {
            DateTimeDateTimeOffset = new DateTimeOffset(dto.Start),
            TimeZone = dto.TimeZone
        };

        ev.End = new EventDateTime
        {
            DateTimeDateTimeOffset = new DateTimeOffset(dto.End),
            TimeZone = dto.TimeZone
        };

        var request = _calendarService.Events.Update(ev, _calendarId, eventId);
        return await request.ExecuteAsync();
    }

}
