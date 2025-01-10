﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportLink.API.Migrations
{
    /// <inheritdoc />
    public partial class Added_SportsObject_Name : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "SportsObject",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "SportsObject");
        }
    }
}
