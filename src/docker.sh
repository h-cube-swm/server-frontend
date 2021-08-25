# Execute docker for development environment

docker run          \
--rm                \
-it                 \
-v $(pwd):/app      \
-w /app             \
-p 3000:3000        \
node:14             \
/bin/bash -c "yarn; (echo Start compile. Development server will be opened at port 3000.;yarn start 1>/dev/null 2>/dev/null) & /bin/bash"