 /**
 * All of the constants for use throughout the project
 */
// String constants for workflow categories
export const DNA = "DNA";
export const RNA = "RNA";
export const SERVERLESS = "serverless";
export const NANOPORE = "nanopore";
export const GENERAL = "general";

// String constant for directory type
export const DIRECTORY = "DIRECTORY";

// String constant for README file name
export const README = "README.md";

// error code given when a command is not recognized
export const COMMAND_NOT_FOUND_CODE = 127;

// list of workflow categories
export const CATEGORIES = [DNA, RNA, GENERAL, SERVERLESS, NANOPORE];

// docker link for installation steps
export const DOCKER_PAGE_URL = "https://docs.docker.com/get-docker/";

export const BASE_README_GITHUB_URL = "BioDepot/BioDepot-workflow-builder/blob/master/README.md";

// list of file/directory exceptions to ignore while looking through workflow repo
export const EXCEPTIONS = ["images", '.bwb', 'widgets'];

// predicate function for filtering through workflow repo
export const FILTER_REPO = (item) => item.type === "dir" && !EXCEPTIONS.includes(item.name);

// STORAGE KEY FOR THE STORED COMMIT DATE OF BASE DOCUMENTATION
export const SAVED_BASEDOC_COMMIT_DATE = "SAVED_BASEDOC_COMMIT_DATE";

// constant for the github workflow commit url
export const WORKFLOW_COMMIT_GITHUB_URL = "/repos/BioDepot-LLC/workflows/commits";

// constant for launch in-browser
export const LAUNCH_BROSWER = "LAUNCH_BROWSER";

// constant for launch in-window
export const LAUNCH_WINDOW = "LAUNCH_WINDOW";

// constant for launch GitPod
export const LAUNCH_GITPOD = "LAUNCH_GITPOD";

// constant for launch on AWS
export const LAUNCH_AWS = "LAUNCH_AWS";

// CREATES THE STRING STORAGE KEY FOR THE STORED COMMIT DATE OF THE GIVEN WORKFLOW BELONGING TO GIVEN CATEGORY
// FORMAT: '<WORKFLOW-CATEGORY>-<WORKFLOW-NAME>-COMMIT-DATE'
export const GET_WORKFLOW_COMMIT_DATE_KEY = (category, name) => `${category}-${name}`;

export const LAUNCH_COMMAND = `docker run --rm   -p 6080:6080  -v  $PWD:/data      -v  /var/run/docker.sock:/var/run/docker.sock     -v /tmp/.X11-unix:/tmp/.X11-unix     --privileged --group-add root `;

// constant for BASIC RUN COMMAND WITHOUT WORKFLOW FLAG
export const BASIC_COMMAND = "docker run --rm   -p 6080:6080 -v  ${PWD}/:/data -v  /var/run/docker.sock:/var/run/docker.sock -v /tmp/.X11-unix:/tmp/.X11-unix --privileged --group-add root biodepot/bwb";

export const AWS_REGIONS = ["us-east-2", "us-east-1", "us-west-1", "us-west-2"];

export const AWS_INSTANCES = ["m5d.4xlarge"];
