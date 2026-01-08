FROM mosipdev/openjdk-21-jdk

LABEL authors="mouad"

VOLUME /temp

RUN apt-get update && apt-get install -y curl

COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]