# Mappening-Frontend

## Overview
A single platform for events across campus. Mappening helps raise awareness of events by aggregating event information from various sources of advertising. 

## Built With
- nginx (Port 80): Server for static files, forwards requests to backend and serves results
- Mapbox: Open source mapping platform for custom designed maps
- Handlebars.js: Templating language that separates view and code
- AWS EC2/Elastic Container Service for deployment

## Setting Up the Environment
- Download [Docker](https://www.docker.com) and [Docker-Compose](https://github.com/docker/compose/releases) release 1.16.1.  
- Clone this repository 
  - `git clone https://github.com/ucladevx/Mappening-Frontend.git`  

## How to Push Image to AWS ECS
- Enter the repository
  - `cd Mappening-Frontend`
- Login, build, and push image to AWS
  - `make push`

## How to Run Frontend Locally
- Build and run container
  - `make dev`
- Open a second terminal window:
  - Enter frontend container
    - `make ash`
  - Update changes to static files
    - `make files`

## More Info
- Checkout the [backend](https://github.com/ucladevx/Mappening-Backend) repository
- Checkout the [deployment](https://github.com/ucladevx/Mappening-Deployment) repository
  - Contains instructions for local development and production
