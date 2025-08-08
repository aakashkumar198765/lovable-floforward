#!/bin/bash

# Setup Virtual Host for React Component Library
# Choose your preferred method

echo "🚀 Setting up virtual host for React Component Library"
echo "Choose your preferred method:"
echo "1. Simple Python HTTP Server (Quick & Easy)"
echo "2. Node.js serve package (Recommended)"
echo "3. Apache Virtual Host"
echo "4. Nginx Virtual Host"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "📁 Starting Python HTTP Server..."
        echo "🌐 Your app will be available at: http://localhost:8000"
        cd dist && python3 -m http.server 8000
        ;;
    2)
        echo "📦 Installing serve package..."
        npm install -g serve
        echo "🌐 Your app will be available at: http://localhost:3000"
        serve -s dist -l 3000
        ;;
    3)
        echo "⚙️  Setting up Apache Virtual Host..."
        echo "1. Copy apache-vhost.conf to your Apache sites directory"
        echo "2. Add 'react-components.local' to your /etc/hosts file:"
        echo "   127.0.0.1    react-components.local"
        echo "3. Enable the site and restart Apache"
        echo ""
        echo "Commands for Ubuntu/Debian:"
        echo "sudo cp apache-vhost.conf /etc/apache2/sites-available/react-components.conf"
        echo "sudo a2ensite react-components"
        echo "sudo systemctl reload apache2"
        ;;
    4)
        echo "⚙️  Setting up Nginx Virtual Host..."
        echo "1. Copy nginx-vhost.conf to your Nginx sites directory"
        echo "2. Add 'react-components.local' to your /etc/hosts file:"
        echo "   127.0.0.1    react-components.local"
        echo "3. Enable the site and restart Nginx"
        echo ""
        echo "Commands for Ubuntu/Debian:"
        echo "sudo cp nginx-vhost.conf /etc/nginx/sites-available/react-components"
        echo "sudo ln -s /etc/nginx/sites-available/react-components /etc/nginx/sites-enabled/"
        echo "sudo systemctl reload nginx"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac 