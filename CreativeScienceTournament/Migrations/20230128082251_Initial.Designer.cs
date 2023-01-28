﻿// <auto-generated />
using System;
using CreativeScienceTournament.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CreativeScienceTournament.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20230128082251_Initial")]
    partial class Initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ContestTeam", b =>
                {
                    b.Property<int>("ContestsId")
                        .HasColumnType("integer");

                    b.Property<int>("TeamsId")
                        .HasColumnType("integer");

                    b.HasKey("ContestsId", "TeamsId");

                    b.HasIndex("TeamsId");

                    b.ToTable("ContestTeam");
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.ApiUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<int?>("TeamId")
                        .HasColumnType("integer");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.HasIndex("TeamId");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.Contest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("MaxPoints")
                        .HasColumnType("integer");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("ThumbnailUrl")
                        .HasColumnType("text");

                    b.Property<string>("Topic")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Contests");
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.ContestEntry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ContestId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("TeamId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("ContestId");

                    b.HasIndex("TeamId");

                    b.ToTable("ContestEntries");
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.PointEntry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Amount")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Reason")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("TeamId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("TeamId");

                    b.ToTable("PointEntries");
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.Team", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("ContestTeam", b =>
                {
                    b.HasOne("CreativeScienceTournament.Data.Entities.Contest", null)
                        .WithMany()
                        .HasForeignKey("ContestsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CreativeScienceTournament.Data.Entities.Team", null)
                        .WithMany()
                        .HasForeignKey("TeamsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.ApiUser", b =>
                {
                    b.HasOne("CreativeScienceTournament.Data.Entities.Team", "Team")
                        .WithMany("Members")
                        .HasForeignKey("TeamId");

                    b.Navigation("Team");
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.Contest", b =>
                {
                    b.OwnsOne("CreativeScienceTournament.Data.Entities.Owned.Exercise", "Exercise", b1 =>
                        {
                            b1.Property<int>("ContestId")
                                .HasColumnType("integer");

                            b1.Property<string>("ContentType")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("Filename")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("OriginalFilename")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.HasKey("ContestId");

                            b1.ToTable("Contests");

                            b1.WithOwner()
                                .HasForeignKey("ContestId");
                        });

                    b.Navigation("Exercise")
                        .IsRequired();
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.ContestEntry", b =>
                {
                    b.HasOne("CreativeScienceTournament.Data.Entities.Contest", "Contest")
                        .WithMany("ContestEntries")
                        .HasForeignKey("ContestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CreativeScienceTournament.Data.Entities.Team", "Team")
                        .WithMany("ContestEntries")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("CreativeScienceTournament.Data.Entities.Owned.Correction", "Correction", b1 =>
                        {
                            b1.Property<int>("ContestEntryId")
                                .HasColumnType("integer");

                            b1.Property<string>("Comment")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<int>("Points")
                                .HasColumnType("integer");

                            b1.HasKey("ContestEntryId");

                            b1.ToTable("ContestEntries");

                            b1.WithOwner()
                                .HasForeignKey("ContestEntryId");
                        });

                    b.OwnsOne("CreativeScienceTournament.Data.Entities.Owned.Solution", "Solution", b1 =>
                        {
                            b1.Property<int>("ContestEntryId")
                                .HasColumnType("integer");

                            b1.Property<string>("ContentType")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("Filename")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<string>("OriginalFilename")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.HasKey("ContestEntryId");

                            b1.ToTable("ContestEntries");

                            b1.WithOwner()
                                .HasForeignKey("ContestEntryId");
                        });

                    b.Navigation("Contest");

                    b.Navigation("Correction");

                    b.Navigation("Solution")
                        .IsRequired();

                    b.Navigation("Team");
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.PointEntry", b =>
                {
                    b.HasOne("CreativeScienceTournament.Data.Entities.Team", "Team")
                        .WithMany("PointEntries")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Team");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("CreativeScienceTournament.Data.Entities.ApiUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("CreativeScienceTournament.Data.Entities.ApiUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CreativeScienceTournament.Data.Entities.ApiUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("CreativeScienceTournament.Data.Entities.ApiUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.Contest", b =>
                {
                    b.Navigation("ContestEntries");
                });

            modelBuilder.Entity("CreativeScienceTournament.Data.Entities.Team", b =>
                {
                    b.Navigation("ContestEntries");

                    b.Navigation("Members");

                    b.Navigation("PointEntries");
                });
#pragma warning restore 612, 618
        }
    }
}
