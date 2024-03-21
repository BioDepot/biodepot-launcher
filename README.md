**RECOMMENDATION:** It is recommended that the user either use Firefox or Google Chrome as their primary browser.

# Intro
The main file for the project is the `App.js` file. It contains the main Routes (A.K.A pages) for the application. This is where you would add/remove pages for the application as needed. If you are onboarding for this project, I would start by trying to understand what the `App.js` file is doing.

**NOTE:** We are using functional React components and not class-based components. If you are looking for online React resources or are trying to including React code found online, make sure it is functional-based React.


The React files are either `.jsx` or `.js`.
- `.jsx` files can be considered basic React components whos only job is to render something to the page.
- `.js` files are utility/support files that contain some sort of functionality that the React components use. The only `.js` files that matter are the ones under the `hooks` folder. 

For example:
- `useHasDocker.js` is a custom React hook that checks if the user has docker installed and returns the status.

The other important file to look at is `constants.js`.

It contains all of the String constants and functions throughout the project. For example, it has the Github API key and the Docker install page URL. **__Notably__**, it has the list of workflow categories recognized by the project. If you need to add a new workflow category, simply add a new string constant for the workflow category itself and add it into the `CATEGORIES` list. Any workflow category string value **NEEDS** to match the folder name inside of the `workflows` repo, otherwise requests to the Github API for it will fail.

# Install as a user
1. Make sure `curl` is installed.
2. Install [Docker](https://docs.docker.com/get-docker/) or [Docker Desktop](https://docs.docker.com/desktop/) if you are planning to run Bwb on your computer.  Additionally, if using Linux follow the directions to [Managed Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).  Start the Docker Daemon and you are ready to go.
3. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) if you plan to launch Bwb on AWS.  Remember to input/install the appropriate credentials.
4. Download docker-machine for you platform of choice by visiting the following [LINK](https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/index.html).  Rename the downloaded file to `docker-machine` and place in your user's bin folder.  This is not the same bin folder that is included in the biodepot-launcher repo.
5. Unzip the package created by the BioDepot team and double click on the binary associated with your operating system/architecture.

# Install for development (Linux)
1. Make sure `curl` is installed.
2. Install [Docker](https://docs.docker.com/get-docker/) or [Docker Desktop](https://docs.docker.com/desktop/).  Additionally, if using Linux follow the directions to [Managed Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).
3. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).  Remember to input/install the appropriate credentials.
4. Download docker-machine for you platform of choice by visiting the following [LINK](https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/index.html).  Rename the downloaded file to `docker-machine` and place in your user's bin folder.
5. Update the package manager:
  - `sudo apt-get update`
6. Install curl:
  - `sudo apt-get install curl -y`
7. Install NodeJS and NPM:
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`
  - `source ~/.bashrc`
  - `nvm install v20.9.0`
8. Find or create a location to download the repo:
  - `git clone <repo>`
9. Install required NodeJS packages by navigating to the BwbLauncher/gui folder and installing the packages:
  - `npm install`
10. Install Neutralino by going to the BwbLauncher folder and running the following commands:
  - `sudo npm install -g @neutralinojs/neu`
  - `npm install`

# Developing for the project
If you are only trying to make React changes, A.K.A, changes that do not rely on the Neutralino API:

Then you can run `npm start` in the gui folder, make your changes, and you will be able to see them live.

Alternatively, if you would like to see the React changes directly through Neutralino, still assuming these are changes that do not rely on the Neutralino API:

You can run `npm start` in the gui folder and then run `neu run --frontend-lib-dev -- --window-enable-inspector` in the overall project folder. This make your React changes live and visible through Neutralino.  Additionally, change the value of "tokenSecurity" to the value "none" in the neutralino.config.json file.  Before commiting, change the "tokenSecurity" value back to "one-time".

**NOTE:** I'm not sure why but flags in the 2nd command above __needs__ to be ran in that specified order. The Neutralino CLI will ignore one of the flags if not in the order I have specified. To ensure you are running the command to see the live React changes and be able to inspect the console, make sure `--window-enable-inspector` is visible in the Neutralino CLI output.

If you are trying to make changes that involve the Neutralino API, you will need to re-build the React part of the project by running `npm run build` inside of the gui folder after every change, then running `neu run -- --window-enable-inspector`. At the moment, you cannot do live hot reloading with changes involving the Neutralino API.

Re-building the project after every change will be time consuming during development which is why I recommend isolating all of the React changes necessary, doing those using the hot reload feature of react so that you dont need to re-build the project every time while developing the react piece **AND THEN** moving on to the Neutralino API pieces.

# Neutralino Storage API
The project uses the Neutralino storage API to keep track of the most recent hash of a workflow downloaded from the Workflows repo on GitHub.

# WEIRD NECESSARY THINGS FOR NEUTRALINO
If you are trying to use the storage API for Neutralino, you **__MUST__** have a `.storage` directory made, it will not create it for you.  This directory is automatically created if not already present.

This is not documented...

If you are trying to use a part of the Neutralino API (`filesystem`, `os`, `events`, `storage`), you must have it under the `nativeAllowList` list inside of the `neutralino.config.json` file. 

For example:
- To use the `storage` functions of the Neutralino API, you must have `storage.*` inside of the `nativeAllowList`.

**NOTE:** Any changes made to the `neutralino.config.json` file must be followed by running the `neu update` command to ensure the changes take place.
