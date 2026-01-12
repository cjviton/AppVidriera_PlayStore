using ApiGoogleCalendar.Dtos;
using ApiGoogleCalendar.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiGoogleCalendar.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CalendarController : ControllerBase
{
    private readonly GoogleCalendarService _calendar;

    public CalendarController(GoogleCalendarService calendar)
    {
        _calendar = calendar;
    }

    // GET: /api/calendar/events?from=2025-12-01&to=2025-12-31
    [HttpGet("events")]
    public async Task<IActionResult> GetEvents(
     [FromQuery] DateTime from,
     [FromQuery] DateTime to)
    {
        var events = await _calendar.GetEventsAsync(from, to);

        return Ok(events.Select(e => new
        {
            id = e.Id,
            summary = e.Summary,
            description = e.Description,
            colorId = e.ColorId,
            start = e.Start?.DateTimeDateTimeOffset?.ToString("o")
            ?? e.Start?.Date,
            end = e.End?.DateTimeDateTimeOffset?.ToString("o")
          ?? e.End?.Date
        }));

    }



    // POST: /api/calendar/events
    [HttpPost("create")]
    public async Task<IActionResult> Create(CalendarEventCreateDto dto)
    {
        var result = await _calendar.CreateEventAsync(dto);
        return Ok(result);
    }

    // DELETE: /api/calendar/events/{eventId}
    [HttpDelete("events/{eventId}")]
    public async Task<IActionResult> DeleteEvent(string eventId)
    {
        await _calendar.DeleteEventAsync(eventId);
        return Ok(new { success = true });
    }

    [HttpPut("events/{eventId}")]
    public async Task<IActionResult> UpdateEvent(
    string eventId,
    CalendarEventCreateDto dto)
    {
        var updated = await _calendar.UpdateEventAsync(eventId, dto);
        return Ok(updated);
    }



}
