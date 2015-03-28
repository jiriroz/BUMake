import socket
import threading
import os

def retrFile(name, sock):
	filename = sock.recv(1024)
	filename = filename.decode('utf-8')
	if os.path.isfile(filename):
		size = os.path.getsize(filename)
		sock.send(("EXISTS " + str(size)).encode('utf-8'))
		userResponse = sock.recv(1024)
		userResponse = userResponse.decode('utf-8')
		if userResponse[:2] == 'OK':
			f = open(filename, 'rb')
			bytesToSend = f.read(1024)
			sock.send(bytesToSend)
			sent = 1024
			while sent < size:
				bytesToSend = f.read(1024)
				sock.send(bytesToSend)
				sent += 1024
			f.close()
	else:
		sock.send(('ERR').encode('utf-8'))
	sock.close()
		
def Main():
	host = '127.0.0.1'
	port = 5000
	s = socket.socket()
	s.bind((host,port))
	
	s.listen(5)
	
	print ("Server started")
	while True:
		c, addr = s.accept()
		print ("client connected ip: " + str(addr))
		t = threading.Thread(target = retrFile,args = ("retrThread",c))
		t.start()
	s.close()

try:
	if __name__ == '__main__':
		Main()
except Exception as e:
	print (e)

input()