FROM centos:centos6.6
MAINTAINER Steven Rocker
RUN yum -y clean all
RUN yum -y update
RUN yum -y install epel-release
RUN yum -y install nodejs npm
RUN yum -y install git

ADD . /src

RUN cd /src \
	&& git clone https://github.com/angular/angular-seed.git \
	&& cd angular-seed \
	&& cd ../ \
	&& npm install . 

EXPOSE 8888

ENTRYPOINT ["npm"]

CMD ["start", "/src"]