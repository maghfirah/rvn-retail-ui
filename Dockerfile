#################
# Build the app #
#################
FROM docker.doku.com/doku-node14-centos7
WORKDIR /apps
COPY . .
RUN mkdir -p /apps/dist
RUN npm install
RUN node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --configuration production --baseHref=/retail/ --outputPath=/usr/share/nginx/html --output-hashing=all
 
################
# Run in NGINX #
################
# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx"]
