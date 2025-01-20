using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class WorkTime_fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaysOfWeek",
                table: "WorkTime");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "OpenTo",
                table: "WorkTime",
                type: "time",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "OpenFrom",
                table: "WorkTime",
                type: "time",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time");

            migrationBuilder.AddColumn<int>(
                name: "DayOfWeek",
                table: "WorkTime",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "isWorking",
                table: "WorkTime",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayOfWeek",
                table: "WorkTime");

            migrationBuilder.DropColumn(
                name: "isWorking",
                table: "WorkTime");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "OpenTo",
                table: "WorkTime",
                type: "time",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0),
                oldClrType: typeof(TimeOnly),
                oldType: "time",
                oldNullable: true);

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "OpenFrom",
                table: "WorkTime",
                type: "time",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0),
                oldClrType: typeof(TimeOnly),
                oldType: "time",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DaysOfWeek",
                table: "WorkTime",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
