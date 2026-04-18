using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ballista.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class initdatas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "TrainingDuration",
                table: "ShootingSessions",
                type: "interval",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrainingDuration",
                table: "ShootingSessions");
        }
    }
}
