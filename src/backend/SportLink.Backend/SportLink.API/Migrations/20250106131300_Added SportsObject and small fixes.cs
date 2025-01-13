using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedSportsObjectandsmallfixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocialNetwork_Organization_OrganizationId",
                table: "SocialNetwork");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingGroup_Organization_OrganizationId",
                table: "TrainingGroup");

            migrationBuilder.DropTable(
                name: "CourtBooking");

            migrationBuilder.CreateTable(
                name: "SportsObject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrganizationId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportsObject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportsObject_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SportCourt",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SportId = table.Column<int>(type: "int", nullable: false),
                    AvailableCourts = table.Column<int>(type: "int", nullable: false),
                    SportsObjectId = table.Column<int>(type: "int", nullable: false),
                    CurrencyISO = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    minHourlyPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    maxHourlyPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportCourt", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportCourt_Sport_SportId",
                        column: x => x.SportId,
                        principalTable: "Sport",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SportCourt_SportsObject_SportsObjectId",
                        column: x => x.SportsObjectId,
                        principalTable: "SportsObject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkTime",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SportsObjectId = table.Column<int>(type: "int", nullable: false),
                    DaysOfWeek = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OpenFrom = table.Column<TimeOnly>(type: "time", nullable: false),
                    OpenTo = table.Column<TimeOnly>(type: "time", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkTime", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkTime_SportsObject_SportsObjectId",
                        column: x => x.SportsObjectId,
                        principalTable: "SportsObject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SportCourt_SportId",
                table: "SportCourt",
                column: "SportId");

            migrationBuilder.CreateIndex(
                name: "IX_SportCourt_SportsObjectId",
                table: "SportCourt",
                column: "SportsObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SportsObject_OrganizationId",
                table: "SportsObject",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkTime_SportsObjectId",
                table: "WorkTime",
                column: "SportsObjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_SocialNetwork_Organization_OrganizationId",
                table: "SocialNetwork",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingGroup_Organization_OrganizationId",
                table: "TrainingGroup",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocialNetwork_Organization_OrganizationId",
                table: "SocialNetwork");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingGroup_Organization_OrganizationId",
                table: "TrainingGroup");

            migrationBuilder.DropTable(
                name: "SportCourt");

            migrationBuilder.DropTable(
                name: "WorkTime");

            migrationBuilder.DropTable(
                name: "SportsObject");

            migrationBuilder.CreateTable(
                name: "CourtBooking",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationId = table.Column<int>(type: "int", nullable: false),
                    SportId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HourlyPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TimeFrom = table.Column<TimeSpan>(type: "time", nullable: false),
                    TimeTo = table.Column<TimeSpan>(type: "time", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourtBooking", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourtBooking_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourtBooking_Sport_SportId",
                        column: x => x.SportId,
                        principalTable: "Sport",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourtBooking_OrganizationId",
                table: "CourtBooking",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_CourtBooking_SportId",
                table: "CourtBooking",
                column: "SportId");

            migrationBuilder.AddForeignKey(
                name: "FK_SocialNetwork_Organization_OrganizationId",
                table: "SocialNetwork",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingGroup_Organization_OrganizationId",
                table: "TrainingGroup",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
