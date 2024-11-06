using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class OrganizationOrderChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Organization",
                newName: "ContactPhoneNumber");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Organization",
                newName: "ContactEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ContactPhoneNumber",
                table: "Organization",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "ContactEmail",
                table: "Organization",
                newName: "Email");
        }
    }
}
