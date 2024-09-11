**Note:** It is recommended to use Firefox or Google Chrome as a primary browser while running the Launcher.

# Supported Operating Systems
- Ubuntu
- Windows 10/11 - Ubuntu WSL2
- macOS (M-Series)

# Install as a user on Ubuntu/Mac
1. Make sure `curl` is installed.
2. Install [Docker Engine](https://docs.docker.com/engine/install/) or [Docker Desktop](https://docs.docker.com/desktop/).  If using Ubuntu and Docker Engine, follow the directions to [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).  If using Docker Desktop, start Docker.
3. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) if you plan to launch Bwb on AWS.  Remember to input/configure the appropriate credentials.
4. Download docker-machine for you platform of choice by using your OS specific script in the [dm_install_scripts](https://github.com/BioDepot/biodepot-launcher/tree/main/dm_install_scripts) folder.  Only required if you plan on using AWS.
5. Unzip the [package](https://raw.githubusercontent.com/Biodepot/biodepot-launcher/main/binaries.zip) created by the BioDepot team and double click on the binary associated with your operating system.

# Install as a user on Windows WSL2 using Ubuntu
1. Install [Docker Desktop](https://docs.docker.com/desktop/).  During the installation you will be asked to install WSL2, follow the instructions to do so.  If asked which version of Linux to install, install Ubuntu.  Remember your root/admin/sudo password for later.
2. If you didn't install a version of Ubuntu during installation of WSL2, you'll have to install Ubuntu from the Microsoft Store.
3. In the Docker Desktop application, click the Gear icon in the upper right corner of the application to enter the settings.  Under the "General" tab, make sure that the "User the WSL2 based engine" is checked.
4. In the Docker Desktop settings, under the "Resources" tab, click the "WSL Integration" sub-tab and select Ubuntu in the right hand pane.  Click the "Apply & Restart" button.
5. In the Windows search bar, type in Ubuntu and select the icon that appears.  A terminal window should show up.
6. Make sure that you are in the correct user directory by running the following command: `cd ~`
7. Get the binaries.zip file with the follow command: `wget https://raw.githubusercontent.com/Biodepot/biodepot-launcher/main/binaries.zip`
8. Now, install necessary packages with the following command: `sudo apt install unzip firefox libwebkit2gtk-4.0-37`
9. Run the following command: `unzip binaries.zip`
10. Go to the docker-machine installation directory: `cd binaries/binaries/dm_install_scripts/ubuntu`.  Then install docker-machine by running the following command: `./ubuntu.sh`
11. Close and reopen the terminal, refer the step 5 for how to open the terminal.
12. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) if you plan to launch Bwb on AWS.  Remember to input/configure the appropriate credentials.
13. To run the launcher, first enter the directory when it is contained: `cd binaries/binaries`.  Now run the following command to run the launcher: `./neutralino-linux_x64`

# Install for development (Ubuntu)
1. Install [Docker Engine](https://docs.docker.com/engine/install/).  Follow the directions to [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).
2. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).  Remember to input/install the appropriate credentials.
3. Download docker-machine for you platform of choice by using your OS specific script in the [dm_install_scripts](https://github.com/BioDepot/biodepot-launcher/tree/main/dm_install_scripts) folder.
4. Update the package manager:
  - `sudo apt-get update`
5. Install curl:
  - `sudo apt-get install curl -y`
6. Install NodeJS and NPM:
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`
  - `source ~/.bashrc`
  - `nvm install v20.9.0`
7. Find or create a location to download the repo:
  - `git clone <repo>`
8. Install required NodeJS packages by navigating to the gui folder and installing the packages:
  - `npm install`
9. Install Neutralino by going to the launcher's root folder and running the following command:
  - `npm install -g @neutralinojs/neu`

# Developing for the project
To build and run the project, navigate to the gui folder and run the command `npm run build`.  This will build the React portion of the application.  Next navigate to the launcher's root folder and run the command `neu build --release`.  This will build the binaries of the Neutralino application, which are located in the dist/gui-app folder.  Navigate to this folder and `chmod +x gui-app-linux_x64` to give execute permissions to the binary.  To start the app, run the gui-app-linux_x64 binary.

To run the project with a debugger in development mode in the gui folder run `npm run build` followed by `npm start`.  In the launcher's root folder run the following command `neu run -- --window-enable-inspector`.  For any changes, the process that was followed was stopping neutralino, stopping the npm server, rebuilding, starting the npm server, then restarting neutralino with the previous command.  Rebuilding for every change may not be necessary.

# Potential sources of error
- Sometimes when launching a workflow on AWS, the instance will not correctly provision.  This is a docker-machine bug.  There is a log file called dm-output.log that is created when launching a workflow on AWS.  If the AWS provisioning takes longer than 5 minutes, check the log.  If the last line in the log reads `Error creating machine: Failed to obtain lock: Maximum number of retries (60) exceeded` then the bug has occurred.  Simply relaunch a workflow.  Also, make sure to close any instance that may have been created on AWS to prevent extraneous charges.
- It was noticed on Ubuntu with Docker Engine:  After a fresh install of Docker Engine, if starting the Launcher right afterwards, the Launcher will not detect Docker.  To fix this, restart Ubuntu.
