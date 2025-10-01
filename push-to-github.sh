#!/bin/bash

echo "🚀 Midas Core 2.0 - GitHub Push Script"
echo "======================================"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "📋 Current status:"
git status --short
echo ""

echo "🔍 Remote repository:"
git remote -v
echo ""

echo "📝 Recent commits:"
git log --oneline -5
echo ""

echo "🔐 GitHub Authentication Options:"
echo "1. Personal Access Token (Recommended)"
echo "2. GitHub CLI"
echo "3. Manual push command"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📖 To use Personal Access Token:"
        echo "1. Go to: https://github.com/settings/tokens"
        echo "2. Click 'Generate new token (classic)'"
        echo "3. Select scopes: repo, workflow, write:packages"
        echo "4. Copy the token"
        echo ""
        read -p "Enter your GitHub username: " username
        read -s -p "Enter your Personal Access Token: " token
        echo ""
        echo ""
        echo "🚀 Pushing to GitHub..."
        git push https://$username:$token@github.com/Akshit358/Midas-Core---Financial-Transaction-Processing-System.git main
        ;;
    2)
        echo ""
        echo "🔧 Using GitHub CLI..."
        if command -v gh &> /dev/null; then
            gh auth login
            git push origin main
        else
            echo "❌ GitHub CLI not installed. Install it first:"
            echo "   brew install gh"
            echo "   or visit: https://cli.github.com/"
        fi
        ;;
    3)
        echo ""
        echo "📋 Manual push command:"
        echo "git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/Akshit358/Midas-Core---Financial-Transaction-Processing-System.git main"
        echo ""
        echo "Replace YOUR_USERNAME and YOUR_TOKEN with your actual credentials"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Script completed!"
echo "🌐 View your repository at: https://github.com/Akshit358/Midas-Core---Financial-Transaction-Processing-System"
