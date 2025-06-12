FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /usr/src/myapp

COPY pom.xml ./
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /usr/src/myapp

COPY --from=builder /usr/src/myapp/target/*.jar Fundpulse-Application-0.0.1-SNAPSHOT.jar

EXPOSE 8080


ENTRYPOINT ["java", "-jar", "Fundpulse-Application-0.0.1-SNAPSHOT.jar"]