using SportLink.Core.Enums;
using SportLink.Core.Models;

public static class TestData
{
    public static SportObjectDto CreateSportObjectDto()
    {
        return new SportObjectDto
        {
            Id = 1,
            Name = "Central Tennis Updated",
            Description = "Premier tennis facility with indoor and outdoor courts UPDATED",
            Location = "123 Sports Avenue, City B",
            OrganizationId = 1,
            SportCourts = new List<SportCourtDto>
            {
                new SportCourtDto
                {
                    Id = 1,
                    SportId = 1,
                    //SportName = "Tennis",
                    AvailableCourts = 6,
                    SportsObjectId = 1,
                    MaxHourlyPrice = 30.00M
                }
            },
            WorkTimes = new List<WorkTimeDto>
                {
                    new WorkTimeDto
                    {
                        Id = 1,
                        DayOfWeek = DanUTjednuEnum.Ponedjeljak,
                        IsWorking = true,
                        OpenFrom = "07:00",
                        OpenTo = "23:00"
                    },
                    new WorkTimeDto
                    {
                        Id = 2,
                        DayOfWeek = DanUTjednuEnum.Utorak,
                        IsWorking = true,
                        OpenFrom = "07:00",
                        OpenTo = "23:00"
                    },
                    new WorkTimeDto
                    {
                        Id = 3,
                        DayOfWeek = DanUTjednuEnum.Srijeda,
                        IsWorking = true,
                        OpenFrom = "07:00",
                        OpenTo = "23:00"
                    },
                    new WorkTimeDto
                    {
                        Id = 4,
                        DayOfWeek = DanUTjednuEnum.Četvrtak,
                        IsWorking = true,
                        OpenFrom = "07:00",
                        OpenTo = "23:00"
                    },
                    new WorkTimeDto
                    {
                        Id = 5,
                        DayOfWeek = DanUTjednuEnum.Petak,
                        IsWorking = true,
                        OpenFrom = "07:00",
                        OpenTo = "23:00"
                    },
                    new WorkTimeDto
                    {
                        Id = 6,
                        DayOfWeek = DanUTjednuEnum.Subota,
                        IsWorking = true,
                        OpenFrom = "08:00",
                        OpenTo = "20:00"
                    },
                    new WorkTimeDto
                    {
                        Id = 7,
                        DayOfWeek = DanUTjednuEnum.Nedjelja,
                        IsWorking = true,
                        OpenFrom = "08:00",
                        OpenTo = "20:00"
                    }
                }
        };
    }

    public static SportObjectDto CreateMultiSportObjectDto()
    {
        return new SportObjectDto
        {
            Name = "MultiSport Arena",
            Description = "Modern sports complex with multiple courts",
            Location = "456 Athletic Drive, City B",
            OrganizationId = 2,
            SportCourts = new List<SportCourtDto>
            {
                new SportCourtDto
                {
                    SportId = 2,
                    SportName = "Basketball",
                    AvailableCourts = 3,
                    SportsObjectId = 2,
                    MaxHourlyPrice = 45.00M
                },
                new SportCourtDto
                {
                    SportId = 3,
                    SportName = "Volleyball",
                    AvailableCourts = 2,
                    SportsObjectId = 2,
                    MaxHourlyPrice = 40.00M
                }
            },
            WorkTimes = new List<WorkTimeDto>
            {
                new WorkTimeDto
                {
                    DayOfWeek = DanUTjednuEnum.Ponedjeljak,
                    IsWorking = true,
                    OpenFrom = "06:00",
                    OpenTo = "23:00"
                },
                new WorkTimeDto
                {
                    DayOfWeek = DanUTjednuEnum.Utorak,
                    IsWorking = true,
                    OpenFrom = "06:00",
                    OpenTo = "23:00"
                },
                new WorkTimeDto
                {
                    DayOfWeek = DanUTjednuEnum.Subota,
                    IsWorking = true,
                    OpenFrom = "08:00",
                    OpenTo = "22:00"
                },
                new WorkTimeDto
                {
                    DayOfWeek = DanUTjednuEnum.Nedjelja,
                    IsWorking = false,
                    OpenFrom = null,
                    OpenTo = null
                }
            }
        };
    }
}