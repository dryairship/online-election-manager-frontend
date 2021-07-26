FROM node:16-alpine3.14 AS builder
WORKDIR /oem

# Install dependencies first, so they are not pulled every
# time any minor code changes are made
COPY package*.json ./
RUN npm i

# React binds env variables during build
# So they need to be present during the build command
ARG REACT_APP_DISPLAY_PHOTOS
ARG REACT_APP_MAX_PREFERENCES
ARG REACT_APP_ELECTION_TITLE

COPY . ./
RUN npm run build

FROM nginx:1.21-alpine
COPY --from=builder /oem/build /usr/share/nginx/html
