# Dockerfile > Docker Image > Run Docker Containers

FROM alpine:latest

LABEL org.opencontainers.image.source https://github.com/mattdavis0351/refactored-octo-fortnight

CMD [ "echo", "hello from packages" ]