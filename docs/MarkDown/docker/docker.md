# DOCKER and JENKINS

# NextJS

## [NEXTJS] Production build

Create a NextJS production build

```bash
pnpm build
```

# Docker

What we expect in docker is the application (node), Inngest (look also for this as standalone docker), Traeffik (reverse proxy) and PostgreSQL (database).

## [DOCKER] create Dockerfile

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

### [DOCKER] build docker image from Dockerfile

docker build -t app-name .

### [DOCKER] list docker images

docker image ls

RESPOSITORY TAG IMAGE ID CREATED SIZE
app-name latest 99e9680f0632 8 minutes ago 983MB

### [DOCKER] remove image

docker image rm 99e9680f0632 --force
docker rmi #image:latest

### [DOCKER] run docker image

docker run -d -p 3000:3000 app-name

the -d flag is for running the container detached.

The first port is the port on the local machine
The second port is the port on the container

e.g: docker run -d -p 800:3000 app-name => http://localhost:800/

### [DOCKER] connect to container

BROWSER: http://localhost:3000/

### [DOCKER] view docker containers

docker ps

### [DOCKER] stop docker container

docker stop #containerId

### [DOCKER] remove all stopped containers

docker container prune
or
docker container prune -f (or --force) => VERBOSE

# JENKINS

## [JENKINS] image (LTS)

jenkins/jenkins:jdk21 (found in DockerHub => Docker pull command)

Run Jenkins image

docker run -d --privileged -u 0 -p 8080:8080 -p 50000:50000 -v $HOME/.jenkins/:/var/jenkins_home -v $(which docker):/usr/bin/docker\ -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:latest

downloads the image and starts the container (can take a while).

This show us a logging (the logging can also be found in Docker Desktop).
Important here is initial password (can also be found in .../.jenkins/secrets/initialAdminPassword). This is needed to login in
in Jenkins the first time.

## [JENKINS] Open Jenkins

localhost:8080

Here we must enter the initialAdminPassword
Install suggested plugins

Create an Admin user (for me, rwdevops999, 27X...@).
URL: http://localhost:8080/

## [JENKINS] macos agent

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

### [JENKINS] Java versions

Jenkins (Manage Jenkins > System Information > java.runtime.version = 17)
macos (macos > System Information > 20)

We gaan macos ook op 17 zetten.

Select by macos > Configure > Advanced (Under Host Key Verification Strategy)

Enter in Javapath: /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home/bin/java
and 'Save'.

Disconnect the agent and relaunch the agent.

Check again:

macos > System Information > java.runtime.version => 21.08 (dus OK).

### [JENKINS] Shared libraries

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

## [JENKINS] Setting up a pipeline (using GitHub)

First of all, the code must be under GitHub (https://github.com/rwdevops999/europayv5.git).

### [GITHUB] Create GitHub App (this is not the code under github).

Go to Settings (avatar > Settings).
Go in the left menu to 'Developer Settings'.
On top of the left menu, we see 'GitHub Apps'

Select 'New Github App'

Enter a App Name (just a name, later used in Jenkins, e.g. jenkins-europay)
Enter the Homepage URL (is the github home URL, e.g. https://github.com/rwdevops999/)
We need to setup a webhook (see webhook)

Webhook section:

active on,
Webhook URL (proxy URL from SMEE): https://smee.io/cFurHV5OJDrmMKD

"Repository" permissions:

- Administration: read-only
- Checks: read-write
- Commit statuses: read-write
- Contents: read-only
- Metadata: read-only (is already set for you)
- Pull Requests: read-only

"Subscribe Events":

- Check run
- Check suite
- Pull Request
- Push
- Repository

"Only for this account"

Dan: "Create GitHub App"

We see the detail page: 'Settings' 'Developer' 'settings' 'GitHub Apps' 'jenkins-europay'
IT SAYS: Registration successful. You must generate a private key in order to install your GitHub App.

Generate the private key:

Under the section "Private Keys" > Generate a private key.
Your private key is stored in your downloads folder.

In Chrome, select settings (3 dots right top > Settings > Downloads shows the location).
Copy this pem file to a safe location.
We need to change the key into a different format:

'openssl pkcs8 -topk8 -inform PEM -outform PEM -in downloaded.pem -out anothername.pem -nocrypt'

example:

```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -in jenkins-europay.2025-09-15.private-key.pem -out converted-jenkins-europay.pem -nocrypt
```

That generates the converted PEM.

### [GITHUB] Install GitHub App

On the details page (where the private key was generated), Click on 'Install App' and choose the account (in my case rwdevops999, this is the organisation).
Select here:

- only selected repositories (NOT ALL) and select the repository (where the code lives).

It shows the permissions (those we gave above) => INSTALL

It shows: 'Okay, jenkins-europay was installed on the @rwdevops999 account.'

### [GITHUB] Webhook

We use a webhook provider (smee.io).
In Smee, Start a new channnel:

This gives a Proxy URL (https://smee.io/cFurHV5OJDrmMKD).

Also, install the cli client (npm install --global smee-client).
Startup in terminal the client (smee -u https://smee.io/cFurHV5OJDrmMKD).

## [JENKINS] Setup credentials for GitHub

In Jenkins > Manage Jenkins > Credentials > (global) > Add Credentials

Kind: GitHub App
ID: Give this the same name as the github app (jenkins-europay)
Description: an explanation
App ID: => Go back to GitHub/Details page of the app. In the About section we the App ID: 1955905
Key: => Open the converted PEM file in an editor. Copy all and paste it here.

Click on "Test Connection".
We should see something like: "-'Success, Remaining rate limit: 4999'.

=> CREATE

## [JENKINS] Create a job

Go to the dashboard. => 'Create a job'.
Enter a name (europay) => Multibranch pipeline => OK.

Under 'Branch Sources': Add source 'GitHub'
Select the just added credentials.

In HTTPS Url enter the git repository URL (https://github.com/rwdevops999/europayv5.git)
Click 'Validate' => it should say 'Credentials ok. Connected to https://github.com/rwdevops999/europayv5.'

SAVE

## [JENKINS] Add NodeJS

Goto Manage Jenkins > Plugins > Available plugins
Search for 'nodejs'
Select the plugin => INSTALL

It should show something like:

...
NodeJS Success
...

Restart JENKINS

In Manage Jenkins > Tools > Add NodeJS and give it a name (e.g. nodejs)

## [JENKINS] Restart

http://localhost:8080/restart

## [JENKINS] Emailing

Use the mailer plugin.

In Manage Jenkins > System

Add 'System admin email address'.
Then go to the bottom of this screen to "Email Notification Section".

Set the smtp server (e.g. smtp.gmail.com).
Go to the advanced part.

Check use SMTP authentication:

## [GOOGLE] Setup gmail

Follow the video "https://www.youtube.com/watch?v=y5IasMFYdBc"

## [JENKINS]

SMTP Authentication

Username: email address (rwdevops999@gmail.com)
password: generated password from gmail in step above
Use SSL on port 465
Reply To Address: an email address (rwdevops999@gmail.com)

Test it and it should say (Email was successfully sent)

SAVE

## [JENKINS] Blue Ocean

Manage Jenkins > Plugins > Available plugins

Search for 'blue ocean'

Setup BlueOcean (Aggregator) installs everything for blue ocean.

## [JENKINS] Docker

In 'Manage Jenkins > Plugins'

search docker and install Docker Pipeline

Then in 'Manage Jenkins > Tools', Add Docker
Give a name
and Install Automatically, Download from docker
