import base64
import io
from PIL import Image
import numpy as np

import os, gc, sys
import shutil
from utillc import *
import cherrypy
import threading
import queue
import json, pickle

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

port = 8081
if "PORT" in os.environ :
        port = int(os.environ["PORT"])
OK="OK"
FAILED="FAILED"
STATUS="status"

config = {
    '/' : {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': rootDir,
        
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
        self.args = args
        EKOT("listenning to %d" % port)
        
    def info(self) : return "info" #self.args.gitinfo
        
    @cherrypy.expose
    def index(self):
        EKOT("REQ main")
        with open('www/main.html', 'r') as file:
            data = file.read()
            data = data.replace("INFO", self.info())
            return data
    
    @cherrypy.expose            
    def uploadPhoto(self):
        '''receive a picture
        '''
        EKOT("REQ uploadPhoto")
        try :
            sz = int(cherrypy.request.headers['Content-Length'])
            rawData = cherrypy.request.body.read(sz)
            b = rawData
            z = b[b.find(b'/9'):]
            im = Image.open(io.BytesIO(base64.b64decode(z)))
            nim = np.asarray(im)
            EKOI(nim)
            rep = { STATUS : OK }
            
        except Exception as e :
            EKOX(e)
            rep = { STATUS : FAILED }
        EKOX(rep)
        return json.dumps(rep)

if __name__ == '__main__':

    app = App(sys.argv)
    cherrypy.log.error_log.propagate = False
    cherrypy.log.access_log.propagate = False
    EKO()
    cherrypy.quickstart(app, '/', config)
    EKOT("end server", n=LOG)

    
