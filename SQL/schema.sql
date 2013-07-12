/* CREATE DATABASE chat; */

USE chat;

/* CREATE TABLE team2(id int auto_increment, Name varchar(255), City 
	varchar(255), State char(2), PRIMARY KEY(id)); */

CREATE TABLE messages (
 /* Describe your table here.*/
 id int auto_increment, username varchar(30), createdAt varchar(30), message varchar(255), PRIMARY KEY(id)

);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
