# Zendesk Coding Challenge
Created and Submitted by Ashish Shenoy

A basic web application written in Javascript in the NodeJS runtime environment using the ExpressJS module as the backend and Embedded Javascript Template (EJS) as the frontend.
This web application sends GET requests to the Zendesk Tickets API and displays all existing tickets or a specific tickets detailed information.

## Prior Installations
- NodeJS (v14.18.1 or greater) and NPM (v6.14.15) (When installing NodeJS, NPM will also be installed)
- Git (To clone this repository)

## Setup (Both for MacOS or Windows)

- Step 1: Clone this repository to your machine using the following command below
```
git clone https://github.com/ashenoy20/Zendesk-Ticket-Viewer.git
```
- Step 2: Navigate to the cloned repository through your terminal (Make sure you are inside the cloned folder)

- Step 3: Install all the dependencies by running the following command
```
npm install
```
then run this command
```
npm install -g nodemon
```

- Step 4: Start the program by running the following command
```
npm start
```

## Navigation to website

***DISCLAIMER***
I use basic authorization for my requests to Zendesk API. All my credentials, port number, and subdomain are saved in the .env file. By default, the port number is 8080, 
however if you have a service running there already, I recommend changing the port number in the .env file. If you want to make calls to your subdomain, I also recommend to change
the subdomain, username, and password fields in the .env file so the web application runs fine.

- After starting the program, type in the address bar in the browser of your choice 'localhost:{YOUR_PORT_NUMBER}/' (Example: localhost:8080/)
- This should navigate you to the home page, hopefully all goes well :)

## Testing
To perform the unit tests, simply run the following command
```
npm test
```

That will be all, thank you for this exercise :D !
