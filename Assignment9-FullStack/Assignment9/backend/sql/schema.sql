-- Your database schema goes here --
DROP TABLE IF EXISTS emails;

CREATE TABLE emails (id SERIAL PRIMARY KEY, username TEXT, mailbox TEXT, starred BOOLEAN DEFAULT false, unread BOOLEAN DEFAULT true, avatar TEXT, mail jsonb);

CREATE TABLE users (email TEXT, "password" TEXT, "name" TEXT, show_avatar BOOLEAN, avatar TEXT);
-- https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg
-- https://cdn.shopify.com/s/files/1/1365/2497/products/12676-BananaSlugMask-Sky_grande.jpg?v=1520535633
