using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class Add_Cascade_Delete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_Organization_OrganizationId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Review_User_UserId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Tournament_Organization_OrganizationId",
                table: "Tournament");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSchedule_TrainingGroup_TrainingGroupId",
                table: "TrainingSchedule");

            migrationBuilder.AddForeignKey(
                name: "FK_Review_Organization_OrganizationId",
                table: "Review",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Review_User_UserId",
                table: "Review",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tournament_Organization_OrganizationId",
                table: "Tournament",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSchedule_TrainingGroup_TrainingGroupId",
                table: "TrainingSchedule",
                column: "TrainingGroupId",
                principalTable: "TrainingGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_Organization_OrganizationId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Review_User_UserId",
                table: "Review");

            migrationBuilder.DropForeignKey(
                name: "FK_Tournament_Organization_OrganizationId",
                table: "Tournament");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingSchedule_TrainingGroup_TrainingGroupId",
                table: "TrainingSchedule");

            migrationBuilder.AddForeignKey(
                name: "FK_Review_Organization_OrganizationId",
                table: "Review",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Review_User_UserId",
                table: "Review",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tournament_Organization_OrganizationId",
                table: "Tournament",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingSchedule_TrainingGroup_TrainingGroupId",
                table: "TrainingSchedule",
                column: "TrainingGroupId",
                principalTable: "TrainingGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
