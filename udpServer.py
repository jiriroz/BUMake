import socket

def Main():
	host = '127.0.0.1'
	port = 5000
	
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.bind((host,port))
	
	print ('Server started')
	while True:
		data, addr = s.recvfrom(1024)
		print ('message from: ' + str(addr))
		print ('from connected user: ' + str(data))
		data = str(data).upper()
		print ('sending: ' + str(data))
		s.sendto(data.encode('utf-8'),addr)
	s.close()

if __name__ == '__main__':
	try:
		Main()
	except Exception as e:
		print (e)

input()