
## Start postgres in docker
To run the Postgres container, type:

`docker compose up -d rusbnb_db`


Docker is pulling (downloading) the Postgres image on our local machine and it's running a container based on that Postgres image.

To check if the container is running, type:

`docker compose logs`

## Database connection
To test the db connection use the following configuration:

Host: localhost

Port: 5432

User: postgres

Password: postgres

Database: rusbnb


## Build and run the Flask application

Go to the folder where the docker-compose.yml is located and type:
`docker compose build`

Now, to check if the image has been built successfully, type:

`docker images`

## Run the rusbnb_app service
We are almost done, but one last step is to run a container based on the image we just built.

To do that, we can just type:

`docker compose up rusbnb_app`

## Test the application
To test the application visit 

`localhost:4000/test`
