FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew build -x test
CMD ["sh", "-c", "java -jar build/libs/backend-0.0.1-SNAPSHOT.jar"]
