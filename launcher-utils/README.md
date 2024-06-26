## Note: docker-machine used with arm64 version is [rancher-machine](https://github.com/rancher/machine) and the appropriate LICENSE is included for both architecture versions.  The [amd64 version](https://gitlab-docker-machine-downloads.s3.amazonaws.com/main/index.html) is GitLab's fork.

### Details:
The tar package is installed from the Alpine 3.18 package repo.  Alpine 3.18 was chosen as its version of tar is 1.34 and GNU instead of BusyBox, which is used in Ubuntu.  There were some unexpected problems using the tar 1.35 version on that latest version of the Bash docker image.  This is why it was decided to use an older image of Alpine where Bash is manually installed.

### Commands for using the various utils:
##### For hash function:
```
docker run --rm -v <base installation location of launcher>:/workspace/mnt biodepot/launcher-utils:<version> "hash" /workspace/mnt/<workflow folder type>/<workflow folder name>
```
##### For launch function:
```
docker run --rm -v <base installation location of launcher>:/workspace/mnt -v ~/.aws:/root/.aws -v ~/.docker/machine:/root/.docker/machine biodepot/launcher-utils:<version> "launch" "<region>" "<instance type>" "<workflow name>" "<workflow dir>" "<os Windows/Linux/Darwin>" "<home directory>"
```

### Testing:
Switch the last line of the dockerfile:
```
ENTRYPOINT ["bash", "/workspace/interface.sh"]
```
with:
```
CMD ["bash"]
```
Build the image and the container can be started for testing with the following command:
```
docker run -it launcher-utils:<version>
```