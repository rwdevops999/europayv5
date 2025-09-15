# DOCKER and JENKINS

# NextJS

## Production build

Create a NextJS production build

```bash
pnpm build
```

# Docker

What we expect in docker is the application (node), Inngest (look also for this as standalone docker), Traeffik (reverse proxy) and PostgreSQL (database).

## create Dockerfile

```docker
# use a node image (at this moment 23-alpine is the latest)
FROM node:23-alpine

# this is for running the interactive version
# RUN apk update && apk add bash

# switch to directory /europay (in docker image)
WORKDIR  /europay

# copy package.json to /europay
COPY package*.json  ./

# copy local .next folder to /europay/.next in the image
COPY .next .next

# install pnpm
RUN npm install -g pnpm

# install node-Modules
RUN pnpm install

# expose port 3000 of the container
EXPOSE 3000

# this is also for running interactive omage
# SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# start the application
CMD [ "pnpm", "start" ]
```

## Docker commands

### build docker image from Dockerfile

docker build -t app-name .

### list docker images

docker image ls

RESPOSITORY TAG IMAGE ID CREATED SIZE
app-name latest 99e9680f0632 8 minutes ago 983MB

### remove image

docker image rm 99e9680f0632 --force
docker rmi #image:latest

### run docker image

docker run -d -p 3000:3000 app-name

the -d flag is for running the container detached.

The first port is the port on the local machine
The second port is the port on the container

e.g: docker run -d -p 800:3000 app-name => http://localhost:800/

### connect to container

BROWSER: http://localhost:3000/

### view docker containers

docker ps

### stop docker container

docker stop #containerId

### remove all stopped containers

docker container prune
or
docker container prune -f (or --force) => VERBOSE

# JENKINS

## image (LTS)

jenkins/jenkins:jdk21 (found in DockerHub => Docker pull command)

Run Jenkins image

docker run --privileged -u 0 -p 8080:8080 -p 50000:50000 -v /Users/rudiwelter/.jenkins:/var/jenkins_home jenkins/jenkins:jdk21

downloads the image and starts the container (can take a while).

This show us a logging (the logging can also be found in Docker Desktop).
Important here is initial password (can also be found in .../.jenkins/secrets/initialAdminPassword). This is needed to login in
in Jenkins the first time.

## Open Jenkins

localhost:8080

Here we must enter the initialAdminPassword
Install suggested plugins

Create an Admin user (for me, rwdevops999, 27X...@).
URL: http://localhost:8080/

## macos agent

Select in Jenkins 'Build Executor Status'
Select 'New Node' and enter the name 'macos' (and select Permanent Agent) and 'Create' it.

In the setup screen of the node:

Enter a remote directory (just a folder on the user root directory): /Users/rudiwelter/jenkins-agent
As 'Launch Method', choose: Launch Agents via SSH.

On MAC, choose:

1. System Preferences
2. Network
3. WiFi

En dan zie je het IP address (voor mij: 192.168.0.100).

Dat vullen we in Jenkins in bij 'Host'.
Setup Credentials

Selecteer 'Add > Jenkins', en vul in:

Domain: Global
Kind: Username with password
Scope: Global
Username: .... (rudiwelter) (are the ssh credentials).
Password: .... (27L...9)
ID: macos
Description: macos

And then 'Add'.

On the Nodes screen, select the credentials (from the dropdown).
With 'Non Veryfying Verification Strategy'

Nice to change:

'Number of Executors': 4 (The number of cores on my machine, can be found on MAC by 'About this Mac' in system menu).

And then 'Save'.

### Java versions

Jenkins (Manage Jenkins > System Information > java.runtime.version = 21.08)
macos (macos > System Information > 20)

We gaan macos ook op 21 zetten.

Select by macos > Configure > Advanced (Under Host Key Verification Strategy)

Enter in Javapath: /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home/bin/java
and 'Save'.

Disconnect the agent and relaunch the agent.

Check again:

macos > System Information > java.runtime.version => 21.08 (dus OK).

### Shared libraries

Code: under github (https://github.com/rwdevops999/Jenkins.git on master branch).

Goto 'Jenkings > Manage Jenkins > System'
Lookup section: 'Global Trusted Pipeline Libraries'.

Select 'Add'.

enter a name: shared-library (as example)
default version: master (branch name)

Hook up the git repository:

Retrieval Method => Modern SCM/Git
Project repository is the github repostory: https://github.com/rwdevops999/Jenkins.git
Credentials are not needed because this is a public repository.

Save.

Now the library can be used in the Jenkinsfile:

@Library("shared-library@master") \_

ATTENTION: the '\_' is mandatory (it is like a wildcard).
