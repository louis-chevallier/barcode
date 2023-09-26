start : server
bar :
	-rm *.png
	python bar.py

server :
	-rm *.log
	python server.py


