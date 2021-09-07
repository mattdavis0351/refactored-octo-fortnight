# Dockerfile > Docker Image > Run Docker Containers

FROM alpine:latest

LABEL org.opencontainers.image.source https://github.com/OWNER/REPO

CMD [ "echo", "hello from packages" ]