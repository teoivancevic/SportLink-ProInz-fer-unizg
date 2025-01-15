using SportLink.Core.Enums;

namespace SportLink.Core.Models;

public class TrainingScheduleDto
{
    public DanUTjednuEnum DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}