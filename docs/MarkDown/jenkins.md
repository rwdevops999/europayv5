# INSTALLATION JENKINS

- [ ] Container
      docker run \
      --privileged \
      -d \
      -u root \
      -p 9000:8080 \
      -p 50000:50000 \
      --restart=on-failure \
      -v jenkins_home:/var/jenkins_home \
      -v /var/run/docker.sock:/var/run/docker.sock \
      --name jenkins \
      jenkins/jenkins:jdk21

- [ ] Install suggested plugins
- [ ] create user/password

  - admin/admin

- [ ] set URL

  - http://192.168.0.100:9000/

- [ ] disable internal agent

  - Build Executor Status > Built-in node > Configure
    => Number of executors = 0

- [ ] Jenkins java version

  - Manage Jenkins > System Information > Runtime version
    = 21.0 download this also
    => JAVA PATH: /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home/bin/java

- [ ] create macos agent

  - Build Executor Status > New Node
    => macos / permanent

    - [ ] Number of executors: 4
    - [ ] Remote root directory: /Users/rudiwelter/jenkins-agent
    - [ ] Launch agents via SSH
      - Host : 192.168.0.100
    - [ ] Credentials

      - Domain: Global
      - Kind: Username with password
      - Scope: Global
      - Username: .... (rudiwelter) (are the ssh credentials).
      - Password: .... (27L...9)
      - ID: SSHCredentials
      - Description: credentials for localhost SSH

    - [ ] Verification Strategy: Non verifying Verification Strategy
    - [ ] Advanced
      - JavaPath: /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home/bin/java

  - [ ] System Configuration (Manage Jenkins > System)
    - [ ] Jenkins URL: http://192.168.0.100:9000/
    - [ ] System Admin e-mail address: rwdevops999@gmail.com
    - [ ] Global Trusted Pipeline Libraries
      - [ ] Library Name: shared-library
      - [ ] Default Version: master
      - [ ] Source Code Management: GitHub
      - [ ] Credentials: NONE (public repository)
      - [ ] Repository HTTPS URL: https://github.com/rwdevops999/Jenkins.git
    - [ ] Extended E-mail Notification
      - [ ] SMTP Server: smtp.gmail.com
      - [ ] Port: 465
      - [ ] Credentials:
            Kind: Username with password
        - Username: rwdevops999@gmail.com
        - Password: ecvn muxk rrvp vjan
        - ID: GmailCredentials
        - Description: credentials for using gmail smtp
      - [ ] Use SSL
      - [ ] Reply To List: rwdevops999@gmail.com

- [ ] Credentials GitHub
      Kind: GitHub App
      ID: GithubCredentials
      Description: Credentials for accessing GitHub repositories
      App ID: 1955905
      Key: (constent of converted SSH key file)

- [ ] Credentials keychain
      Kind: Username with password
      Username: rudiwelter
      Password: 27L11l49
      ID: KeychainCredentials
      Description: Credentials to unlock keychain

- [ ] Credentials Dockerhub
      Kind: Username with password
      Username: rwdevops999
      Password: 27X11x49@
      ID: DockerhubCredentials
      Description: Credentials for logging in onto Docker Hub

- Create pipeline (EUROPAY)
  Jenkins > Create a job
  Name: Europay
  Pipeline

  - [ ] Trigger: GitHub hook trigger for GITScm polling
  - [ ] Definition: Pipeline script from SCM
  - [ ] Scm: Git
  - [ ] Repository URL: https://github.com/rwdevops999/europayv5.git
  - [ ] Credentials: Credentials for accessing Github repositories
  - [ ] Branches to build: \*/main
