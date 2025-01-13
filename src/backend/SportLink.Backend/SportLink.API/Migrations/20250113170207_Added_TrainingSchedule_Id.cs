using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class Added_TrainingSchedule_Id : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TrainingSchedule",
                table: "TrainingSchedule");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "TrainingSchedule",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrainingSchedule",
                table: "TrainingSchedule",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSchedule_TrainingGroupId",
                table: "TrainingSchedule",
                column: "TrainingGroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TrainingSchedule",
                table: "TrainingSchedule");

            migrationBuilder.DropIndex(
                name: "IX_TrainingSchedule_TrainingGroupId",
                table: "TrainingSchedule");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "TrainingSchedule");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrainingSchedule",
                table: "TrainingSchedule",
                columns: new[] { "TrainingGroupId", "DayOfWeek", "StartTime" });
        }
    }
}
