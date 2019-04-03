deploy:
	npm run build
	scp -r build/* root@79.143.24.10:/home/ubuntu/live_chats/live_chats/