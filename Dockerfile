FROM registry.diligent.la/net.diligentec.template/net.diligentec.template.images:node-22.13.1 AS build

ARG VITE_ENVIRONMENT=development
ARG VITE_BASE_API
ARG VITE_IMAGE_VISOR
ARG VITE_APP_VERSION
ARG VITE_APP_CODE

ENV VITE_BASE_API=$VITE_BASE_API
ENV VITE_IMAGE_VISOR=$VITE_IMAGE_VISOR
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_APP_CODE=$VITE_APP_CODE
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT

WORKDIR /src


RUN echo "🔧 CONFIGURACIÓN DE BUILD:"
RUN echo "➡ VITE_ENVIRONMENT: $VITE_ENVIRONMENT"
RUN echo "➡ VITE_BASE_API: $VITE_BASE_API"
RUN echo "➡ VITE_IMAGE_VISOR: $VITE_IMAGE_VISOR"
RUN echo "➡ VITE_APP_VERSION: $VITE_APP_VERSION" 
RUN echo "➡ VITE_APP_CODE: $VITE_APP_CODE"

COPY ["net.diligentec.web.shell/package.json", "./package.json"]
COPY ["net.diligentec.web.shell/yarn.lock", "./yarn.lock"]
COPY [".ci-cd/nginx.conf", "./"]

RUN yarn --ignore

COPY ["net.diligentec.web.shell/", "./"]

RUN rm -rf dist && \
    if [ "$VITE_ENVIRONMENT" = "production" ]; then yarn build-prd; fi && \
    if [ "$VITE_ENVIRONMENT" = "qa" ]; then yarn build-qas; fi && \
    if [ "$VITE_ENVIRONMENT" = "development" ]; then yarn build-dev; fi

FROM registry.diligent.la/net.diligentec.template/net.diligentec.template.images:stable-alpine3.20-slim AS final


COPY --from=build /src/dist/. /usr/share/nginx/html/

COPY --from=build /src/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 7070

CMD ["nginx", "-g", "daemon off;"]