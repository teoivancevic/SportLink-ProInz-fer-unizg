using SportLink.Core.Enums;

namespace SportLink.Core.Models;

public class TrainingGroupSearchDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int AgeFrom { get; set; }
    public int AgeTo { get; set; }
    public SexEnum Sex { get; set; }
    public decimal MonthlyPrice { get; set; }
    public List<TrainingScheduleSearchDto> TrainingScheduleDtos { get; set; }
    public string OrganizationName { get; set; }
    public string SportName { get; set; }
    
}