using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddedTopicHelpToContests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TopicHelp_ContentType",
                table: "Contests",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TopicHelp_Filename",
                table: "Contests",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TopicHelp_OriginalFilename",
                table: "Contests",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TopicHelp_ContentType",
                table: "Contests");

            migrationBuilder.DropColumn(
                name: "TopicHelp_Filename",
                table: "Contests");

            migrationBuilder.DropColumn(
                name: "TopicHelp_OriginalFilename",
                table: "Contests");
        }
    }
}
