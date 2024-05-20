# 🚀 Get started here

This project is a kind of ***receivers of pix manager***, where you can organize a list of them, making a CRUD, with some rules.
Is not the object here realize a pix transfer or something like this (not yet) and for now it is only the back-end, after I can do the front and put the link here.
It was made with ***Node.js and PostgreSQL***
This README will guide you through the project, since how you can clone it, configure and run locally.

## 🔖 **How to use this project**

#### **Step 1: Clone from Github**

Access your Terminal in the directory where you want put the project and paste one of this codes:

***`git clone [git@github.com](https://mailto:git@github.com):FreitasAssis/tech-challenge.git`***

or

***`git clone https://github.com/FreitasAssis/tech-challenge.git`***

#### **Step 2: Install dependencies**

Enter in the new repository created

***`cd tech_challenge`***

and run one of these commands to install dependencies:

***`npm i`*** or ***`yarn`***

#### **Step 3: Configure your project**

You will need to use a database to run the project, I am using postgresql (you can use one of your preference) but I didn't share my db config, but you can use the ***`.env-example`*** to configure your ***`.env`*** file, put it on the root of your project.

#### **Step 4: Run**

You can run the project in your

***localhost:3000***

or setting another PORT in your env file. To run it you can use the command

***`npm run dev`*** or ***`yarn dev`***

In first time will be created the tables in your DB and run the project in your localhost:{PORT}. 

#### **Step 5: Endpoints**

Supposing you are using localhost:3000, you can check all endpoints using Swagger in

***[localhost:3000/api-docs](localhost:3000/api-docs)***

## 💡 How to test

I implemented some cases of test, unit and integration to this application. I should have covered more cases, but I put only the main examples, other cases may be added using them like examples.
You can run the tests with some commands:

#### **Unit tests**

***`npm run test:unit`***

#### **Integration tests**

Different of the unit tests, the integration ones doesn't use mocked data, like database mocked for example, because of this, to run them, you need the application running before and to do this you will use the commands previous listed here.
And the next command to run the tests:

***`npm run test:integration`***

## 💪 Final Considerations

Thanks for reading me!

I hope you enjoy this project and that it can help you with your need.
