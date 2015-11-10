FROM centos:centos6.6
MAINTAINER Steven Rocker
RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm; yum clean all

ADD . /src

RUN cd /src \
	&& git clone https://github.com/angular/angular-seed.git \
	&& cd angular-seed \
	&& cd ../ \
	&& npm install . \
	&& npm start

EXPOSE 8888

ENTRYPOINT ["npm"]

CMD ["start"]