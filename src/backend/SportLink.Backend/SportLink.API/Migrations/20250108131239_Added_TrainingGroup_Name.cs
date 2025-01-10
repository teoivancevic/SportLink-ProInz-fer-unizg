using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class Added_TrainingGroup_Name : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrencyISO",
                table: "SportCourt");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "TrainingGroup",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "TrainingGroup");

            migrationBuilder.AddColumn<string>(
                name: "CurrencyISO",
                table: "SportCourt",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
