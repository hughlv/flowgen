# Backend Service for Agentok Studio

This project is the backend service for Agentok Studio. It is built with FastAPI, a modern web framework for building APIs with Python 3.6+ based on standard Python type hints.

This project uses Supabase as the database and authentication service. Supabase is an open-source Firebase alternative. It provides a set of tools to build modern web and mobile applications.

In this project, we use the Service Role Key to access the database and authentication service. The Service Role Key is a secret key that allows you to access the Supabase API. It is used to authenticate requests to the Supabase API.

Run the service:

```bash
poetry install
poetry run playwright install
poetry run uvicorn agentok_api.main:app --reload --port 5004
```

If you need to run the service with network proxy, you can use the following command:

```bash
poetry install
poetry run playwright install
poetry run proxychains4 uvicorn agentok_api.main:app --reload --port 5004
```

You need to configure proxychains4 to make it work, which is out of the scope of this document.

## Docker Build

> This does not work. We've reverted to the old way of building the image.

We've separated the Dockerfile to base image and app image for better caching. You can build the image with the following commands:

### Base Image

```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t hughlv/agentok-api-base:v1.0 -f Dockerfile.base . --push
```

Normally you don't need to do this, because we have put [a base image on Docker Hub](https://hub.docker.com/repository/docker/hughlv/agentok-api-base), you can build the app image directly.

### App Image

```bash
docker build -t agentok-api .
docker run -d -p 5004:5004 agentok-api
```

## API Docs

By default, when you create a FastAPI application, it automatically generates OpenAPI schemas for all your routes and serves them under /docs and /redoc paths.

You can visit `/api-docs` such as [http://localhost:5004/api-docs](http://localhost:5004/api-docs) to read the API docs, or `/docs`, such as [http://localhost:5004/docs](http://localhost:5004/docs) to test the APIs on Swagger UI.
