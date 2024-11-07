using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class Added_Sports_Reviews_SocialNetworks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Review",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    OrganizationId = table.Column<int>(type: "integer", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Response = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Review", x => new { x.UserId, x.OrganizationId });
                    table.ForeignKey(
                        name: "FK_Review_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Review_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SocialNetwork",
                columns: table => new
                {
                    Type = table.Column<string>(type: "text", nullable: false),
                    OrganizationId = table.Column<int>(type: "integer", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialNetwork", x => new { x.Type, x.OrganizationId });
                    table.ForeignKey(
                        name: "FK_SocialNetwork_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sport",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sport", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrganizationSport",
                columns: table => new
                {
                    OrganizationId = table.Column<int>(type: "integer", nullable: false),
                    SportId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationSport", x => new { x.OrganizationId, x.SportId });
                    table.ForeignKey(
                        name: "FK_OrganizationSport_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationSport_Sport_SportId",
                        column: x => x.SportId,
                        principalTable: "Sport",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationSport_SportId",
                table: "OrganizationSport",
                column: "SportId");

            migrationBuilder.CreateIndex(
                name: "IX_Review_OrganizationId",
                table: "Review",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_SocialNetwork_OrganizationId",
                table: "SocialNetwork",
                column: "OrganizationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrganizationSport");

            migrationBuilder.DropTable(
                name: "Review");

            migrationBuilder.DropTable(
                name: "SocialNetwork");

            migrationBuilder.DropTable(
                name: "Sport");
        }
    }
}
