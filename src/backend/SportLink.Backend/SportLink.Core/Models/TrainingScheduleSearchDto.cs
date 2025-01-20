using SportLink.Core.Enums;

namespace SportLink.Core.Models;

public class TrainingScheduleSearchDto
{
    public int Id { get; set; }
    public int TrainingGroupId { get; set; }
    public DanUTjednuEnum DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}