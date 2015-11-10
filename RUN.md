### Build the docker image
```bash
docker build --name steven/citeshare:latest .
```

### Run the image
```bash
docker run -P -d steven/citeshare:latest
```

### Get the IP and Port
```bash
IP=$(docker-machine ip default) PORT=$(docker port citeshare 8888 | sed -e 's/.*://') && echo $IP:$PORT
```