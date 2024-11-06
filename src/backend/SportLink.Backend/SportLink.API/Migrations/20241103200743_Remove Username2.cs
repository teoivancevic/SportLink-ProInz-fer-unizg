using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUsername2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "User");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "User",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
