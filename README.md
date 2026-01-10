# Devops project

## Global architecture diagram

![](img/global_architecture.png)

## Use case diagram

![](img/usecase.png)

## Sequence diagrams

- We are mentioning only the sequence diagrams of commands.

### Create command (CLIENT)

![](img/sequence_create_diagram.png)

### List commands of a client (CLIENT)

![](img/sequence_commands_of_client.png)

### List all commands (ADMIN)

![](img/sequence_of_all_commands.png)

## Dockerization

- To dockerize the microservices discovery-service, gateway-service, product-service and command-service:
  - we generate a jar file with `mvn package`.
  - Then we create a Dockerfile for each service to build image for each service from the jdk image.
```
FROM mosipdev/openjdk-21-jdk

LABEL authors="mouad"

VOLUME /temp

RUN apt-get update && apt-get install -y curl

COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
```
- example of a service in docker compose file (gateway service)
```yml
gateway-service:
  build: ./gateway-service
  container_name: gateway-service
  ports:
    - "8888:8888"
  expose:
    - "8888"
  environment:
    DISCOVERY_SERVICE_URL: http://discovery-service:8761/eureka
    JWK_URI: http://keycloak:8080/realms/devsecops-realm/protocol/openid-connect/certs
```

- Second we dockerize the front end by using node js and nginx image and some npm commands.
- And it was important here to create build variables that will be passed as args in docker compose.
```
# ---------- build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# ---------- runtime stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```
- a part of the front-end container in docker compose file
```yml
front-end:
  build:
    context: ./front-end
    args:
      VITE_KEYCLOAK_URL: http://localhost:8080
      VITE_API_URL: http://localhost:8888
  container_name: front-end
```

## Functionalities screenshots

- First we have **list products** and **see product details** which is accessible by CLIENT and ADMIN
- Second we have **add**, **modify** and **delete** product accessible only by the ADMIN

#### CLIENT
- list products

![](img/img.png)

- see product details

![](img/img_5.png)
#### ADMIN
- list, add, edit and delete product

![](img/img_1.png)

- Then the ADMIN can **list all the commands** (the commands of all clients)
- But the CLIENT can **see his own commands** only and can **create new commands**

#### ADMIN
- list command

![](img/img_2.png)

#### CLIENT

- list his own commands

![](img/img_3.png)

- create new command

![](img/img_4.png)

- Finally we have profile page where we can see the user role and he can logout

#### ADMIN & CLIENT
![](img/img_6.png)

# Devsecops

## SonarQube

- We run sonarqube in our docker compose file, with some custom volume and a postgres database with its own volume
- Sonarqube container
```yml
  sonarqube:
    image: sonarqube:community
    container_name: sonarqube
    depends_on:
      - postgres-sonar
    ports:
      - "9000:9000"
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://postgres-sonar:5432/sonarqube
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    volumes:
      - sonar_data:/opt/sonarqube/data
      - sonar_extensions:/opt/sonarqube/extensions
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
```
- postgres container
```yml
  postgres-sonar:
    image: postgres:15
    container_name: postgres-sonar
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
      POSTGRES_DB: sonarqube
    volumes:
      - sonar_pg_data:/var/lib/postgresql/data 
```

### Backend (Microservice)

- First we open sonarqube in `localhost:9000` we login with `admin` `admin` and create projects for each service (discovery, gateway, product and command)
- let's take product service for example
- We create the project

![](sonar-img/sonar_create_project.png)

- We can choose some customizations setup code

![](sonar-img/sonar_setup_code.png)

- For the analysis method we chose locally

![](sonar-img/sonar_analysis_method.png)

- We generate a token to run sonarqube check later

![](sonar-img/sonar_token.png)

- We get finally the command

![](sonar-img/sonar_command.png)

- Then for each service we run the command to start the process

Here the result for all the services :
#### discovery service

![](sonar-img/sonar_discovery_service.png)

#### gateway service

![](sonar-img/sonar_gateway_service.png)

#### product service

![](sonar-img/sonar_product_service.png)

- we can inspect on details the issues with a level (HIGH, MEDIUM, LOW)

![](sonar-img/sonar_product_service_issues.png)

- we can inspect the place of the issue

![](sonar-img/sonar_product_service_issues_1.png)

#### command service/

![](sonar-img/sonar_command_service.png)

### Frontend

The front end process is different a little bit, here we have to:
- install sonar package with `npm install -g sonarqube-scanner`
- create a file in the frontend directory `sonar-project.properties`
```properties
sonar.projectKey=front-end
sonar.sources=src
sonar.host.url=http://localhost:9000
sonar.login=SONARQUBE_TOKEN
sonar.exclusions=**/node_modules/**
```
- run `sonar-scanner`

![](sonar-img/sonar_front_end.png)