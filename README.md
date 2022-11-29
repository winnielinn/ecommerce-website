# 雲林小農市集 Ecommerce-website 🌾

An ecommerce website where customers get to buy fresh agricultural products from Yunlin famous for agriculture in Taiwan.

![GITHUB](https://github.com/winnielinn/ecommerce-website/blob/main/public/photos/cover.png "cover")

🚀 The platform is deployed now on Heroku.

Click [this link](https://secure-wildwood-16800.herokuapp.com) to login enjoy all features through following accounts & passwords! 😃

Role | Account | Password
--- | --- | ---
Admin | root@example.com | 12345678
User | user1@example.com | 12345678
User | user2@example.com | 12345678

## Features

### **Normal Users**

Login

* Login via Facebook or Google, or locally.

Browse products

* Browse all agricultural products, based on categories or pages.

Edit Personal Settings 🔐 (Logged-in ONLY)

* Update their name or email.

Shopping Cart

* Add products to their shopping cart.

* Remove products from their shopping cart.

* Increase or Reduce products quantity in their shopping cart.

Order 🔐 (Logged-in ONLY)

* Proceed to checkout from their cart.

* Perform payment from a list of their orders.

* Browse a list of their orders including total price, payment status and shipping status.

Payment (Logged-in ONLY)

* Perform online payment via credit card.

### **Admin User**

Manage products and categories

* Browse a list of products and categories.

* Create, Edit and Delete a product or category.

Mange customers and orders

* Browse a list of customers and orders.

* Update payment and shipping status.

* Cancel a specific order.

## ERD

![GITHUB](https://github.com/winnielinn/ecommerce-website/blob/main/public/photos/entity-relationship-diagram.png "ERD")

## Getting Start

### **Prerequisites**

1. [Git](https://git-scm.com/downloads)
2. [Node.js](https://nodejs.org/en/download/)
3. [Express](https://expressjs.com/)
4. [MySQL](https://dev.mysql.com/downloads/mysql/)
5. [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

### **Installation**

1. Clone this project to local

```
$ git clone https://github.com/winnielinn/ecommerce-website
```

2. Change directory and install all dependencies

```
$ cd ecommerce-website
$ npm install
```

### **Configuration**

**.env file** 

⚠️ Please refer `.env.example` and create `.env` to set environment variables.

```
PORT=
SESSION_SECRET=
IMGUR_CLIENT_ID=
UNSPLASH_CLIENT_ID=

HASH_KEY=
HASH_IV=
MERCHANT_ID=
URL=

FACEBOOK_ID=
FACEBOOK_SECRET=
FACEBOOK_CALLBACK=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK=
```

❗To complete `.env`, you'll need to apply above information through following websites:

* [Imgur](https://api.imgur.com/oauth2/addclient)
* [Unsplash](https://unsplash.com/developers)
* [Newebpay](https://cwww.newebpay.com/)
* [Meta for Developers](https://developers.facebook.com/)
* [Google OAuth 2.0 Login](https://console.developers.google.com/)

**config/config.json**

Finish database connection setting in `config/config.json`.

```
{
  "development": {
    "username": "root",
    "password": "<your_password>",
    "database": "ecommerce",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

**Create database**

In MySQL Workbench, create database by entering following SQL command.

```
drop database if exists ecommerce; 
create database ecommerce;
```

**Database migration**

Using Sequelize command, create tables through migration files.

```
$ npx sequelize db:migrate
```

### **Usage**

**Create seed data**

Through Sequelize command to establish seed data.

```
$ npx sequelize db:seed:all
```

**Start server**

Run server on localhost. If successful, `App is listening on port 3000` will show in terminal.

```
$ npm run start
```

If you have installed [nodemon](https://www.npmjs.com/package/nodemon), you could use this command.

```
$ npm run dev
```

**Stop server**

Pressing Ctrl + C to stop server running.

## Contributor

* [Winnie Lin](https://github.com/winnielinn)
