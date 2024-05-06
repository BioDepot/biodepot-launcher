FROM alpine:3.18
RUN apk add --no-cache bash
RUN apk add --no-cache tar
RUN apk add --no-cache openssh
RUN mkdir -p /workspace/mnt
RUN mkdir -p /root/.docker/machine
RUN mkdir -p /root/.aws
COPY ./interface.sh /workspace
RUN chmod +x /workspace/interface.sh
COPY ./hash.sh /workspace
RUN chmod +x /workspace/hash.sh
COPY ./launch.sh /workspace
RUN chmod +x /workspace/launch.sh
COPY ./docker-machine /workspace
RUN chmod +x /workspace/docker-machine
RUN chmod 777 /workspace
ENTRYPOINT ["bash", "/workspace/interface.sh"]
