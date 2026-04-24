using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLeader : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cultos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Data = table.Column<DateOnly>(type: "date", nullable: false),
                    Turno = table.Column<int>(type: "integer", nullable: false),
                    LiderRecepcao = table.Column<string>(type: "text", nullable: false),
                    GrupoRecepcao = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cultos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Contagens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuantidadeCadeirasA = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeCadeirasB = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeCadeirasC = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeCadeirasD = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeGaleria = table.Column<int>(type: "integer", nullable: false),
                    QuantidadePulpito = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeSalas = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeExterno = table.Column<int>(type: "integer", nullable: false),
                    QuantidadeOnline = table.Column<int>(type: "integer", nullable: false),
                    Total = table.Column<int>(type: "integer", nullable: false),
                    CultoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contagens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contagens_Cultos_CultoId",
                        column: x => x.CultoId,
                        principalTable: "Cultos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contagens_CultoId",
                table: "Contagens",
                column: "CultoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contagens");

            migrationBuilder.DropTable(
                name: "Cultos");
        }
    }
}
