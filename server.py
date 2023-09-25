

import os, gc, sys
import shutil
from utillc import *
import cherrypy
import threading
import queue
import json, pickle
import process
import time
import time as _time
from time import gmtime, strftime
from datetime import timedelta
import PIL
from PIL import Image
import os
fileDir = os.path.dirname(os.path.abspath(__file__))
rootDir = os.path.join(fileDir, 'www')
EKOX(rootDir)

port = 8080
if "PORT" in os.environ :
        port = int(os.environ["PORT"])
OK="OK"
FAILED="FAILED"
config = {
    '/' : {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': rootDir,
        #      'tools.staticdir.dir': '/mnt/hd2/users/louis/dev/git/three.js/examples/test',
        
    },
    'global' : {
        'server.socket_host' : '0.0.0.0', #192.168.1.5', #'127.0.0.1',
        'server.socket_port' : port,
        'server.thread_pool' : 8,
        'log.screen': False, #True,
        'log.error_file': './error.log',
        'log.access_file': './access.log'
    }
}

class App:
    """
    the Webserver
    """
    def __init__(self, args) :
        EKOT("app init")

        
    def info(self) :
        return self.args.gitinfo
        
    @cherrypy.expose
    def main(self):
        EKOT("REQ main")
        with open('www/main.html', 'r') as file:
            data = file.read()
            data = data.replace("INFO", self.info())
            return data
        
