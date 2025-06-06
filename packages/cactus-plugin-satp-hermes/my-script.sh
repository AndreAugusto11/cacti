cd ../..
yarn configure
cd packages/cactus-plugin-satp-hermes

rm -rf cache/
sudo docker rm -f $(sudo docker ps -a -q)
yarn build:bundle
yarn docker:build:dev
docker push aaugusto11/cacti-satp-hermes-gateway:$(git rev-parse --short HEAD)-$(date +\"%Y-%m-%d\")
