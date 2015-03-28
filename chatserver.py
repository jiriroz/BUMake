import socket
import time


def Main():
	host = '127.0.0.1'
	port = 5000

	clients = []

	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.bind((host,port))
	s.setblocking(0)

	quitting = False
	print ("Server started")

	while not quitting:
		try:
			data, addr = s.recvfrom(1024)
			if "Quit" in str(data):
				quitting = True
			if addr not in clients:
				clients.append(addr)
			print (time.ctime(time.time()) + str(addr) + ': :' + str(data))
			for client in clients:
				s.sendto(data.encode('utf-8'), client)
		except:
			pass
	s.close()

try:
	if __name__ == '__main__':
		Main()
except Exception as e:
	print (e)

input()