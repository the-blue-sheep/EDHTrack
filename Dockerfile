FROM openjdk:21
EXPOSE 8080
ADD backend/target/EDHTrack.jar EDHTrack.jar
ENTRYPOINT ["java", "-jar", "EDHTrack.jar"]
