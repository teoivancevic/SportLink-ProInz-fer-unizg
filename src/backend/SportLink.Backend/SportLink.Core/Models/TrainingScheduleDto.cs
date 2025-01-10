namespace SportLink.Core.Models;

public class TrainingScheduleDto
{
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}