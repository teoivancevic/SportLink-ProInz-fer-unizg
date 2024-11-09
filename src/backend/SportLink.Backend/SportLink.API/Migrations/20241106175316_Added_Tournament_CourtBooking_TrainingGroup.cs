using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class Added_Tournament_CourtBooking_TrainingGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "Organization");

            migrationBuilder.AddColumn<string>(
                name: "RejectionResponse",
                table: "Organization",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VerificationStatus",
                table: "Organization",
                type: "text",
                nullable: false,
                defaultValue: "Unverified");

            migrationBuilder.CreateTable(
                name: "CourtBooking",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TimeFrom = table.Column<TimeSpan>(type: "interval", nullable: false),
                    TimeTo = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HourlyPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    SportId = table.Column<int>(type: "integer", nullable: false),
                    OrganizationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "Tournament",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    TimeFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimeTo = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EntryFee = table.Column<decimal>(type: "numeric", nullable: false),
                    OrganizationId = table.Column<int>(type: "integer", nullable: false),
                    SportId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournament", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tournament_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tournament_Sport_SportId",
                        column: x => x.SportId,
                        principalTable: "Sport",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrainingGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AgeFrom = table.Column<int>(type: "integer", nullable: false),
                    AgeTo = table.Column<int>(type: "integer", nullable: false),
                    Sex = table.Column<string>(type: "text", nullable: false),
                    MonthlyPrice = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    OrganizationId = table.Column<int>(type: "integer", nullable: false),
                    SportId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingGroup_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrainingGroup_Sport_SportId",
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

            migrationBuilder.CreateIndex(
                name: "IX_Tournament_OrganizationId",
                table: "Tournament",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Tournament_SportId",
                table: "Tournament",
                column: "SportId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingGroup_OrganizationId",
                table: "TrainingGroup",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingGroup_SportId",
                table: "TrainingGroup",
                column: "SportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourtBooking");

            migrationBuilder.DropTable(
                name: "Tournament");

            migrationBuilder.DropTable(
                name: "TrainingGroup");

            migrationBuilder.DropColumn(
                name: "RejectionResponse",
                table: "Organization");

            migrationBuilder.DropColumn(
                name: "VerificationStatus",
                table: "Organization");

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "Organization",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
