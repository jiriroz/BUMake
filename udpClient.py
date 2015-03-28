import socket

def Main():
	host = '127.0.0.1'
	port = 5001
	
	server = ('127.0.0.1',5000)
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.bind((host,port))
	
	message = input('->')
	while message != 'q':
		s.sendto(message.encode('utf-8'),server)
		data, addr = s.recvfrom(1024)
		print ('Received from server: ' + str(data))
		message = input('->')
	s.close()
	
if __name__ == '__main__':
	try:
		Main()
	except Exception as e:
		print (e)

input()