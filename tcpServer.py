import socket

def Main():
	host = '127.0.0.1'
	port = 5000
	
	s = socket.socket()
	s.bind((host,port))
	
	s.listen(1)
	
	c, addr = s.accept()
	print ('connection from ' + str(addr))
	while True:
		data = c.recv(1024)
		if not data:
			break
		print ('from connected user: ' + str(data))
		data = str(data).upper()
		print ('sending: ' + str(data))
		c.send(data.encode('utf-8'))
	c.close()


if __name__ == '__main__':
	try:
		Main()
	except Exception as e:
		print (e)



input()