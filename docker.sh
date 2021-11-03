# Execute docker for development environment

docker run          \
--rm                \
-it                 \
-v $(pwd)/src:/app  \
-w /app             \
node:14             \
/bin/bash