# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:12.20.2

# Set the working directory to /server
WORKDIR /server

# copy package.json into the container at /server
COPY package*.json /server/

# install dependencies
RUN npm install

# Copy the current directory contents into the container at /server
COPY . /server/

# Make port 80 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]
