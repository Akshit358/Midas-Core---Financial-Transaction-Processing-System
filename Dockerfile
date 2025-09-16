# Multi-stage build for Midas Core
FROM maven:3.9.4-openjdk-17-slim AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jre-slim

# Set working directory
WORKDIR /app

# Install necessary packages
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r midas && useradd -r -g midas midas

# Copy the JAR file from build stage
COPY --from=build /app/target/midas-core-*.jar app.jar

# Create logs directory
RUN mkdir -p /var/log/midas-core && \
    chown -R midas:midas /var/log/midas-core

# Change ownership of the app directory
RUN chown -R midas:midas /app

# Switch to non-root user
USER midas

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
