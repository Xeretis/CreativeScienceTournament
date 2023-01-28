using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreativeScienceTournament.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedTeams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Teams",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Teams");
        }
    }
}
