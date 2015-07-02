# this dockerfile is used to simulate a webserver that works around
# cross browser differences with file:/// handling (especially chrome)
FROM nginx
MAINTAINER Alexander Jung-Loddenkemper <alexander@julo.ch>
ADD ./app/ /test/
ADD ./nginx.conf /etc/nginx/nginx.conf
