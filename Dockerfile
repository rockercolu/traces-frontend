FROM centos:centos7
MAINTAINER Steven Rocker

RUN yum -y clean all
RUN yum -y install epel-release git tar git gcc gcc-c++ make

# Import Node GPG keys
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done

# set log level
ENV NPM_CONFIG_LOGLEVEL info

# node version to install
ENV NODE_VERSION 0.12.2

# Fetch Node.JS tarball, GPG key and verify key before installing Node.JS
RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
# && gpg --verify SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc

ADD . /src

RUN npm install bower -g

RUN echo '{ "allow_root": true }' > /root/.bowerrc

RUN cd /src \
	&& git clone https://github.com/angular/angular-seed.git \
	&& cd angular-seed \
  && npm install . \
	&& cd ../ \
  && bower install

EXPOSE 8888

ENTRYPOINT ["/src/entrypoint.sh"]

CMD []