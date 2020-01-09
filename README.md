# Git Hub Stargazer Dataset Generator

## Technologies:

•	Git-Hub API

•	Dockers Containers

•	RestAPI

•	Nodejs

•	Bootstrap


## Introduction:

This application provides an easy to use GET API end point which uses Git-Hub public API to get the list of people who have starred a given repository and returns the list of users along with the timestamp of the Starred time. It also provides and easy to use web based interface with the functionality to export data into CSV or Excel format. Deployment is done using Dockerfile for Docker Containers Environment.



## Challenges and Limitations:

The task was pretty straight forward but the biggest challenge was to get data efficiently from GitHub api because when API Call is sent to GitHub API to get Starred timestamp and list of users for a given repo. Git Hub paginates the results and sends you the list of URLS that can be used to get data from Github, By default each page returns 30 users and timestamps but it can be tweaked to return maximum of 100 per page. So i have utilized that feature and got 100 records per page instead of 30 which is default, In this way less number of calls will be sent to GitHub API.
I wanted to send these calls in perallel using asynced functions but it resulted in **ABUSE PROTOCOL** according to GitHub API Documentation, All calls should be send sequentially
and with at least **1 second** of delay. I have been trying different time delays to check if i could find a generic and optimal delay without triggering the **ABUSE RATE LIMIT**. So i have found out that for less than 100 request a delay of less than a second can work perfectly but for large number of request you will definatly need a delay of minimum of 1 second. I also tried to devide the list of URLs into multiple chunks of 100 api calls and tried to send them with lower delay and then after every chunk of 100 i put 2 seconds of delay but still the **ABUSE LIMIT** was reached. 
Git-Hub Limitation Reference: https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits


## Pre-Requisites:
- Docker Engine must be installed on the computer.

## Installation Steps:

1. Open Shell / CMD and go to any directory that you want to clone github repo
2. Run the following command to clone the repository `git clone https://github.com/mujahidniaz/git_stargazer_dataset_generator`	
3. Make sure the Cloning is complete and your Docker Engine is running.
4. Build the docker image from docker file using follwoing command `docker build -t gitstargazer1/node-web-app .`
5. Once the docker image is built now you have to run the docker image using command `docker run -p 9898:9898 -d gitstargazer1/node-web-app`
6. It will return you an ID if everything went successfull. Now simply open your browser and type `http://localhost:9898`
7. Put a repositry in the input field and hit the generate data Button. List will show up in the table and you can download it as well using Download Excel / CSV button

## Demo Video 
   Please go to watch a live working Demo https://youtu.be/EbG9GFm2Ssk on Youtube (Must)
