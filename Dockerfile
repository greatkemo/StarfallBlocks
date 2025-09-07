FROM nginx:alpine

# Copy the HTML file to nginx web root
COPY starfall-blocks.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration if it exists
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
