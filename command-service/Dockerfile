FROM mosipdev/openjdk-21-jdk

LABEL authors="mouad"

VOLUME /temp
COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]